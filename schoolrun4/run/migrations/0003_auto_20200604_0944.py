# Generated by Django 2.1 on 2020-06-04 09:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('run', '0002_auto_20200604_0934'),
    ]

    operations = [
        migrations.AlterField(
            model_name='point',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
