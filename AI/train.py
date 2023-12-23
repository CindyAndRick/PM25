import numpy as np
import pandas as pd
import datetime as dt
import os
from keras.models import Sequential
from keras.layers import Dense, LSTM
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from keras.models import load_model
import pymysql

# 读取数据 
if (0):
    db = pymysql.connect(host='139.224.130.38', port=30711, user='Rick', password='cindy030711', database='pm25')
    cursor = db.cursor()
    sql1 = 'select * from data join city on data.citY_id=city.id'
    cursor.execute(sql1)
    data = cursor.fetchall()
    data = pd.DataFrame(list(data))
    data.to_csv('data_origin.csv', index=False)
    exit()

# 数据预处理
if (0):
    df = pd.read_csv('data_origin.csv')
    # 将日期和时间列合并为一个datetime列
    df['datetime'] = pd.to_datetime(df['date'] + ' ' + df['hour'].astype(str) + ':00:00')

    # 将datetime列设置为索引
    df.set_index('datetime', inplace=True)

    # 删除原始的日期和时间列
    df.drop(['date', 'data_id', 'city_name'], axis=1, inplace=True)

    df.to_csv('data_indexed.csv', index=True)
    exit()

# 读取数据集
data = pd.read_csv('data_indexed.csv')

# 将datetime列转换为时间戳
# data['datetime'] = pd.to_datetime(data['datetime'])
# data['datetime'] = data['datetime'].map(dt.datetime.timestamp)
data.drop(['datetime'], axis=1, inplace=True)
data.drop(['city_id'], axis=1, inplace=True)

print(data.head())
# hour   aqi  pm25   pm10  so2   no2    co     o3         lng        lat

# 用均值替换NaN值
data.fillna(data.mean(), inplace=True)

# 将数据进行归一化处理
scaler = MinMaxScaler(feature_range=(0, 1))
data_scaled = scaler.fit_transform(data)

# 将数据集转换为适合LSTM的数据格式
X = []
Y = []
look_back = 8  # 步长
for i in range(look_back, len(data_scaled)):
    X.append(data_scaled[i-look_back:i, :])
    Y.append(data_scaled[i, 1:8])
X, Y = np.array(X), np.array(Y)

print('X.shape:', X.shape)

# 划分训练集和测试集
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=0)

model = 0
train_on_load = True

filename = 'LSTM.h5'
if(os.path.exists(filename) and train_on_load):
    # 加载LSTM模型
    print('load model')
    model = load_model(filename)
else:
    print('build model')
    # 构建LSTM模型
    model = Sequential()
    model.add(LSTM(units=5, return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])))
    model.add(LSTM(units=5))
    model.add(Dense(Y_train.shape[1]))
    model.compile(loss='mean_squared_error', optimizer='adam')

if(1):
    model.fit(X_train, Y_train, epochs=50, batch_size=64, validation_data=(X_test, Y_test), verbose=2)

    # 保存模型
    filename = 'LSTM.h5'
    model.save(filename)

# 使用模型进行预测
Y_pred = model.predict(X_test)

print(Y_pred.shape)

Y_pred_pad = np.pad(Y_pred, ((0, 0), (1, 2)), mode='constant', constant_values=0)
Y_test_pad = np.pad(Y_test, ((0, 0), (1, 2)), mode='constant', constant_values=0)

print(Y_pred_pad.shape)
print(Y_test_pad.shape)

# 将预测结果反归一化
Y_pred = scaler.inverse_transform(Y_pred_pad)
Y_test = scaler.inverse_transform(Y_test_pad)

print(Y_pred)
print(Y_pred.shape)

# 计算RMSE
rmse = np.sqrt(np.mean(((Y_pred - Y_test) ** 2)))
print('Test RMSE: %.3f' % rmse)