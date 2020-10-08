from datetime import datetime
from flask import Flask, request, jsonify, render_template, redirect, url_for, make_response
from flask_restful import Api, Resource, reqparse, abort, fields, marshal_with
from flask_sqlalchemy import SQLAlchemy
import os
import json
import webbrowser

# Init app
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
# Init restful api
api = Api(app)

# Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Init db
db = SQLAlchemy(app)

# Classes/Models for the database
class Measurement(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    humidity = db.Column(db.Float)
    date_posted = db.Column(db.String(200), default=datetime.utcnow)
    light = db.Column(db.Float)
    temperature = db.Column(db.Float)
    ph = db.Column(db.Float)
    conductivity = db.Column(db.Float)

    
    def __init__(self, date_posted, humidity, light, temperature, ph, conductivity):
        self.date_posted = date_posted
        self.humidity = humidity
        self.light = light
        self.temperature = temperature
        self.ph = ph
        self.conductivity = conductivity


class Config(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    lux_max = db.Column(db.Integer)
    lux_min = db.Column(db.Integer)
    time_on = db.Column(db.Integer)
    time_off = db.Column(db.Integer)

    def __init__(self, lux_max, lux_min, time_on, time_off):
        self.lux_max = lux_max
        self.lux_min = lux_min
        self.time_on = time_on
        self.time_off = time_off


# Loading web page for users
@app.route("/")
def visualize_data():
    values = Measurement.query.all()
    return render_template('graph.html', title='data', values = values)

# Rest API for sending JSON to the front end
measurement_fields = {
    'id': fields.Integer,
    'date_posted': fields.String,
    'humidity': fields.Float,
    'light': fields.Float,
    'temperature': fields.Float,
    'ph': fields.Float,
    'conductivity': fields.Float
}

config_fields = {
    'id': fields.Integer,
    'lux_max': fields.Integer,
    'lux_min': fields.Integer,
    'time_on': fields.Integer,
    'time_off': fields.Integer
}

# Restful API for sending and recieving measurements
class Chart_data(Resource):
    @marshal_with(measurement_fields)
    def get(self):
        result = Measurement.query.all()
        return result
    def post(self):
        now = datetime.now()
        date_string = now.strftime("%d/%m/%Y %H:%M:%S")
        request.json['date_posted'] = date_string
        date_posted = request.json['date_posted']
        humidity = request.json['humidity']
        light = request.json['light']
        temperature = request.json['temperature']
        ph = request.json['ph']
        conductivity = request.json['conductivity']
        new_measurement = Measurement(date_posted, humidity, light, temperature, ph, conductivity)
        db.session.add(new_measurement)
        db.session.commit()
        return 201

# Restful API for sending and recieving configurations
class Config_data(Resource):
    @marshal_with(config_fields)
    def get(self):
        result = Config.query.filter_by(id=1).first()
        if result == None:
            lux_max = 60
            lux_min = 50
            time_on = 20
            time_off = 20
            new_config = Config(lux_max, lux_min, time_on, time_off)
            db.session.add(new_config)
            db.session.commit()
        result = Config.query.filter_by(id=1).first()
        return result
    def post(self):
        result = Config.query.filter_by(id=1).first()
        if result == None:
            lux_max = 60
            lux_min = 50
            time_on = 20
            time_off = 20
            new_config = Config(lux_max, lux_min, time_on, time_off)
            db.session.add(new_config)
            db.session.commit()
        else:
            print(request.json['lux_max'])
            result.lux_max = request.json['lux_max']
            result.lux_min = request.json['lux_min']
            result.time_on = request.json['time_on']
            result.time_off = request.json['time_off']
            db.session.commit()
        return {}

api.add_resource(Chart_data, '/chart_data')
api.add_resource(Config_data, '/config_elements')


# Run Server
if __name__ == '__main__':
    app.run(debug=True)
    #app.run(port =11942, host= '0.0.0.0')