from __future__ import unicode_literals
from django.db import models
import mongoengine

# Create your models here.

class User(mongoengine.Document):
    open_id = mongoengine.StringField(max_length=32,unique=True)
    student_id = mongoengine.StringField(max_length=32,unique=True)
    school = mongoengine.StringField(max_length=32)
    name = mongoengine.StringField(max_length=32,default='No')
    is_register = mongoengine.BooleanField(default=False)
    