from datetime import datetime
from flask import Flask, request, jsonify, render_template, redirect, url_for, make_response, send_file
from flask_restful import Api, Resource, reqparse, abort, fields, marshal_with
from werkzeug.wrappers import Response
from flask_sqlalchemy import SQLAlchemy
from functools import wraps
from io import StringIO
import csv
import os
import json
import webbrowser
import pytz
from flask_apscheduler import APScheduler

# Init app
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
# Init restful api
api = Api(app)
scheduler = APScheduler()

# Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Init db
db = SQLAlchemy(app)

user_beleaf = 'beleaf_green'
password_beleaf = 'beleaf_teste'

def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if auth and auth.username == user_beleaf and auth.password == password_beleaf:
            return f(*args, **kwargs)

        return make_response('Could not verify authentication!', 401, {'WWW-authenticate' : 'Basic realm="Login Required"'})
    return decorated

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
    automatic_light = db.Column(db.Integer)
    light_intensity = db.Column(db.Integer)
    lighton_schedule = db.Column(db.Integer)
    lightoff_schedule = db.Column(db.Integer)

    def __init__(self, lux_max, lux_min, time_on, time_off, automatic_light, light_intensity, lighton_schedule, lightoff_schedule):
        self.lux_max = lux_max
        self.lux_min = lux_min
        self.time_on = time_on
        self.time_off = time_off
        self.automatic_light = automatic_light
        self.light_intensity = light_intensity
        self.lighton_schedule = lighton_schedule
        self.lightoff_schedule = lightoff_schedule

class LastIntensity(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    last_intensity = db.Column(db.Integer)

    def __init__(self, last_intensity):
        self.last_intensity = last_intensity


# Landing page
@app.route("/")
@auth_required
def home():
    return render_template('home.html')

# Detailed graph humidity
@app.route("/graph-h")
@auth_required
def graph_h():
    return render_template('graph-h.html')

# Detailed graph temperature
@app.route("/graph-t")
@auth_required
def graph_t():
    return render_template('graph-t.html')

# Detailed graph ph
@app.route("/graph-p")
@auth_required
def graph_p():
    return render_template('graph-p.html')

# Detailed graph conductivity
@app.route("/graph-c")
@auth_required
def graph_c():
    return render_template('graph-c.html')

# Detailed graph light
@app.route("/graph-l")
@auth_required
def graph_l():
    return render_template('graph-l.html')

# Controls
@app.route("/controls")
@auth_required
def controls():
    return render_template('controls.html')

# Generating csv from the database
@auth_required
@app.route('/download')
def csv_data():
    values = Measurement.query.all()
    def generate():
        data = StringIO()
        w = csv.writer(data)
        yield data.getvalue()
        data.seek(0)
        data.truncate(0)
        w.writerow((
                'date_posted',
                'humidity',
                'light',
                'temperature',
                'ph',
                'conductivity'
            ))
        # write each log item
        for item in values:
            w.writerow((
                item.date_posted,
                item.humidity,
                item.light,
                item.temperature,
                item.ph,
                item.conductivity
            ))
            yield data.getvalue()
            data.seek(0)
            data.truncate(0)

    # stream the response as the data is generated
    response = Response(generate(), mimetype='text/csv')
    # add a filename
    response.headers.set("Content-Disposition", "attachment", filename="log.csv")
    return response

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
    'time_off': fields.Integer,
    'automatic_light': fields.Integer,
    'light_intensity': fields.Integer,
    'lighton_schedule': fields.Integer,
    'lightoff_schedule': fields.Integer
}

last_field = {
    'id': fields.Integer,
    'last_intensity': fields.Integer
}

# Restful API for sending and recieving measurements
class Chart_data(Resource):
    @auth_required
    @marshal_with(measurement_fields)
    def get(self):
        #result = Measurement.query.all()
        result = Measurement.query.order_by(Measurement.id.desc()).limit(50).all()
        return result

    def post(self):
        tz = pytz.timezone('Brazil/East')
        now = datetime.now(tz)
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
    
    def delete(self):
        num_rows_deleted = db.session.query(Measurement).delete()
        print(num_rows_deleted)
        db.session.commit()
        return 201


# Restful API for sending and recieving configurations
class Config_data(Resource):
    @auth_required
    @marshal_with(config_fields)
    def get(self): 
        result = Config.query.filter_by(id=1).first()
        if result == None:
            lux_max = 60
            lux_min = 50
            time_on = 120
            time_off = 1800
            automatic_light = 0
            light_intensity = 10
            lighton_schedule = 6
            lightoff_schedule = 18
            new_config = Config(lux_max, lux_min, time_on, time_off, automatic_light, light_intensity, lighton_schedule, lightoff_schedule)
            db.session.add(new_config)
            db.session.commit()
        result = Config.query.filter_by(id=1).first()
        return result
    def post(self):
        result = Config.query.filter_by(id=1).first()
        if result == None:
            lux_max = 60
            lux_min = 50
            time_on = 120 
            time_off = 1800
            automatic_light = 0
            light_intensity = 10
            lighton_schedule = 6
            lightoff_schedule = 18
            new_config = Config(lux_max, lux_min, time_on, time_off, automatic_light, light_intensity, lighton_schedule, lightoff_schedule)
            db.session.add(new_config)
            db.session.commit()
        else:
            result.lux_max = request.json['lux_max']
            result.lux_min = request.json['lux_min']
            result.time_on = request.json['time_on']
            result.time_off = request.json['time_off']
            result.automatic_light = request.json['automatic_light']
            result.light_intensity = request.json['light_intensity']
            result.lighton_schedule = request.json['lighton_schedule']
            result.lightoff_schedule = request.json['lightoff_schedule']
            db.session.commit()
        return 201

class Last_value(Resource):
    @auth_required
    @marshal_with(last_field)
    def get(self):
        result = LastIntensity.query.filter_by(id=1).first()
        if result == None:
            last_intensity = 10
            new_last_intensity = LastIntensity(last_intensity)
            db.session.add(new_last_intensity)
            db.session.commit()
        result = LastIntensity.query.filter_by(id=1).first()
        return result

    def post(self):
        result = LastIntensity.query.filter_by(id=1).first()
        if result == None:
            last_intensity = 10
            new_last_intensity = LastIntensity(last_intensity)
            db.session.add(new_last_intensity)
            db.session.commit()
        else:
            result.last_intensity = request.json['last_intensity']
            db.session.commit()
        return 201


api.add_resource(Chart_data, '/chart_data')
api.add_resource(Config_data, '/config_elements')
api.add_resource(Last_value, '/last_value')

#----------------------------------------------------
#---- Gambiarra mais nojenta de todos os tempos
def print_date_time():
    result = Config.query.filter_by(id=1).first()
    if result == None:
        lux_max = 60
        lux_min = 50
        time_on = 120 
        time_off = 1800
        automatic_light = 0
        light_intensity = 10
        lighton_schedule = 6
        lightoff_schedule = 18
        new_config = Config(lux_max, lux_min, time_on, time_off, automatic_light, light_intensity, lighton_schedule, lightoff_schedule)
        db.session.add(new_config)
        db.session.commit()
    last_result = LastIntensity.query.filter_by(id=1).first()
    if last_result == None:
        last_intensity = 10
        new_last_intensity = LastIntensity(last_intensity)
        db.session.add(new_last_intensity)
        db.session.commit()
        last_result = LastIntensity.query.filter_by(id=1).first()
    tz = pytz.timezone('Brazil/East')
    now = datetime.now(tz)
    hour_string = now.strftime("%H")
    if result.lighton_schedule <= int(hour_string) and  result.lightoff_schedule > int(hour_string):
        result.light_intensity = last_result.last_intensity
        db.session.commit()
        #print("Ligado. \n Valor armazenado de intensidade: %s \n Valor de intensidade: %s \n" %(last_result.last_intensity, result.light_intensity))
    else:
        result.light_intensity = 0
        db.session.commit()
        #print("Desligado. \n Valor armazenado de intensidade: %s \n Valor de intensidade: %s \n" %(last_result.last_intensity, result.light_intensity))


# Run Server
if __name__ == '__main__':
    scheduler.add_job(id = 'schedule task', func = print_date_time, trigger = 'interval', minutes = 10)
    scheduler.start()
    app.run(debug=True)
    #app.run(host= '0.0.0.0')