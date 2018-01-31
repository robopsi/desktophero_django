from django.shortcuts import render
from django.views import View
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required

class EditorView(View):
    @staticmethod
    def simple_mode_components():
        from resources.models import BoneGroup
        head_bone = BoneGroup.objects.filter(name__iexact='head')[0]
        neck_bone = BoneGroup.objects.filter(name__iexact='neck')[0]
        left_arm_bone = BoneGroup.objects.filter(name__iexact='left arm')[0]
        right_arm_bone = BoneGroup.objects.filter(name__iexact='right arm')[0]
        left_hand_bone = BoneGroup.objects.filter(name__iexact='left hand')[0]
        right_hand_bone = BoneGroup.objects.filter(name__iexact='right hand')[0]
        platform_bone = BoneGroup.objects.filter(name__iexact='platform')[0]
        handheld_bone = BoneGroup.objects.filter(name__iexact='weapon')[0]
        body_bone = BoneGroup.objects.filter(name__iexact='body')[0]
        tail_bone = BoneGroup.objects.filter(name__iexact='tail')[0]
        wings_bone = BoneGroup.objects.filter(name__iexact='wings')[0]

        return [{
                    'bone': head_bone,
                    'category': "head",
                    'attach_to': '>neck_bone',
                    'attach_point': "#top",
                    'instance_id': '>head_bone'
                },
                {
                    'bone': neck_bone,
                    'category': "neck",
                    'attach_to': '>body_bone',
                    'attach_point': "#neck",
                    'instance_id': '>neck_bone'
                },
                {
                    'bone': body_bone,
                    'category': "body",
                    'attach_to': None,
                    'attach_point': "#palm",
                    'instance_id': '>body_bone'
                },
                {
                    'bone': platform_bone,
                    'category': "platform",
                    'attach_to': '>body_bone',
                    'attach_point': "#platform",
                    'instance_id': '>platform_bone'
                },
                {
                    'bone': left_arm_bone,
                    'category': "left_arm",
                    'attach_to': '>body_bone',
                    'attach_point': "#left arm",
                    'instance_id': '>left_arm_bone'
                },
                {
                    'bone': right_arm_bone,
                    'category': "right_arm",
                    'attach_to': '>body_bone',
                    'attach_point': "#right arm",
                    'instance_id': '>right_arm_bone'
                },
                {
                    'bone': left_hand_bone,
                    'category': "left_hand",
                    'attach_to': '>left_arm_bone',
                    'attach_point': "#hand",
                    'instance_id': '>left_hand_bone'
                },
                {
                    'bone': right_hand_bone,
                    'category': "right_hand",
                    'attach_to': '>right_arm_bone',
                    'attach_point': "#hand",
                    'instance_id': '>right_hand_bone'
                },
                {
                    'bone': handheld_bone,
                    'category': "right_hand_item",
                    'attach_to': '>right_hand_bone',
                    'attach_point': "#palm",
                    'instance_id': '>right_handheld_bone'
                },
                {
                    'bone': handheld_bone,
                    'category': "left_hand_item",
                    'attach_to': '>left_hand_bone',
                    'attach_point': "#palm",
                    'instance_id': '>left_handheld_bone'
                },
                {
                    'bone': tail_bone,
                    'category': 'tail',
                    'attach_to': '>body_bone',
                    'attach_point': "#tail",
                    'instance_id': '>tail_bone'
                },
                {
                    'bone': wings_bone,
                    'category': 'wings',
                    'attach_to': '>body_bone',
                    'attach_point': "#back mid high",
                    'instance_id': '>wings_bone'
                }]

    @staticmethod
    def simple_mode_categories():
        from resources.models import Asset, BoneGroup
        head_bone = BoneGroup.objects.filter(name__iexact='head')[0]
        neck_bone = BoneGroup.objects.filter(name__iexact='neck')[0]
        left_arm_bone = BoneGroup.objects.filter(name__iexact='left arm')[0]
        right_arm_bone = BoneGroup.objects.filter(name__iexact='right arm')[0]
        left_hand_bone = BoneGroup.objects.filter(name__iexact='left hand')[0]
        right_hand_bone = BoneGroup.objects.filter(name__iexact='right hand')[0]
        platform_bone = BoneGroup.objects.filter(name__iexact='platform')[0]
        left_handheld_bone = BoneGroup.objects.filter(name__iexact='weapon')[0]
        right_handheld_bone = BoneGroup.objects.filter(name__iexact='weapon')[0]
        body_bone = BoneGroup.objects.filter(name__iexact='body')[0]

        head_asset = Asset.objects.filter(name__iexact='male head')[0]
        hair_asset = Asset.objects.filter(name__iexact='long hair simple')[0]
        neck_asset = Asset.objects.filter(name__iexact='thick neck')[0]
        shirt_asset = Asset.objects.filter(name__iexact='simple tunic')[0]
        right_arm_asset = Asset.objects.filter(name__iexact='muscled arm right')[0]
        left_arm_asset = Asset.objects.filter(name__iexact='muscled arm left')[0]
        right_hand_asset = Asset.objects.filter(name__iexact='right hand closed')[0]
        left_hand_asset = Asset.objects.filter(name__iexact='left hand closed')[0]
        pants_asset = Asset.objects.filter(name__iexact='male short pants')[0]
        skirts_asset = None
        legwear_asset = None
        footwear_asset = Asset.objects.get(name__iexact='male simple shoes')
        platform_asset = Asset.objects.get(name__iexact='smooth circular platform')
        weapon_asset = Asset.objects.get(name__iexact='shortsword')
        body_asset = Asset.objects.get(name__iexact='male body')

        return [{
                    'display_name': 'Head',
                    'name_safe': 'head', # Used to distinguish this group from another group, like left hand and right hand
                    'asset_category': 'head', # corresponds to the data-tab of the tab of assets that should be displayed.
                    'bone_instance_id': '>head_bone',
                    'asset': head_asset
                },
                {
                    'display_name': 'Hair',
                    'name_safe': 'hair',
                    'asset_category': 'hair',
                    'bone_instance_id': '>head_bone',
                    'asset': hair_asset
                },
                {
                    'display_name': 'Headgear',
                    'name_safe': 'headgear',
                    'asset_category': 'headgear',
                    'bone_instance_id': '>head_bone',
                    'asset': None
                },
                {
                    'display_name': 'Mask',
                    'name_safe': 'mask',
                    'asset_category': 'masks',
                    'bone_instance_id': '>head_bone',
                    'asset': None
                },
                {
                    'display_name': 'Horns',
                    'name_safe': 'horns',
                    'asset_category': 'horns',
                    'bone_instance_id': '>head_bone',
                    'asset': None
                },
                {
                    'display_name': 'Collar',
                    'name_safe': 'collar',
                    'asset_category': 'collars',
                    'bone_instance_id': '>body_bone',
                    'asset': None
                },
                {
                    'display_name': 'Neck',
                    'name_safe': 'neck',
                    'asset_category': 'neck',
                    'bone_instance_id': '>neck_bone',
                    'asset': neck_asset
                },
                {
                    'display_name': 'Body',
                    'name_safe': 'body',
                    'asset_category': 'body',
                    'bone_instance_id': '>body_bone',
                    'asset': body_asset
                },
                {
                    'display_name': 'Shirt (Female)',
                    'name_safe': 'female_shirt',
                    'asset_category': 'female_shirts',
                    'bone_instance_id': '>body_bone',
                    'asset': None
                },
                {
                    'display_name': 'Shirt (Male)',
                    'name_safe': 'male_shirt',
                    'asset_category': 'male_shirts',
                    'bone_instance_id': '>body_bone',
                    'asset': shirt_asset
                },
                {
                    'display_name': 'Left Arm',
                    'name_safe': 'left_arm',
                    'asset_category': 'arms',
                    'bone_instance_id': '>left_arm_bone',
                    'asset': left_arm_asset
                },
                {
                    'display_name': 'Armwear Left',
                    'name_safe': 'left_armwear',
                    'asset_category': 'armwear',
                    'bone_instance_id': '>left_arm_bone',
                    'asset': None
                },
                {
                    'display_name': 'Left Hand',
                    'name_safe': 'left_hand',
                    'asset_category': 'hands',
                    'bone_instance_id': '>left_hand_bone',
                    'asset': left_hand_asset
                },
                {
                    'display_name': 'Right Arm',
                    'name_safe': 'right_arm',
                    'asset_category': 'arms',
                    'bone_instance_id': '>right_arm_bone',
                    'asset': right_arm_asset
                },
                {
                    'display_name': 'Armwear Right',
                    'name_safe': 'right_armwear',
                    'asset_category': 'armwear',
                    'bone_instance_id': '>right_arm_bone',
                    'asset': None
                },
                {
                    'display_name': 'Right Hand',
                    'name_safe': 'right_hand',
                    'asset_category': 'hands',
                    'bone_instance_id': '>right_hand_bone',
                    'asset': right_hand_asset
                },
                {
                    'display_name': 'Pants',
                    'name_safe': 'pants',
                    'asset_category': 'pants',
                    'bone_instance_id': '>body_bone',
                    'asset': pants_asset
                },
                {
                    'display_name': 'Skirt',
                    'name_safe': 'skirt',
                    'asset_category': 'skirts',
                    'bone_instance_id': '>body_bone',
                    'asset': None
                },
                {
                    'display_name': 'Belt',
                    'name_safe': 'belt',
                    'asset_category': 'belts',
                    'bone_instance_id': '>body_bone',
                    'asset': None
                },
                {
                    'display_name': 'Legwear',
                    'name_safe': 'legwear',
                    'asset_category': 'legwear',
                    'bone_instance_id': '>body_bone',
                    'asset': None
                },
                {
                    'display_name': 'Footwear',
                    'name_safe': 'footwear',
                    'asset_category': 'footwear',
                    'bone_instance_id': '>body_bone',
                    'asset': footwear_asset
                },
                {
                    'display_name': 'Platform',
                    'name_safe': 'platform',
                    'asset_category': 'platforms',
                    'bone_instance_id': '>platform_bone',
                    'asset': platform_asset
                },
                {
                    'display_name': 'Cape',
                    'name_safe': 'cape',
                    'asset_category': 'capes',
                    'bone_instance_id': '>body_bone',
                    'asset': None
                },
                {
                    'display_name': 'Left Hand Item',
                    'name_safe': 'left_hand_item',
                    'asset_category': 'weapons',
                    'bone_instance_id': '>left_handheld_bone',
                    'asset': weapon_asset
                },
                {
                    'display_name': 'Right Hand Item',
                    'name_safe': 'right_hand_item',
                    'asset_category': 'weapons',
                    'bone_instance_id': '>right_handheld_bone',
                    'asset': weapon_asset
                },
                {
                    'display_name': 'Tail',
                    'name_safe': 'tail',
                    'asset_category': 'tails',
                    'bone_instance_id': '>tail_bone',
                    'asset': None
                },
                {
                    'display_name': 'Wings',
                    'name_safe': 'wings',
                    'asset_category': 'wings',
                    'bone_instance_id': '>wings_bone',
                    'asset': None
                }]

    def get(self, request):
        from resources.models import Asset, BoneGroup, Pose, Preset, AssetForProcessing
        assets = list(Asset.objects.filter(library='official'))
        assets.extend(list(Asset.objects.filter(library='user_gen', published=True)))
        user_assets = []
        asset_uploads = []
        if not request.user.is_anonymous:
            user_assets = Asset.objects.filter(author=request.user)
            asset_uploads = AssetForProcessing.objects.filter(author=request.user)

        categories = set([asset.category_safe() for asset in assets]
                          + [asset.category_safe() for asset in user_assets])
        bone_groups = BoneGroup.objects.all()
        poses = Pose.objects.all()
        presets = Preset.objects.filter(library='official')
        characters = Preset.objects.filter(library='user_gen')
        return render(request, 'editor_main.html', {'assets': set(assets),
                                                    'user_assets': user_assets,
                                                    'categories': categories,
                                                    'bone_groups': bone_groups,
                                                    'poses': poses,
                                                    'presets': presets,
                                                    'characters': characters,
                                                    'asset_uploads': asset_uploads,
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

from django.shortcuts import render_to_response
from django.template import RequestContext

def handler400(request):
    return render(request, 'waiting_for_release.html')
