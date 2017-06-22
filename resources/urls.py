from django.conf.urls import url

from resources.views import AssetsView, SingleAssetView, SubmitAssetView

urlpatterns = [
	url(r'^assets/?$', AssetsView.as_view()),
	url(r'^assets/(?P<asset_id>[0-9a-f-]+)/?$', SingleAssetView.as_view()),
	url(r'^assets/submit/?$', SubmitAssetView.as_view())
]