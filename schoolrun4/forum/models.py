from __future__ import unicode_literals
from django.db import models
import mongoengine
from ckeditor.fields import RichTextField
from mdeditor.fields import MDTextField

# Create your models here.

class Article(mongoengine.Document):
    title = mongoengine.StringField(max_length=64)
    content = MDTextField()
    createtime = mongoengine.DateTimeField(auto_now=True)
    createman = mongoengine.StringField(max_length=32)