# Generated by Django 2.0 on 2018-04-07 02:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('banner', '0003_auto_20180405_1351'),
    ]

    operations = [
        migrations.AlterField(
            model_name='banner',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='banners', to='category.Category'),
        ),
    ]