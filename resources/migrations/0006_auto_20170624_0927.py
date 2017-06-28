# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-06-24 16:27
from __future__ import unicode_literals

from django.db import migrations, models
import resources.models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0005_auto_20170619_0536'),
    ]

    operations = [
        migrations.CreateModel(
            name='BoneGroup',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=30)),
                ('description', models.CharField(blank=True, max_length=250)),
                ('author', models.CharField(max_length=30)),
                ('date_created', models.DateField(auto_now_add=True)),
                ('thumbnail', models.FileField(upload_to=resources.models.generate_filename_png)),
                ('file', models.FileField(upload_to=resources.models.generate_filename_js)),
            ],
        ),
        migrations.CreateModel(
            name='BoneGroupCategoryPair',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('bone_group_id', models.UUIDField()),
                ('category_id', models.UUIDField()),
            ],
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=30)),
            ],
        ),
        migrations.AlterField(
            model_name='asset',
            name='mesh',
            field=models.FileField(upload_to=resources.models.generate_filename_js),
        ),
        migrations.AlterField(
            model_name='asset',
            name='mesh_hires',
            field=models.FileField(null=True, upload_to=resources.models.generate_filename_js),
        ),
        migrations.AlterField(
            model_name='asset',
            name='mesh_lowres',
            field=models.FileField(null=True, upload_to=resources.models.generate_filename_js),
        ),
        migrations.AlterField(
            model_name='asset',
            name='thumbnail',
            field=models.FileField(upload_to=resources.models.generate_filename_png),
        ),
    ]