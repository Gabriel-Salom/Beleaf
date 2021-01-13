#-*- coding: utf-8 -*-

import time
import pytz
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
import os
import json
import pytz
import requests
import base64

authName = 'beleaf_green'
authPassword = 'beleaf_teste'

configurl = 'http://gabrielsalom.pythonanywhere.com/config_elements'
lastvalueurl = 'http://gabrielsalom.pythonanywhere.com/last_value'

start = time.time()

while True:
    try:
        tz = pytz.timezone('Brazil/East')
        now = datetime.now(tz)
        hour_string = now.strftime("%H")
        hour = int(hour_string)
        configData = requests.get(url=configurl, auth=(authName,authPassword)).json()
        lighton_schedule = configData['lighton_schedule']
        lightoff_schedule = configData['lightoff_schedule']
        lastvalData = requests.get(url=lastvalueurl, auth=(authName,authPassword)).json()
        last_intensity = lastvalData['last_intensity']
        if hour >=  lighton_schedule and hour < lightoff_schedule:
            configData['light_intensity'] = last_intensity
            r = requests.post(url=configurl, json = configData, auth=(authName,authPassword))
        else:
            configData['light_intensity'] = 0
            r = requests.post(url=configurl, json = configData, auth=(authName,authPassword))
        print('Deu boas')
    except:
        print('Algo deu errado')

    time.sleep(3600) #Dorme por 1h
    elapsedTime = time.time() -start
    print(elapsedTime)
    if (elapsedTime > 82800):  #Desliga o código quando passaram 23h
        print(str(elapsedTime) + ' quitando')
        break