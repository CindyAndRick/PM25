import numpy as np
import pandas as pd
import datetime as dt
from keras.models import Sequential
from keras.layers import Dense, LSTM
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from keras.models import load_model
import pymysql

look_back = 8  # 步长

db = pymysql.connect(host='xxx.xxx.xxx.xxx', port=xxx, user='xxx', password='xxx', database='xxx')
cursor = db.cursor()

# 获取所有城市
sql1 = 'select * from city'
cursor.execute(sql1)
cityList = cursor.fetchall()
cityList = list({'id': city[0], 'name': city[1], 'lng': city[2], 'lat': city[3]} for city in cityList)
# print(cityList)

for city in cityList:
    # 获取某城市前2~9小时内的数据
    start_date = dt.datetime.now() - dt.timedelta(hours=9)
    start_hour = start_date.hour
    start_date = start_date.strftime('%Y-%m-%d')
    end_date = dt.datetime.now() - dt.timedelta(hours=2)
    end_hour = end_date.hour
    end_date = end_date.strftime('%Y-%m-%d')
    # 用于记录预测的数据的时间
    predict_datetime = dt.datetime.now() - dt.timedelta(hours=1)

    sql2 = '''SELECT d.date, d.hour, d.aqi, d.pm25, d.pm10, d.so2, d.no2, d.co, d.o3, c.lng, c.lat 
                FROM data as d join city as c on d.city_id=c.id 
                WHERE d.date >= '{}' AND d.date <= '{}' AND d.hour >= {} 
                AND d.hour <= {} AND d.city_id = {}'''.format(start_date, end_date, start_hour, end_hour, city['id'])
    # print(sql2)
    cursor.execute(sql2)
    data = cursor.fetchall()
    data = pd.DataFrame(list(data), columns=['date', 'hour', 'aqi', 'pm25', 'pm10', 'so2', 'no2', 'co', 'o3', 'lng', 'lat'])
    
    # 按照日期和时间排序
    data['datetime'] = pd.to_datetime(data['date'].astype(str) + ' ' + data['hour'].astype(str) + ':00:00')
    data.set_index('datetime', inplace=True)
    data.drop(['date'], axis=1, inplace=True)

    # print(data)

    # 用均值替换NaN值
    data.fillna(data.mean(), inplace=True)
    data = np.array(data).astype(float)

    # 将数据进行归一化处理
    scaler = MinMaxScaler(feature_range=(0, 1))
    data_scaled = scaler.fit_transform(data)

    # X: [hour, aqi, pm25, pm10, so2, no2, co, o3, lng, lat]
    # Y: [aqi, pm25, pm10, so2, no2, co, o3]
    X = np.array(data_scaled).astype(float)
    X = np.expand_dims(X, axis=0)

    # 预测过去2小时（数据尚未采集到的）以及未来24小时的数据
    for i in range(27):

        # 预测
        model = load_model('LSTM.h5')
        Y = model.predict(X)

        # 将预测结果填充并反归一化
        Y_pad = np.pad(Y, ((0, 0), (1, 2)), mode='constant', constant_values=0)

        Y = scaler.inverse_transform(Y_pad)

        print('city:', city['id'], city['name'])
        print('predict_datetime:', predict_datetime.strftime('%Y-%m-%d %H:00:00'))
        print('result:', Y)

        # 将预测结果写入数据库
        sql3 = '''INSERT INTO data (date, hour, aqi, pm25, pm10, so2, no2, co, o3, city_id, predict)
                VALUES ('{0}', {1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9}, 1)'''.format(predict_datetime.strftime('%Y-%m-%d'), 
                predict_datetime.hour, Y[0][1], Y[0][2], Y[0][3], Y[0][4], Y[0][5], Y[0][6], Y[0][7], city['id'])

        try:
            cursor.execute(sql3)
            db.commit()
        except Exception as e:
            print(e, city['id'], city['name'], predict_datetime.strftime('%Y-%m-%d %H:00:00'))
            db.rollback()

        Y[0][0] = predict_datetime.hour
        Y[0][8] = city['lng']
        Y[0][9] = city['lat']
        # print(Y)

        # 删除X第一行，并将Y_pad插入最后一行
        data = np.delete(data, 0, axis=0)
        data = np.append(data, Y, axis=0)
        data_scaled = scaler.fit_transform(data)
        X = np.array(data_scaled).astype(float)
        X = np.expand_dims(X, axis=0)

        predict_datetime = predict_datetime + dt.timedelta(hours=1)
        # print('predict_datetime:', predict_datetime)