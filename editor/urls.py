from django.conf.urls import url

from editor.views import EditorView, PoseView, CharacterView

urlpatterns = [
	url(r'^$', EditorView.as_view()),
	url(r'^characters$', CharacterView.as_view()),
	url(r'^poses$', PoseView.as_view()),
]