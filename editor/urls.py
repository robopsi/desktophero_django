from django.conf.urls import url

from editor.views import EditorView, PoseView, CharacterView, CategoryView

urlpatterns = [
	url(r'^$', EditorView.as_view()),
	url(r'^characters$', CharacterView.as_view()),
	url(r'^poses$', PoseView.as_view()),
	url(r'^assets/(?P<category>\w{1,30})/$', CategoryView.as_view()),
]