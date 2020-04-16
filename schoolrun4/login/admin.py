from django.contrib import admin
from . import models
# Register your models here.

register_list = [
    models.User,
]
admin.site.register(register_list)