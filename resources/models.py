import uuid
from django.db import models

def generate_filename_js(instance, filename):
	return 'meshes/{}_{}.js'.format(instance.name, uuid.uuid4())

def generate_bone_group_filename_js(instance, filename):
	return 'bone_groups/{}_{}.js'.format(instance.name, uuid.uuid4())

def generate_pose_filename_js(instance, filename):
	return 'poses/{}_{}.js'.format(instance.name, uuid.uuid4())

def generate_preset_filename_js(instance, filename):
	return 'presets/{}_{}.js'.format(instance.name, uuid.uuid4())

def generate_filename_png(instance, filename):
	return 'thumbnails/{}_{}.jpg'.format(instance.name, uuid.uuid4())

class Asset(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name = models.CharField(max_length=30, blank=False)
	description = models.CharField(max_length=250, blank=True)
	author = models.CharField(max_length=30, blank=False)
	date_created = models.DateField(auto_now_add=True)
	category = models.CharField(max_length=30, default='unknown')
	thumbnail = models.FileField(upload_to=generate_filename_png)
	mesh = models.FileField(upload_to=generate_filename_js, blank=False)
	mesh_lowres = models.FileField(upload_to=generate_filename_js, null=True)
	mesh_hires = models.FileField(upload_to=generate_filename_js, null=True)

class BoneGroup(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name = models.CharField(max_length=30, blank=False)
	description = models.CharField(max_length=250, blank=True)
	author = models.CharField(max_length=30, blank=False)
	categories = models.CharField(max_length=300)
	date_created = models.DateField(auto_now_add=True)
	thumbnail = models.FileField(upload_to=generate_filename_png)
	file = models.FileField(upload_to=generate_bone_group_filename_js, blank=False)

class Pose(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name = models.CharField(max_length=30, blank=False)
	description = models.CharField(max_length=250, blank=True)
	author = models.CharField(max_length=30, blank=False)
	category = models.CharField(max_length=30)
	date_created = models.DateField(auto_now_add=True)
	thumbnail = models.FileField(upload_to=generate_filename_png)
	file = models.FileField(upload_to=generate_pose_filename_js, blank=False)

class Preset(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name = models.CharField(max_length=30, blank=False)
	description = models.CharField(max_length=250, blank=True)
	author = models.CharField(max_length=30, blank=False)
	category = models.CharField(max_length=30)
	date_created = models.DateField(auto_now_add=True)
	thumbnail = models.FileField(upload_to=generate_filename_png)
	file = models.FileField(upload_to=generate_preset_filename_js, blank=False)
