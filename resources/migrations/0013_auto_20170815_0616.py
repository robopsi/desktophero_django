# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-15 13:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0012_asset_library'),
    ]

    operations = [
        migrations.AddField(
            model_name='bonegroup',
            name='library',
            field=models.CharField(choices=[('official', 'official'), ('user_gen', 'user_generated')], default='user_gen', max_length=10),
        ),
        migrations.AddField(
            model_name='pose',
            name='library',
            field=models.CharField(choices=[('official', 'official'), ('user_gen', 'user_generated')], default='user_gen', max_length=10),
        ),
        migrations.AddField(
            model_name='preset',
            name='library',
            field=models.CharField(choices=[('official', 'official'), ('user_gen', 'user_generated')], default='user_gen', max_length=10),
        ),
    ]
