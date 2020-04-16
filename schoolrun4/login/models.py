from django.db import models

# Create your models here.

class User(models.Model):
    open_id = models.CharField(max_length=32,unique=True)
    student_id = models.CharField(max_length=32,unique=True)
    school = models.CharField(max_length=32,unique=True,default='No')
    name = models.CharField(max_length=32,unique=True,default='No')
    is_register = models.BooleanField(default=False)