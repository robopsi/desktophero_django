from django.shortcuts import render
from django.views import View

class EditorView(View):
	def get(self, request):
		return render(request, 'editor_main.html', {})