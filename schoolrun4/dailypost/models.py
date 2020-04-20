from django.db import models

# Create your models here.

class dailypost(models.Model):
    open_id = models.CharField(max_length=32,unique=True)
    student_id = models.CharField(max_length=32,unique=True)
    post_time = models.DateTimeField(auto_now=True)
    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)
    ip = models.GenericIPAddressField(default='')

class Totalpost(models.Model):
    open_id = models.CharField(max_length=32,unique=True)
    student_id = models.CharField(max_length=32,unique=True)
    Total_time = models.IntegerField()

class codemodel(models.Model):
    hour = models.IntegerField()
    minute = models.IntegerField()
    code = models.CharField(max_length=32)