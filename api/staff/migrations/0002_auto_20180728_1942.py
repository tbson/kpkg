# Generated by Django 2.0.7 on 2018-07-28 12:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('staff', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='staff',
            options={'ordering': ['-id'], 'permissions': (('list_staff', 'Can list staff'), ('retrieve_staff', 'Can retrieve staff'))},
        ),
    ]
