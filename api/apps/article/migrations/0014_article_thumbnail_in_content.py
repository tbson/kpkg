# Generated by Django 2.0 on 2018-05-25 06:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('article', '0013_auto_20180525_1324'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='thumbnail_in_content',
            field=models.BooleanField(default=False),
        ),
    ]