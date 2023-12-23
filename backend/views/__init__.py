from db import db
from flask import Blueprint, request, jsonify

api = Blueprint('api', __name__)

@api.route('/', methods=['GET'])
def test():
    return "<h1>Welcome to Rick's server!</h1>"