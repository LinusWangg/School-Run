# Generated by Django 2.1 on 2020-02-10 02:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='student_id',
            field=models.IntegerField(unique=True),
        ),
    ]
