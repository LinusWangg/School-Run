from django.contrib import admin
from . import models
# Register your models here.

register_list = [
    models.dailypost,
    models.Totalpost,
    models.codemodel,
]
admin.site.register(register_list)