# Generated by Django 2.0.7 on 2018-08-01 11:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('attach', '0005_attach_order'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='attach',
            options={'ordering': ['-id'], 'permissions': (('list_attach', 'Can list attach'), ('retrieve_attach', 'Can retrieve attach'), ('delete_list_attach', 'Can delete list attach'))},
        ),
    ]
