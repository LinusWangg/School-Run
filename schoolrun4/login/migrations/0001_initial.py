# Generated by Django 2.1 on 2020-02-10 02:04

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('open_id', models.CharField(max_length=32, unique=True)),
                ('nickname', models.CharField(max_length=256)),
                ('student_id', models.IntegerField(max_length=32, unique=True)),
                ('school', models.CharField(max_length=32, unique=True)),
            ],
        ),
    ]
