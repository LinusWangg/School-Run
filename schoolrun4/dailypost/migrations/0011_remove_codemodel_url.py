# Generated by Django 2.1 on 2020-04-20 20:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dailypost', '0010_auto_20200420_1856'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='codemodel',
            name='url',
        ),
    ]
