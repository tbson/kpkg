# Generated by Django 2.0.7 on 2018-07-28 14:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ccalendar', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='ccalendar',
            options={'ordering': ['-start'], 'permissions': (('list_ccalendar', 'Can list ccalendar'), ('retrieve_ccalendar', 'Can retrieve ccalendar'), ('delete_list_ccalendar', 'Can delete list ccalendar'))},
        ),
    ]
