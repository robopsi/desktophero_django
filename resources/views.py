from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

class AssetsView(View):
	valid_filters = ['category', 'author']
	
	def get(self, request):
		from resources.models import Asset

		kwfilters = {}
		for filter_name in AssetsView.valid_filters:
			if filter_name in request.GET:
				kwfilters[filter_name] = request.GET[filter_name]

		#path = default_storage.save('/assets/stuff.txt', ContentFile('Hello here is stuff'))
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
		print(form.mesh)
		return JsonResponse({'success': False})

