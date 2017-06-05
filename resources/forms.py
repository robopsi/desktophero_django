from django.forms import ModelForm
from resources.models import Asset

class AssetForm(ModelForm):
	class Meta:
		model = Asset
		fields = ['name', 'description', 'author', 'date_created', 'category', 'thumbnail', 'mesh']
