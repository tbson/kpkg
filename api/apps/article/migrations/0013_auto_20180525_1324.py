# Generated by Django 2.0 on 2018-05-25 06:24

import apps.article.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('article', '0012_article_pin'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='image',
            field=models.ImageField(blank=True, upload_to=apps.article.models.image_destination),
        ),
    ]