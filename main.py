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
import queue

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

user_beleaf = 'beleaf_green'
password_beleaf = 'beleaf_teste'

class MessageAnnouncer:

    def __init__(self):
        self.listeners = []

    def listen(self):
        q = queue.Queue(maxsize=6)
        self.listeners.append(q)
        return q

    def announce(self, msg):
        for i in reversed(range(len(self.listeners))):
            try:
                self.listeners[i].put_nowait(msg)
            except queue.Full:
                del self.listeners[i]

announcer = MessageAnnouncer()

def format_sse(data: str, event: str) -> str:
    msg = f'data: {data}\n\n'
    if event is not None:
        msg = f'event: {event}\n{msg}'
    return msg


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

    def __init__(self, lux_max, lux_min, time_on, time_off, automatic_light, light_intensity):
        self.lux_max = lux_max
        self.lux_min = lux_min
        self.time_on = time_on
        self.time_off = time_off
        self.automatic_light = automatic_light
        self.light_intensity = light_intensity


# Loading web page for users
@app.route("/")
@auth_required
def visualize_data():
    values = Measurement.query.all()
    return render_template('graph.html', title='data', values = values)

@app.route('/listen', methods=['GET'])
@auth_required
def listen():
    def stream():
        messages = announcer.listen()  # returns a queue.Queue
        while True:
            msg = messages.get()  # blocks until a new message arrives
            yield msg

    return Response(stream(), mimetype='text/event-stream')

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
    'light_intensity': fields.Integer
}

class Chart_data_id(Resource):
    @auth_required
    @marshal_with(measurement_fields)
    def get(self, id):
        result = Measurement.query.filter_by(id=id).first()
        return result

# Restful API for sending and recieving measurements
class Chart_data(Resource):
    @auth_required
    @marshal_with(measurement_fields)
    def get(self):
        result = Measurement.query.all()
        return result

    def post(self):
        now = datetime.now()
        date_string = now.strftime("%d/%m/%Y %H:%M:%S")
        request.json['date_posted'] = date_string
        date_posted = request.json['date_posted']
        sse_date_posted = str(date_posted)
        msg = format_sse(data=sse_date_posted, event = 'date_posted')
        announcer.announce(msg=msg)
        humidity = request.json['humidity']
        sse_humidity = str(humidity)
        msg = format_sse(data=sse_humidity, event = 'humidity')
        announcer.announce(msg=msg)
        light = request.json['light']
        sse_light = str(light)
        msg = format_sse(data=sse_light, event = 'light')
        announcer.announce(msg=msg)
        temperature = request.json['temperature']
        sse_temperature = str(temperature)
        msg = format_sse(data=sse_temperature, event = 'temperature')
        announcer.announce(msg=msg)
        ph = request.json['ph']
        sse_ph = str(ph)
        msg = format_sse(data=sse_ph, event = 'ph')
        announcer.announce(msg=msg)
        conductivity = request.json['conductivity']
        sse_conductivity = str(conductivity)
        msg = format_sse(data=sse_conductivity, event = 'conductivity')
        announcer.announce(msg=msg)
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
            time_on = 20
            time_off = 20
            automatic_light = 0
            light_intensity = 0
            new_config = Config(lux_max, lux_min, time_on, time_off, automatic_light, light_intensity)
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
            automatic_light = 0
            light_intensity = 0
            new_config = Config(lux_max, lux_min, time_on, time_off, automatic_light, light_intensity)
            db.session.add(new_config)
            db.session.commit()
        else:
            result.lux_max = request.json['lux_max']
            result.lux_min = request.json['lux_min']
            result.time_on = request.json['time_on']
            result.time_off = request.json['time_off']
            result.automatic_light = request.json['automatic_light']
            result.light_intensity = request.json['light_intensity']
            db.session.commit()
        return 201

api.add_resource(Chart_data, '/chart_data')
api.add_resource(Config_data, '/config_elements')
api.add_resource(Chart_data_id, '/chart_data_<int:id>')


# Run Server
if __name__ == '__main__':
    app.run(debug=True)
    #app.run(host= '0.0.0.0')