from django.conf.urls import url

from resources.views import AssetsView, SingleAssetView, SubmitAssetView, \
							BoneGroupsView, SingleBoneGroupView, SubmitBoneGroupView, \
							PosesView, SinglePoseView, SubmitPoseView, \
							PresetsView, SinglePresetView, SubmitPresetView

urlpatterns = [
	url(r'^assets/?$', AssetsView.as_view()),
	url(r'^assets/(?P<asset_id>[0-9a-f-]+)/?$', SingleAssetView.as_view()),
	url(r'^assets/submit/?$', SubmitAssetView.as_view()),

	url(r'^bone_groups/?$', BoneGroupsView.as_view()),
	url(r'^bone_groups/(?P<bone_group_id>[0-9a-f-]+)/?$', SingleBoneGroupView.as_view()),
	url(r'^bone_groups/submit/?$', SubmitBoneGroupView.as_view()),

	url(r'^poses/?$', PosesView.as_view()),
	url(r'^poses/(?P<pose_id>[0-9a-f-]+)/?$', SinglePoseView.as_view()),
	url(r'^poses/submit/?$', SubmitPoseView.as_view()),

	url(r'^presets/?$', PresetsView.as_view()),
	url(r'^presets/(?P<preset_id>[0-9a-f-]+)/?$', SinglePresetView.as_view()),
	url(r'^presets/submit/?$', SubmitPresetView.as_view())
]
