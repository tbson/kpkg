# Generated by Django 2.0 on 2018-05-12 11:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tag', '0002_auto_20180512_1437'),
        ('article', '0010_auto_20180421_1511'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='tags',
            field=models.ManyToManyField(to='tag.Tag'),
        ),
    ]