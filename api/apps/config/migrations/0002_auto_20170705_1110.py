# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-07-05 04:10
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('config', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='config',
            options={'ordering': ['-id'], 'permissions': (('_custom_view_list_config', 'Can view list configs'), ('_custom_view_detail_config', 'Can view detail config'), ('_custom_create_config', 'Can create config'), ('_custom_edit_config', 'Can edit config'), ('_custom_delete_config', 'Can delete config'))},
        ),
    ]