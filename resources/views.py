from django.shortcuts import render, redirect
from django.http import JsonResponse, Http404
from django.views import View
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

@method_decorator(csrf_exempt, name='dispatch')
class AssetsView(View):
    valid_filters = ['category', 'author']
    
    def get(self, request):
        from resources.models import Asset

        kwfilters = {}
        for filter_name in AssetsView.valid_filters:
            if filter_name in request.GET:
                kwfilters[filter_name] = request.GET[filter_name]

        results = Asset.objects.filter(**kwfilters)
        assets = [(asset.id,
                   asset.name,
                   asset.description,
                   asset.author,
                   asset.date_created,
                   asset.category,
                   asset.thumbnail.url,
                   asset.mesh.url)
            for asset in results]
        return JsonResponse({'assets': assets})

    def delete(self, request):
        '''
        Delete all assets.
        '''
        pass
        # from resources.models import Asset
        # successes = []
        # failures = []
        # for asset in Asset.objects.all():
        #     try:
        #         asset.delete()
        #         successes.append(asset.id)
        #     except Exception as err:
        #         failures.append((asset.id, err))
        #         print(err)

        # if len(failures) == 0:
        #     return JsonResponse({'success': True, 
        #                          'message': '{} assets successfully deleted.'.format(len(successes)),
        #                          'ids': successes})
        # else:
        #     return JsonResponse({'success': False, 
        #                          'message': '{} assets successfully deleted, {} failed.'.format(len(successes), len(failures)),
        #                          'successful_ids': successes,
        #                          'errors': failures})

@method_decorator(csrf_exempt, name='dispatch')
class SingleAssetView(View):
    def get(self, request, asset_id):
        from resources.models import Asset
        try:
            result = Asset.objects.get(pk=asset_id)
            asset = (result.id,
                   result.name,
                   result.description,
                   result.author,
                   result.date_created,
                   result.category,
                   result.thumbnail.url,
                   result.mesh.url)
            return JsonResponse({'result': asset})
        except Asset.DoesNotExist as err:
            raise Http404('Asset {} does not exist.'.format(asset_id))

    def delete(self, request, asset_id):
        pass
        # from resources.models import Asset
        # try:
        #     result = Asset.objects.get(pk=asset_id)
        #     name = result.name
        #     result.delete()
        #     return JsonResponse({'success': True, 
        #                          'message': 'Asset "{}" was deleted.'.format(name)})
        # except Asset.DoesNotExist as err:
        #     raise Http404('Asset {} does not exist.'.format(asset_id))
        # except Exception as err:
        #     print(err)
        #     return JsonResponse({'success': False,
        #                          'message': 'Error deleting asset with id {}.'.format(asset_id)})

@method_decorator(csrf_exempt, name='dispatch')
class SubmitAssetView(View):
    def get(self, request):
        from .forms import AssetForm

        form = AssetForm()
        return render(request, 'upload.html', {'upload_form': form})

    def post(self, request):
        from .forms import AssetForm

        form = AssetForm(request.POST, request.FILES)
        
        if form.is_valid():
            asset = form.save(commit=False)
            if request.user.is_anonymous() and 'author' in request.POST:
                author_id = request.POST['author']
                asset.author = User.objects.get(pk=author_id)
            else:
                asset.author = request.user
            asset.reviewed = True
            asset.save()
            return JsonResponse({'success': True})
        else:
            print(form.errors)
        return JsonResponse({'success': False})


@method_decorator(csrf_exempt, name='dispatch')
class SubmitBoneGroupView(View):
    def get(self, request):
        from .forms import BoneGroupForm

        form = BoneGroupForm()
        return render(request, 'upload.html', {'upload_form': form})

    def post(self, request):
        from .forms import BoneGroupForm

        form = BoneGroupForm(request.POST, request.FILES)
        print(form)
        if form.is_valid():
            bone_group = form.save(commit=False)
            bone_group.author = request.user
            bone_group.save()
            return redirect('/resources/contribute/contribution_succeeded')
        else:
            print(form.errors)
        return redirect('/resources/contribute/contribution_failed')

@method_decorator(csrf_exempt, name='dispatch')
class BoneGroupsView(View):
    def delete(self, request):
        '''
        Delete all bone groups.
        '''
        # from resources.models import BoneGroup
        # successes = []
        # failures = []
        # for bone_group in BoneGroup.objects.all():
        #     try:
        #         bone_group.delete()
        #         successes.append(bone_group.id)
        #     except Exception as err:
        #         failures.append((bone_group.id, err))
        #         print(err)

        # if len(failures) == 0:
        #     return JsonResponse({'success': True, 
        #                          'message': '{} bone groups successfully deleted.'.format(len(successes)),
        #                          'ids': successes})
        # else:
        #     return JsonResponse({'success': False, 
        #                          'message': '{} bone groups successfully deleted, {} failed.'.format(len(successes), len(failures)),
        #                          'successful_ids': successes,
        #                          'errors': failures})
        pass

@method_decorator(csrf_exempt, name='dispatch')
class SingleBoneGroupView(View):
    def delete(self, request, bone_group_id):
        pass
        # from resources.models import BoneGroup
        # try:
        #     result = BoneGroup.objects.get(pk=bone_group_id)
        #     name = result.name
        #     result.delete()
        #     return JsonResponse({'success': True, 
        #                          'message': 'Bone group "{}" was deleted.'.format(name)})
        # except BoneGroup.DoesNotExist as err:
        #     raise Http404('Bone group {} does not exist.'.format(bone_group_id))
        # except Exception as err:
        #     print(err)
        #     return JsonResponse({'success': False,
        #                          'message': 'Error deleting bone group with id {}.'.format(bone_group_id)})


@method_decorator(csrf_exempt, name='dispatch')
class SubmitPoseView(View):
    def get(self, request):
        from .forms import PoseForm

        form = PoseForm()
        return render(request, 'upload.html', {'upload_form': form})

    def post(self, request):
        from .forms import PoseForm

        form = PoseForm(request.POST, request.FILES)
        if form.is_valid():
            pose = form.save(commit=False)
            pose.author = request.user
            pose.category = "full"
            pose.reviewed = True
            pose.save()
            return redirect('/resources/contribute/contribution_succeeded')
        else:
            print(form.errors)
        return redirect('/resources/contribute/contribution_failed')

@method_decorator(csrf_exempt, name='dispatch')
class PosesView(View):
    def delete(self, request):
        pass
        # '''
        # Delete all poses.
        # '''
        # from resources.models import Pose
        # successes = []
        # failures = []
        # for pose in Pose.objects.all():
        #     try:
        #         pose.delete()
        #         successes.append(pose.id)
        #     except Exception as err:
        #         failures.append((pose.id, err))
        #         print(err)

        # if len(failures) == 0:
        #     return JsonResponse({'success': True, 
        #                          'message': '{} poses successfully deleted.'.format(len(successes)),
        #                          'ids': successes})
        # else:
        #     return JsonResponse({'success': False, 
        #                          'message': '{} poses successfully deleted, {} failed.'.format(len(successes), len(failures)),
        #                          'successful_ids': successes,
        #                          'errors': failures})

@method_decorator(csrf_exempt, name='dispatch')
class SinglePoseView(View):
    def delete(self, request, pose_id):
        pass
        # from resources.models import Pose
        # try:
        #     result = Pose.objects.get(pk=pose_id)
        #     name = result.name
        #     result.delete()
        #     return JsonResponse({'success': True, 
        #                          'message': 'Pose "{}" was deleted.'.format(name)})
        # except Pose.DoesNotExist as err:
        #     raise Http404('Pose {} does not exist.'.format(pose_id))
        # except Exception as err:
        #     print(err)
        #     return JsonResponse({'success': False,
        #                          'message': 'Error deleting pose with id {}.'.format(pose_id)})

class SubmitPresetView(View):
    def get(self, request):
        from .forms import PresetForm

        form = PresetForm()
        return render(request, 'upload.html', {'upload_form': form})

    
    @method_decorator(login_required)
    def post(self, request):
        from .forms import PresetForm

        form = PresetForm(request.POST, request.FILES)
        if form.is_valid():
            entry = form.save(commit=False)
            entry.author = request.user
            entry.save()
            return redirect('/resources/contribute/contribution_succeeded')
        else:
            print(form.errors)
            return redirect('/resources/contribute/contribution_failed')

@method_decorator(csrf_exempt, name='dispatch')
class PresetsView(View):
    def delete(self, request):
        '''
        Delete all presets.
        '''
        '''from resources.models import Preset
        successes = []
        failures = []
        for preset in Preset.objects.all():
            try:
                preset.delete()
                successes.append(preset.id)
            except Exception as err:
                failures.append((preset.id, err))
                print(err)

        if len(failures) == 0:
            return JsonResponse({'success': True, 
                                 'message': '{} presets successfully deleted.'.format(len(successes)),
                                 'ids': successes})
        else:
            return JsonResponse({'success': False, 
                                 'message': '{} presets successfully deleted, {} failed.'.format(len(successes), len(failures)),
                                 'successful_ids': successes,
                                 'errors': failures})'''
        pass

@method_decorator(csrf_exempt, name='dispatch')
class SinglePresetView(View):
    def delete(self, request, preset_id):
        pass
        # from resources.models import Preset
        # try:
        #     result = Preset.objects.get(pk=preset_id)
        #     name = result.name
        #     result.delete()
        #     return JsonResponse({'success': True, 
        #                          'message': 'Preset "{}" was deleted.'.format(name)})
        # except Preset.DoesNotExist as err:
        #     raise Http404('Preset {} does not exist.'.format(preset_id))
        # except Exception as err:
        #     print(err)
        #     return JsonResponse({'success': False,
        #                          'message': 'Error deleting preset with id {}.'.format(preset_id)})

@method_decorator(csrf_exempt, name='dispatch')
class ContributeView(View):
    @method_decorator(login_required)
    def get(self, request):
        from .forms import AssetForm, BoneGroupForm, PoseForm, PresetForm

        asset_form = AssetForm()
        bone_group_form = BoneGroupForm()
        pose_form = PoseForm()
        preset_form = PresetForm()

        return render(request, 'contribute.html', {'asset_form': asset_form,
                                                   'bone_group_form': bone_group_form,
                                                   'pose_form': pose_form,
                                                   'preset_form': preset_form})

class PublishAssetView(View):
    @method_decorator(login_required)
    def post(self, request):
        from resources.models import Asset

        try:
            asset_id = request.POST['asset_id']
            publish = request.POST['publish']
            asset = Asset.objects.get(pk=asset_id)

            asset_author = asset.author
            request_user = request.user
            if asset_author != request_user:
                print('Ignoring a request to publish asset {} by user {}. (Asset owned by {}.)'.format(asset_id, request_user, asset_author))
                return JsonResponse({'success': False})

            asset.published = publish == 'yes'
            asset.save()
            return JsonResponse({'success': True, 
                                 'published': asset.published,
                                 'asset_id': asset_id })
        except Exception as err:
            print('Got a request to publish asset {}, but failed with exception: '.format(asset_id, err))

        return JsonResponse({'success': False})

class ContributionReceivedView(View):
    def get(self, request):
        return render(request, 'contributionreceived.html')

class ContributionFailedView(View):
    def get(self, request):
        return render(request, 'contributionfailed.html')
