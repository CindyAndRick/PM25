from flask_sqlalchemy import SQLAlchemy
from datetime import date

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32))
    password = db.Column(db.String(32))
    nickname = db.Column(db.String(32))
    avatar = db.Column(db.String(256))
    phone = db.Column(db.String(32))
    admin = db.Column(db.Integer, default=0)

    def __init__(self, username, password, nickname, avatar, phone, admin):
        self.username = username
        self.password = password
        self.nickname = nickname
        self.avatar = avatar
        self.phone = phone
        self.admin = admin

    def __repr__(self):
        return '<User %r>' % self.username
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'nickname': self.nickname,
            'avatar': self.avatar,
            'phone': self.phone,
            'admin': self.admin
        }
    
class City(db.Model):
    __tablename__ = 'city'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32))

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<City %r>' % self.name
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }
    
class Data(db.Model):
    __tablename__ = 'data'
    city_id = db.Column(db.Integer, db.ForeignKey('city.id'), primary_key=True)
    date = db.Column(db.Date, primary_key=True)
    hour = db.Column(db.Integer, primary_key=True)
    pm25 = db.Column(db.Integer)
    pm10 = db.Column(db.Integer)
    so2 = db.Column(db.Integer)
    no2 = db.Column(db.Integer)
    co = db.Column(db.Integer)
    o3 = db.Column(db.Integer)

    def __init__(self, city_id, date, hour, pm25, pm10, so2, no2, co, o3):
        self.city_id = city_id
        self.date = date
        self.hour = hour
        self.pm25 = pm25
        self.pm10 = pm10
        self.so2 = so2
        self.no2 = no2
        self.co = co
        self.o3 = o3

    def __repr__(self):
        return '<Data %r>' % self.city_id
    
    def to_dict(self):
        return {
            'city_id': self.city_id,
            'date': self.date.strftime('%Y-%m-%d'),
            'hour': self.hour,
            'pm25': self.pm25,
            'pm10': self.pm10,
            'so2': self.so2,
            'no2': self.no2,
            'co': self.co,
            'o3': self.o3
        }
    
class Favorite(db.Model):
    __tablename__ = 'favorite'
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    city_id = db.Column(db.Integer, db.ForeignKey('city.id'), primary_key=True)

    def __init__(self, user_id, city_id):
        self.user_id = user_id
        self.city_id = city_id

    def __repr__(self):
        return '<Favorite %r>' % self.user_id
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'city_id': self.city_id
        }

