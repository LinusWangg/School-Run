# Generated by Django 2.1 on 2020-03-21 14:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0007_auto_20200314_1956'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='is_register',
            field=models.BooleanField(default=False),
        ),
    ]