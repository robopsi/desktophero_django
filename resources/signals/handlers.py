from django.dispatch import receiver
from django.db import models
from resources.models import Asset

@receiver(models.signals.pre_delete, sender=Asset)
def delete_file_s3(sender, instance, using, **kwargs):
	instance.thumbnail.delete(save=False)
	instance.mesh.delete(save=False)
	instance.mesh_lowres.delete(save=False)
	instance.mesh_hires.delete(save=False)
