from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.conf import settings
from django.contrib.auth import views as auth_views
from editor.views import RegistrationView, TermsOfServiceView, PrivacyPolicyView

urlpatterns = [
	url(r'^', include('editor.urls')),
    url(r'^resources/', include('resources.urls')),
    url(r'^editor/', include('editor.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^accounts/login/', auth_views.login, name='login'),
    url(r'^accounts/logout/', auth_views.logout, name='logout'),
    url(r'^accounts/register/', RegistrationView.as_view(), name='register'),

    url(r'^terms_of_service/', TermsOfServiceView.as_view(), name='terms_of_service'),
    url(r'^privacy_policy/', PrivacyPolicyView.as_view(), name='privacy_policy'),
]

handler400 = 'editor.views.handler400'
