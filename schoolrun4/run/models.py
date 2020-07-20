from __future__ import unicode_literals
from django.db import models
# Create your models here.

class Point(models.Model):
    id = models.AutoField(primary_key=True)
    latitude = models.FloatField()
    longitude = models.FloatField()

class Trace(models.Model):
    start_point = models.IntegerField()
    end_point = models.IntegerField()
    distance = models.FloatField(default=0)
    time_cost = models.IntegerField(default=0)
    open_id = models.CharField(max_length=32)
    student_id = models.CharField(max_length=32)
    ip = models.GenericIPAddressField(default=' ')
    month = models.IntegerField(default=0)
    day = models.IntegerField(default=0)
    DTW = models.FloatField(default=0)

class runTrace(models.Model):
    start_point = models.IntegerField()
    end_point = models.IntegerField()
