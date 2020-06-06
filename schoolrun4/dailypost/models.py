from django.db import models

# Create your models here.

class dailypost(models.Model):
    open_id = models.CharField(max_length=32)
    student_id = models.CharField(max_length=32)
    post_time = models.DateTimeField(auto_now=True)
    month = models.IntegerField(default=0)
    day = models.IntegerField(default=0)
    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)
    ip = models.GenericIPAddressField(default='')

class Totalpost(models.Model):
    open_id = models.CharField(max_length=32,unique=True)
    student_id = models.CharField(max_length=32,unique=True)
    Total_time = models.IntegerField()

class codemodel(models.Model):
    month = models.IntegerField(default=0)
    day = models.IntegerField(default=0)
    hour = models.IntegerField(default=0)
    minute = models.IntegerField(default=0)
    code = models.CharField(max_length=32)
    url = models.URLField(default="")