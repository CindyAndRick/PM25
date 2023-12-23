from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from views import db, api
from views.user import user_bp
from views.data import data_bp
from views.city import city_bp

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SECRET_KEY'] = 'random key'
jwt = JWTManager(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://Rick:cindy030711@139.224.130.38:30711/pm25'
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
db.init_app(app)
app.config['JSON_AS_ASCII'] = False
app.config['JSONIFY_MIMETYPE'] = 'application/json;charset=utf-8'
app.register_blueprint(api)
app.register_blueprint(user_bp, url_prefix='/user')
app.register_blueprint(data_bp, url_prefix='/data')
app.register_blueprint(city_bp, url_prefix='/city')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)