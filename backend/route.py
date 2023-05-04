from db import db, User, City, Data, Favorite
from flask import Blueprint, request, jsonify
api = Blueprint('api', __name__)

@api.route('/user/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    user = User.query.filter_by(username=username, password=password).first()
    if user:
        return jsonify({'code': 200, 'msg': '登录成功', 'data': user.to_dict()})
    else:
        return jsonify({'code': 400, 'msg': '用户名或密码错误'})
    
@api.route('/user/register', methods=['POST'])
def register():
    username = request.form.get('username')
    password = request.form.get('password')
    nickname = request.form.get('nickname')
    avatar = request.form.get('avatar')
    phone = request.form.get('phone')
    user = User(username, password, nickname, avatar, phone, 0)
    db.session.add(user)
    db.session.commit()
    return jsonify({'code': 200, 'msg': '注册成功'})

@api.route('/user/update', methods=['POST'])
def update():
    id = request.form.get('id')
    nickname = request.form.get('nickname')
    avatar = request.form.get('avatar')
    phone = request.form.get('phone')
    user = User.query.get(id)
    user.nickname = nickname
    user.avatar = avatar
    user.phone = phone
    db.session.commit()
    return jsonify({'code': 200, 'msg': '修改成功'})

@api.route('/user/changePassword', methods=['POST'])
def changePassword():
    id = request.form.get('id')
    oldPassword = request.form.get('oldPassword')
    newPassword = request.form.get('newPassword')
    user = User.query.get(id)
    if user.password == oldPassword:
        user.password = newPassword
        db.session.commit()
        return jsonify({'code': 200, 'msg': '修改成功'})
    else:
        return jsonify({'code': 400, 'msg': '原密码错误'})
