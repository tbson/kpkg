# Generated by Django 2.0.7 on 2018-07-28 09:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('config', '0004_auto_20180331_0851'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='config',
            options={'ordering': ['-id'], 'permissions': (('list_config', 'Can view config list'), ('retrieve_config', 'Can view config detail'))},
        ),
    ]