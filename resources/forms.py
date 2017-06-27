from django.forms import ModelForm
from resources.models import Asset, BoneGroup, Pose, Preset

class AssetForm(ModelForm):
	class Meta:
		model = Asset
		fields = ['name', 'description', 'author', 'category', 'thumbnail', 'mesh', 'mesh_hires', 'mesh_lowres']

class BoneGroupForm(ModelForm):
	class Meta:
		model = BoneGroup
		fields = ['name', 'description', 'author', 'categories', 'thumbnail', 'file']

class PoseForm(ModelForm):
	class Meta:
		model = Pose
		fields = ['name', 'description', 'author', 'category', 'thumbnail', 'file']

class PresetForm(ModelForm):
	class Meta:
		model = Preset
		fields = ['name', 'description', 'author', 'category', 'thumbnail', 'file']
