# Generated by Django 2.0 on 2018-04-05 06:51

import apps.banner.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('banner', '0002_auto_20180405_0526'),
    ]

    operations = [
        migrations.AlterField(
            model_name='banner',
            name='image',
            field=models.ImageField(upload_to=apps.banner.models.image_destination),
        ),
    ]