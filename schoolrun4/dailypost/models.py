from django.db import models

# Create your models here.

class dailypost(models.Model):
    open_id = models.CharField(max_length=32,unique=True)
    student_id = models.CharField(max_length=32,unique=True)
    post_time = models.DateTimeField(auto_now=True)

class Totalpost(models.Model):
    open_id = models.CharField(max_length=32,unique=True)
    student_id = models.CharField(max_length=32,unique=True)
    Total_time = models.IntegerField()