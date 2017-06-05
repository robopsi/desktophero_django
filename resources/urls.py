from django.conf.urls import url

from resources.views import AssetsView, SubmitAssetView

urlpatterns = [
	url(r'^assets/?$', AssetsView.as_view()),
	url(r'^assets/submit/?$', SubmitAssetView.as_view())
]