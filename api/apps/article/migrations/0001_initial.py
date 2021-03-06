# Generated by Django 2.0 on 2018-04-07 02:15

import apps.article.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('category', '0003_auto_20180401_1436'),
    ]

    operations = [
        migrations.CreateModel(
            name='Article',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uid', models.CharField(max_length=256)),
                ('title', models.CharField(max_length=256)),
                ('description', models.TextField(blank=True)),
                ('image', models.ImageField(upload_to=apps.article.models.image_destination)),
                ('content', models.TextField(blank=True)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='articles', to='category.Category')),
            ],
            options={
                'db_table': 'articles',
                'ordering': ['-id'],
                'permissions': (('view_article_list', 'Can view article list'), ('view_article_detail', 'Can view article detail')),
            },
        ),
    ]
