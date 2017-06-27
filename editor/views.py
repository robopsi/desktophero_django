from django.shortcuts import render
from django.views import View

class EditorView(View):
	def get(self, request):
		from resources.models import Asset, BoneGroup, Pose, Preset

		results = Asset.objects.all()
		categories = set([result.category for result in results])
		bone_groups = BoneGroup.objects.all()
		poses = Pose.objects.all()
		presets = Preset.objects.all()
		return render(request, 'editor_main.html', {'assets': results,
													'categories': categories,
													'bone_groups': bone_groups,
													'poses': poses,
													'presets': presets})
