from django.forms import ModelForm
from resources.models import Asset

class AssetForm(ModelForm):
	class Meta:
		model = Asset
		fields = ['name', 'description', 'author', 'category', 'thumbnail', 'mesh', 'mesh_hires', 'mesh_lowres']
