from __future__ import unicode_literals
from django.db import models
import mongoengine
# Create your models here.

class Trace(mongoengine.Document):
    trace = mongoengine.ListField()
    distance = mongoengine.FloatField(default=0)
    time_cost = mongoengine.IntField(default=0)
    open_id = mongoengine.StringField(max_length=32)
    student_id = mongoengine.IntField(max_length=32)
    ip = mongoengine.StringField(default=' ')
    month = mongoengine.IntField(default=0)
    day = mongoengine.IntField(default=0)
    DTW = mongoengine.FloatField(default=0)

class runTrace(mongoengine.Document):
    trace = mongoengine.ListField(unique=True)
