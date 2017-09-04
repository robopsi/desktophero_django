from django.shortcuts import render
from django.views import View
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required

class EditorView(View):
    def simple_mode_components(self):
        from resources.models import BoneGroup
        head_bone = BoneGroup.objects.get(name='head')
        neck_bone = BoneGroup.objects.get(name='neck')
        torso_bone = BoneGroup.objects.get(name='male torso')
        left_arm_bone = BoneGroup.objects.get(name='left arm')
        right_arm_bone = BoneGroup.objects.get(name='right arm')
        left_hand_bone = BoneGroup.objects.get(name='left hand')
        right_hand_bone = BoneGroup.objects.get(name='right hand')
        legs_bone = BoneGroup.objects.get(name='legs')
        platform_bone = BoneGroup.objects.get(name='platform')

        return [{
                    'bone': head_bone,
                    'attach_to': neck_bone,
                    'attach_point': "#top"
                },
                {
                    'bone': neck_bone,
                    'attach_to': torso_bone,
                    'attach_point': "#neck"
                },
                {
                    'bone': torso_bone,
                    'attach_to': legs_bone,
                    'attach_point': "#top"
                },
                {
                    'bone': legs_bone,
                    'attach_to': None,
                    'attach_point': "none"
                },
                {
                    'bone': platform_bone,
                    'attach_to': legs_bone,
                    'attach_point': "#platform"
                },
                {
                    'bone': left_arm_bone,
                    'attach_to': torso_bone,
                    'attach_point': "#left arm"
                },
                {
                    'bone': right_arm_bone,
                    'attach_to': torso_bone,
                    'attach_point': "#right arm"
                },
                {
                    'bone': left_hand_bone,
                    'attach_to': left_arm_bone,
                    'attach_point': "#hand"
                },
                {
                    'bone': right_hand_bone,
                    'attach_to': right_arm_bone,
                    'attach_point': "#hand"
                }]

    def simple_mode_categories(self):
        from resources.models import Asset, BoneGroup
        head_bone = BoneGroup.objects.get(name='head')
        neck_bone = BoneGroup.objects.get(name='neck')
        torso_bone = BoneGroup.objects.get(name='male torso')
        left_arm_bone = BoneGroup.objects.get(name='left arm')
        right_arm_bone = BoneGroup.objects.get(name='right arm')
        left_hand_bone = BoneGroup.objects.get(name='left hand')
        right_hand_bone = BoneGroup.objects.get(name='right hand')
        legs_bone = BoneGroup.objects.get(name='legs')
        platform_bone = BoneGroup.objects.get(name='platform')

        head_asset = Asset.objects.get(name='male head')
        hair_asset = Asset.objects.get(name='long hair simple')
        neck_asset = Asset.objects.get(name='thick neck')
        torso_asset = Asset.objects.get(name='male torso')
        shirt_asset = Asset.objects.get(name='simple tunic')
        right_arm_asset = Asset.objects.get(name='muscled arm right')
        left_arm_asset = Asset.objects.get(name='muscled arm left')
        right_hand_asset = Asset.objects.get(name='right hand closed')
        left_hand_asset = Asset.objects.get(name='left hand closed')
        legs_asset = Asset.objects.get(name='legs')
        pants_asset = Asset.objects.get(name='baggy pants')
        footwear_asset = Asset.objects.get(name='elvin boots')
        platform_asset = Asset.objects.get(name='smooth circular platform')

        return [{
                    'display_name': 'Head',
                    'name_safe': 'head', # corresponds to the data-tab of the tab of assets that should be displayed.
                    'bone': head_bone,
                    'asset': head_asset
                },
                {
                    'display_name': 'Hair',
                    'name_safe': 'hair',
                    'bone': head_bone,
                    'asset': hair_asset
                },
                {
                    'display_name': 'Neck',
                    'name_safe': 'neck',
                    'bone': neck_bone,
                    'asset': neck_asset
                },
                {
                    'display_name': 'Male Torso',
                    'name_safe': 'male_torso',
                    'bone': torso_bone,
                    'asset': torso_asset
                },
                {
                    'display_name': 'Shirt',
                    'name_safe': 'male_shirts',
                    'bone': torso_bone,
                    'asset': shirt_asset
                },
                {
                    'display_name': 'Left Arm',
                    'name_safe': 'arms',
                    'bone': left_arm_bone,
                    'asset': left_arm_asset
                },
                {
                    'display_name': 'Left Hand',
                    'name_safe': 'hands',
                    'bone': left_hand_bone,
                    'asset': left_hand_asset
                },
                {
                    'display_name': 'Right Arm',
                    'name_safe': 'arms',
                    'bone': right_arm_bone,
                    'asset': right_arm_asset
                },
                {
                    'display_name': 'Right Hand',
                    'name_safe': 'hands',
                    'bone': right_hand_bone,
                    'asset': right_hand_asset
                },
                {
                    'display_name': 'Legs',
                    'name_safe': 'legs',
                    'bone': legs_bone,
                    'asset': legs_asset
                },
                {
                    'display_name': 'Pants',
                    'name_safe': 'pants',
                    'bone': legs_bone,
                    'asset': pants_asset
                },
                {
                    'display_name': 'Footwear',
                    'name_safe': 'footwear',
                    'bone': legs_bone,
                    'asset': footwear_asset
                },
                {
                    'display_name': 'Platform',
                    'name_safe': 'platforms',
                    'bone': platform_bone,
                    'asset': platform_asset
                }]

    @method_decorator(login_required)
    def get(self, request):
        from resources.models import Asset, BoneGroup, Pose, Preset
        results = Asset.objects.all().exclude(reviewed=False)
        categories = set([result.category_safe() for result in results])
        bone_groups = BoneGroup.objects.all().exclude(reviewed=False)
        poses = Pose.objects.all().exclude(reviewed=False)
        presets = Preset.objects.all().exclude(reviewed=False)
        return render(request, 'editor_main.html', {'assets': results,
                                                    'categories': categories,
                                                    'bone_groups': bone_groups,
                                                    'poses': poses,
                                                    'presets': presets, 
                                                    'simple_mode_components': self.simple_mode_components(),
                                                    'simple_mode_categories': self.simple_mode_categories()})

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