from django.shortcuts import render
from django.http import JsonResponse, Http404
from django.views import View
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

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
        from resources.models import Asset
        successes = []
        failures = []
        for asset in Asset.objects.all():
            try:
                asset.delete()
                successes.append(asset.id)
            except Exception as err:
                failures.append((asset.id, err))
                print(err)

        if len(failures) == 0:
            return JsonResponse({'success': True, 
                                 'message': '{} assets successfully deleted.'.format(len(successes)),
                                 'ids': successes})
        else:
            return JsonResponse({'success': False, 
                                 'message': '{} assets successfully deleted, {} failed.'.format(len(successes), len(failures)),
                                 'successful_ids': successes,
                                 'errors': failures})

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
        from resources.models import Asset
        try:
            result = Asset.objects.get(pk=asset_id)
            name = result.name
            result.delete()
            return JsonResponse({'success': True, 
                                 'message': 'Asset "{}" was deleted.'.format(name)})
        except Asset.DoesNotExist as err:
            raise Http404('Asset {} does not exist.'.format(asset_id))
        except Exception as err:
            print(err)
            return JsonResponse({'success': False,
                                 'message': 'Error deleting asset with id {}.'.format(asset_id)})

@method_decorator(csrf_exempt, name='dispatch')
class SubmitAssetView(View):
    def get(self, request):
        from .forms import AssetForm

        form = AssetForm()
        return render(request, 'upload.html', {'upload_form': form})

    def post(self, request):
        from .forms import AssetForm

        form = AssetForm(request.POST, request.FILES)
        print(form)
        if form.is_valid():
            form.save()
            return JsonResponse({'success': True})
        else:
            print(form.errors)
        return JsonResponse({'success': False})

