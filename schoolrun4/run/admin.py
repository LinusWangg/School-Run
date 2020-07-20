from django.contrib import admin
from . import models

# Register your models here.
register_list = [
    models.Point,
    models.Trace,
    models.runTrace,
]
admin.site.register(register_list)