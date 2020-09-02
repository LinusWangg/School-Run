from django.db import models
from ckeditor.fields import RichTextField
from mdeditor.fields import MDTextField

# Create your models here.

class Article(models.Model):
    objects = models.Manager()
    title = models.CharField(max_length=64)
    content =  MDTextField()
    createtime = models.DateTimeField(auto_now=True)
    createman = models.CharField(max_length=32)