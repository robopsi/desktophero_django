from django.shortcuts import render
from django.views import View
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required

class EditorView(View):
    @method_decorator(login_required)
    def get(self, request):
        from resources.models import Asset, BoneGroup, Pose, Preset
        results = Asset.objects.all().exclude(reviewed=False)
        for result in results:
            print(result.thumbnail)
        categories = set([result.category_safe() for result in results])
        bone_groups = BoneGroup.objects.all().exclude(reviewed=False)
        poses = Pose.objects.all().exclude(reviewed=False)
        presets = Preset.objects.all().exclude(reviewed=False)
        return render(request, 'editor_main.html', {'assets': results,
                                                    'categories': categories,
                                                    'bone_groups': bone_groups,
                                                    'poses': poses,
                                                    'presets': presets})

from django.contrib.auth import login, authenticate
from resources.forms import RegistrationForm
from django.shortcuts import render, redirect

class RegistrationView(View):
    def get(self, request):
        return render(request, 'registration/register.html', {'form': RegistrationForm()})

    def post(self, request):
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            user.refresh_from_db()
            user.profile.subscribed = form.cleaned_data.get('subscribed')
            user.profile.accepted_terms = form.cleaned_data.get('accepted_terms')
            user.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('/editor/')
        return render(request, 'registration/register.html', {'form': form})

class TermsOfServiceView(View):
    def get(self, request):
        return render(request, 'terms_of_service.html')

class PrivacyPolicyView(View):
    def get(self, request):
        return render(request, 'privacy_policy.html')