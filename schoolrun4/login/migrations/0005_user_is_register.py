# Generated by Django 2.1 on 2020-03-14 11:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0004_auto_20200210_1519'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_register',
            field=models.BooleanField(default=True),
        ),
    ]
