from django.urls import path
from alomioapp import settings
from django.conf.urls.static import static

from . import views

app_name = 'cards'

urlpatterns = [
    path('', views.main),
    path('get_profiles/', views.get_profiles, name='get_profiles')
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)