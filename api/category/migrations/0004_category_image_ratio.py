# Generated by Django 2.0 on 2018-04-13 22:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('category', '0003_auto_20180401_1436'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='image_ratio',
            field=models.FloatField(default=1.618),
        ),
    ]
