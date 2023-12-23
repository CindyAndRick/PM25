from db import db, User, City, Data, Favourite
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, request, jsonify
city_bp = Blueprint('city', __name__)

@city_bp.route('/getAllCity', methods=['GET'])
def getAllCity():
    cities = City.query.all()
    return jsonify({'code': 200, 'msg': '获取成功', 'data': [city.to_dict() for city in cities]})

@city_bp.route('/favourCity', methods=['POST'])
@jwt_required()
def favourCity():
    city_id = request.get_json()['city_id']
    user_id = get_jwt_identity()
    isFavour = Favourite.query.filter_by(user_id=user_id, city_id=city_id).first()
    if isFavour:
        try:
            db.session.delete(isFavour)
            db.session.commit()
            cities = Favourite.query.filter_by(user_id=user_id).all()
            return jsonify({'code': 200, 'msg': 'success unfavour', 'data': [city.to_dict() for city in cities]})
        except Exception as e:
            cities = Favourite.query.filter_by(user_id=user_id).all()
            return jsonify({'code': 400, 'msg': 'fail unfavour', 'error': str(e), 'data': [city.to_dict() for city in cities]})
    else:
        favourite = Favourite(user_id, city_id)
        try:
            db.session.add(favourite)
            db.session.commit()
            cities = Favourite.query.filter_by(user_id=user_id).all()
            return jsonify({'code': 200, 'msg': 'success favour', 'data': [city.to_dict() for city in cities]})
        except Exception as e:
            cities = Favourite.query.filter_by(user_id=user_id).all()
            return jsonify({'code': 400, 'msg': 'fail favour', 'error': str(e), 'data': [city.to_dict() for city in cities]})

@city_bp.route('/getFavourCity', methods=['GET'])
@jwt_required()
def getFavourCity():
    user_id = get_jwt_identity()
    cities = Favourite.query.filter_by(user_id=user_id).all()
    return jsonify({'code': 200, 'msg': 'success', 'data': [city.to_dict() for city in cities]})