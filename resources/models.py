import uuid
from django.db import models

def generate_filename_js(instance, filename):
	return 'meshes/{}_{}.js'.format(instance.name, uuid.uuid4())

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
