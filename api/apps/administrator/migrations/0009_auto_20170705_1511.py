# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-07-05 08:11
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('administrator', '0008_auto_20170705_1110'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='administrator',
            options={'ordering': ['-id'], 'permissions': (('_custom_view_list_administrator', 'Can view list administrators'),)},
        ),
    ]