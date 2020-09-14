from __future__ import unicode_literals
from django.db import models
import mongoengine
# Create your models here.

class Trace(mongoengine.Document):
    base_id = mongoengine.StringField(max_length=100)
    trace = mongoengine.ListField()
    distance = mongoengine.FloatField(default=0)
    time_cost = mongoengine.IntField(default=0)
    open_id = mongoengine.StringField(max_length=32)
    student_id = mongoengine.IntField(max_length=32)
    ip = mongoengine.StringField(default=' ')
    month = mongoengine.IntField(default=0)
    day = mongoengine.IntField(default=0)
    DTW = mongoengine.FloatField(default=0)

class base_trace(mongoengine.Document):
    author = mongoengine.StringField(max_length=32)
    creatTime = mongoengine.DateTimeField(auto_now=True)
    trace = mongoengine.ListField()
    _class = mongoengine.StringField()

class TotalPost(mongoengine.Document):
    open_id = mongoengine.StringField(max_length=32,unique=True)
    student_id = mongoengine.StringField(max_length=32,unique=True)
    Total_time = mongoengine.IntField(default=0)
    
