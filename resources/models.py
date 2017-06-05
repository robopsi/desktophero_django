import uuid
from django.db import models

class Asset(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name = models.CharField(max_length=30)
	description = models.CharField(max_length=250)
	author = models.CharField(max_length=30)
	date_created = models.DateField()
	category = models.CharField(max_length=30)
	thumbnail = models.FileField(upload_to='thumbnails')
	mesh = models.FileField(upload_to='meshes')
