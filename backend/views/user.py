from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, decode_token
from jwt.exceptions import ExpiredSignatureError
from datetime import timedelta

from db import db, User, City, Data, Favourite

user_bp = Blueprint('user', __name__)

expire_time = timedelta(days=1)  # token过期时间

def is_token_expired(token):
    try:
        decode_token(token)
        return False  # Token is still valid
    except ExpiredSignatureError:
        return True  # Token has expired

@user_bp.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    user = User.query.filter_by(username=username, password=password).first()
    if user:
        token = create_access_token(identity=user.id, expires_delta=expire_time)
        return jsonify({'code': 200, 'msg': 'success', 'data': user.to_dict(), 'token': token})
    else:
        return jsonify({'code': 400, 'msg': 'fail'})
    
@user_bp.route('/register', methods=['POST'])
def register():
    username = request.form.get('username')
    password = request.form.get('password')
    nickname = request.form.get('nickname')
    phone = request.form.get('phone')
    user = User(username, password, nickname, phone, 0)
    try:
        db.session.add(user)
        db.session.commit()
        user = User.query.filter_by(username=username, password=password).first()
        token = create_access_token(identity=user.id, expires_delta=expire_time)
        return jsonify({'code': 200, 'msg': 'success', 'data': user.to_dict(), 'token': token})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'fail', 'data': str(e)})

# 检验token，用于前端确认登录状态
@user_bp.route('/verifyToken', methods=['POST'])
def verifyToken():
    token = request.headers.get('Authorization').split()[1]
    if is_token_expired(token):
        return jsonify({'code': 400, 'msg': 'token expired'})
    else:
        return jsonify({'code': 200, 'msg': 'success'})

# 更新用户信息
@user_bp.route('/update', methods=['POST'])
@jwt_required()
def update():
    user = User.query.get(get_jwt_identity())
    if user:
        user.nickname = request.form.get('nickname')
        user.username = request.form.get('username')
        user.phone = request.form.get('phone')
        db.session.commit()
        return jsonify({'code': 200, 'msg': 'success', 'data': user.to_dict()})
    else:
        return jsonify({'code': 400, 'msg': 'fail'})

# 更换密码
@user_bp.route('/changePassword', methods=['POST'])
@jwt_required()
def changePassword():
    user = User.query.get(get_jwt_identity())
    if user:
        old_password = request.form.get('old_password')
        new_password = request.form.get('new_password')
        if user.password == old_password:
            user.password = new_password
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'success'})
        else:
            return jsonify({'code': 400, 'msg': 'wrong password'})
    else:
        return jsonify({'code': 400, 'msg': 'fail'})
