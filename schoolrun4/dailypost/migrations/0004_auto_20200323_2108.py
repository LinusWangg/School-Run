# Generated by Django 2.1 on 2020-03-23 21:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dailypost', '0003_auto_20200323_2100'),
    ]

    operations = [
        migrations.AddField(
            model_name='dailypost',
            name='latitude',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='dailypost',
            name='longitude',
            field=models.FloatField(default=0),
        ),
    ]