# Generated by Django 2.0 on 2018-04-11 23:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('attach', '0002_remove_attach_parent_table'),
    ]

    operations = [
        migrations.AddField(
            model_name='attach',
            name='richtext_image',
            field=models.BooleanField(default=True),
        ),
    ]