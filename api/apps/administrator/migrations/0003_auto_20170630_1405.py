# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-06-30 07:05
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('administrator', '0002_auto_20170630_1403'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='administrator',
            options={'ordering': ['-id'], 'permissions': (('view_list_administrator', 'Can view list administrators'),)},
        ),
    ]
