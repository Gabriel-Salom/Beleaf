from datetime import datetime
from flask import Flask, request, jsonify, render_template, redirect, url_for, make_response
from flask_restful import Api, Resource, reqparse, abort, fields, marshal_with
from flask_marshmallow import Marshmallow
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
# Init ma
ma = Marshmallow(app)

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


# Measurement Schema
class MeasurementSchema(ma.Schema):
    class Meta:
        fields = ('id', 'date_posted', 'humidity', 'light', 'temperature', 'ph', 'conductivity')

class Config_Schema(ma.Schema):
    class Meta:
        fields = ('id', 'lux_max', 'lux_min', 'time_on' , 'time_off')


# Init Schema
measurement_schema = MeasurementSchema()
measurements_schema = MeasurementSchema(many=True)

# Recieving data from esp32
@app.route('/value', methods=['POST'])
def add_measurement():
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
    print(new_measurement)
    db.session.add(new_measurement)
    db.session.commit()
    
    return measurement_schema.jsonify(new_measurement)

# Recieving data from front end
@app.route('/config_elements', methods=['POST'])
def config_elements():
    config_entity = Config.query.filter_by(id=0).first()
    print(config_entity)
    if config_entity == None:
        lux_max = 60
        lux_min = 40
        time_on = 20
        time_off = 20
        new_config = Config(lux_max, lux_min, time_on, time_off)
        db.session.add(new_config)
        db.session.commit()
    else:
        config_entity.lux_max = request.json['lux_max']
        config_entity.lux_min = request.json['lux_min']
        config_entity.time_on = request.json['time_on']
        config_entity.time_off = request.json['time_off']
        # new_config = Config(lux_max, lux_min, time_on , time_off)
        db.session.commit()
    print(config_entity)
    return {}

# Loading web page for users
@app.route("/")
def visualize_data():
    values = Measurement.query.all()
    return render_template('graph.html', title='data', values = values)

# Rest API for sending JSON to the front end
resource_fields = {
    'id': fields.Integer,
    'date_posted': fields.String,
    'humidity': fields.Float,
    'light': fields.Float,
    'temperature': fields.Float,
    'ph': fields.Float,
    'conductivity': fields.Float
}

class Chart_data(Resource):
    @marshal_with(resource_fields)
    def get(self):
        result = Measurement.query.all()
        return result

api.add_resource(Chart_data, '/chart_data')


# Run Server
if __name__ == '__main__':
    app.run(debug=True) 