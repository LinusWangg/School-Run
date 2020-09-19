from __future__ import unicode_literals
from django.db import models
import mongoengine
from ckeditor.fields import RichTextField
from mdeditor.fields import MDTextField

# Create your models here.

class notice(mongoengine.Document):
    title = mongoengine.StringField(max_length=64)
    content = MDTextField()
    creattime = mongoengine.DateTimeField(auto_now=True)
    author = mongoengine.StringField(max_length=32)
    isValid = mongoengine.BooleanField(default=False)
    _class = mongoengine.StringField()