from django.shortcuts import render
from django.views import View

class EditorView(View):
	def get(self, request):
		from resources.models import Asset

		results = Asset.objects.all()
		categories = set([result.category for result in results])
		return render(request, 'editor_main.html', {'assets': results,
													'categories': categories})