# Generated by Django 2.0.7 on 2018-07-28 13:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('staff', '0002_auto_20180728_1942'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='staff',
            options={'ordering': ['-id'], 'permissions': (('list_staff', 'Can list staff'), ('retrieve_staff', 'Can retrieve staff'), ('delete_list_staff', 'Can delete list staff'))},
        ),
    ]