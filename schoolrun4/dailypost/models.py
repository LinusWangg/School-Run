from __future__ import unicode_literals
from django.db import models
import mongoengine

# Create your models here.

class dailypost(mongoengine.Document):
    open_id = mongoengine.StringField(max_length=32)
    student_id = mongoengine.StringField(max_length=32)
    post_time = mongoengine.IntField(default=0)
    latitude = mongoengine.FloatField(default=0)
    longitude = mongoengine.FloatField(default=0)
    ip = mongoengine.StringField(default='')
    code = mongoengine.StringField(default='')

    meta = {'collection':'dailypost', 'strict': False}

class Totalpost(mongoengine.Document):
    open_id = mongoengine.StringField(max_length=32,unique=True)
    student_id = mongoengine.StringField(max_length=32,unique=True)
    Total_time = mongoengine.IntField(default=0)

class codemodel(mongoengine.Document):
    month = mongoengine.IntField(default=0)
    day = mongoengine.IntField(default=0)
    hour = mongoengine.IntField(default=0)
    minute = mongoengine.IntField(default=0)
    code = mongoengine.StringField(max_length=32)
    url = mongoengine.StringField(max_length=100)