from flask import Flask
from flask_cors import CORS
from args import parser
from route import api, db

args = parser.parse_args()

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SECRET_KEY'] = args.secret_key
app.config['SQLALCHEMY_DATABASE_URI'] = args.sqlalchemy_database_uri
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
db.init_app(app)
app.config['JSON_AS_ASCII'] = False
app.config['JSONIFY_MIMETYPE'] = 'application/json;charset=utf-8'
app.register_blueprint(api)

if __name__ == '__main__':
    app.run(host=args.host, port=args.port, debug=True)