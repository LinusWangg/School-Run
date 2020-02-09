from django.db import models

# Create your models here.

class User(models.Model):
    open_id = models.CharField(max_length=32,unique=True)
    nickname = models.CharField(max_length=256)