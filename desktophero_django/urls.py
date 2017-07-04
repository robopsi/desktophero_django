from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.conf import settings

urlpatterns = [
    url(r'^resources/', include('resources.urls')),
    url(r'^editor/', include('editor.urls')),
    url(r'^admin/', admin.site.urls),
]