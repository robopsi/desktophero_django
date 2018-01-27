import os

from django.shortcuts import render, redirect
from django.views import View
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, Http404
from django.conf import settings

from editor.views import EditorView

class UploadAssetView(View):

    @method_decorator(login_required)
    def get(self, request):
        from .forms import AssetForProcessingForm
        form = AssetForProcessingForm()

        from resources.models import Asset, BoneGroup, Pose, Preset
        results = Asset.objects.all().exclude(reviewed=False)
        categories = set([result.category_safe() for result in results])
        bone_groups = BoneGroup.objects.all().exclude(reviewed=False)
        poses = Pose.objects.all().exclude(reviewed=False)
        presets = Preset.objects.all().exclude(reviewed=False)
        return render(request, 'upload_asset.html', {'assets': [],
                                                    'categories': [],
                                                    'bone_groups': bone_groups,
                                                    'poses': [],
                                                    'presets': presets, 
                                                    'simple_mode_components': EditorView.simple_mode_components(),
                                                    'simple_mode_categories': EditorView.simple_mode_categories(),
                                                    'form': form})

    @method_decorator(login_required)
    def post(self, request):
        from .forms import AssetForProcessingForm

        form = AssetForProcessingForm(request.POST, request.FILES)
        if form.is_valid():
            entry = form.save(commit=False)
            entry.author = request.user
            entry.save()
            return redirect('/resources/contribute/contribution_succeeded')
        else:
            print(form.errors)
        
        return redirect('/resources/contribute/contribution_failed')

