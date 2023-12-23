from flask_sqlalchemy import SQLAlchemy
from datetime import date

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32))
    password = db.Column(db.String(32))
    nickname = db.Column(db.String(32))
    phone = db.Column(db.String(32))
    admin = db.Column(db.Integer, default=0)

    def __init__(self, username, password, nickname, phone, admin):
        self.username = username
        self.password = password
        self.nickname = nickname
        self.phone = phone
        self.admin = admin

    def __repr__(self):
        return '<User %r>' % self.username
    
    def to_dict(self):
        return {
            'username': self.username,
            'nickname': self.nickname,
            'phone': self.phone,
            'admin': self.admin
        }
    
class City(db.Model):
    __tablename__ = 'city'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32))
    lng = db.Column(db.String(255))
    lat = db.Column(db.String(255))

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<City %r>' % self.name
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'lng': self.lng,
            'lat': self.lat
        }
    
class Data(db.Model):
    __tablename__ = 'data'
    city_id = db.Column(db.Integer, db.ForeignKey('city.id'), primary_key=True)
    date = db.Column(db.Date, primary_key=True)
    hour = db.Column(db.Integer, primary_key=True)
    aqi = db.Column(db.Float)
    pm25 = db.Column(db.Float)
    pm10 = db.Column(db.Float)
    so2 = db.Column(db.Float)
    no2 = db.Column(db.Float)
    co = db.Column(db.Float)
    o3 = db.Column(db.Float)
    predict = db.Column(db.Integer, default=0)

    def __init__(self, city_id, date, hour, aqi, pm25, pm10, so2, no2, co, o3, predict):
        self.city_id = city_id
        self.date = date
        self.hour = hour
        self.aqi = aqi
        self.pm25 = pm25
        self.pm10 = pm10
        self.so2 = so2
        self.no2 = no2
        self.co = co
        self.o3 = o3
        self.predict = predict

    def __repr__(self):
        return '<Data %r %r %r>' % self.city_id % self.date % self.hour
    
    def to_dict(self):
        return {
            'city_id': self.city_id,
            'date': self.date.strftime('%Y-%m-%d'),
            'hour': self.hour,
            'aqi': self.aqi,
            'pm25': self.pm25,
            'pm10': self.pm10,
            'so2': self.so2,
            'no2': self.no2,
            'co': self.co,
            'o3': self.o3,
            'predict': self.predict
        }
    
class Favourite(db.Model):
    __tablename__ = 'favourite'
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    city_id = db.Column(db.Integer, db.ForeignKey('city.id'), primary_key=True)

    def __init__(self, user_id, city_id):
        self.user_id = user_id
        self.city_id = city_id

    def __repr__(self):
        return '<Favourite %r %r>' % self.user_id % self.city_id
    
    def to_dict(self):
        return {
            'city_id': self.city_id
        }

