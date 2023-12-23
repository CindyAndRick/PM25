from db import db, User, City, Data, Favourite
from flask import Blueprint, request, jsonify
from datetime import date
data_bp = Blueprint('data', __name__)

# 获取某天某时所有城市数据
@data_bp.route('/getAQData', methods=['POST'])
def getTodayData():
    date = request.get_json()['date']
    hour = request.get_json()['hour']
    datas = Data.query.filter_by(date=date).filter_by(hour=hour).all()
    return jsonify({'code': 200, 'msg': 'success', 'data': [data.to_dict() for data in datas]})

# 获取某城市某段时间的数据
@data_bp.route('/getAQDataByCity', methods=['POST'])
def getAQDataByCity():
    start_date = request.get_json()['start_date']
    end_date = request.get_json()['end_date']
    city_id = request.get_json()['city_id']
    datas = Data.query.filter(Data.date >= start_date).filter(Data.date <= end_date).filter_by(city_id=city_id).all()
    return jsonify({'code': 200, 'msg': 'success', 'data': [data.to_dict() for data in datas]})