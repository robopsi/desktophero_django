from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
	url(r'^resources/', include('resources.urls')),
	url(r'^admin/', admin.site.urls),
]