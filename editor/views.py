from django.shortcuts import render
from django.views import View
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required

class EditorView(View):
    @method_decorator(login_required)
    def get(self, request):
        from resources.models import Asset, BoneGroup, Pose, Preset
        results = Asset.objects.all()
        for result in results:
            print(result.thumbnail)
        categories = set([result.category for result in results])
        bone_groups = BoneGroup.objects.all()
        poses = Pose.objects.all()
        presets = Preset.objects.all()
        return render(request, 'editor_main.html', {'assets': results,
                                                    'categories': categories,
                                                    'bone_groups': bone_groups,
                                                    'poses': poses,
                                                    'presets': presets})

from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect

class RegistrationView(View):
    def get(self, request):
        return render(request, 'registration/register.html', {'form': UserCreationForm()})

    def post(self, request):
        form = UserCreationForm(request.POST)
        print("form is valid: {}".format(form.is_valid()))
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('/editor/')
        return render(request, 'registration/register.html', {'form': UserCreationForm()})
