from django.urls import path
from alomioapp import settings
from django.conf.urls.static import static

from . import views

app_name = 'cards'

urlpatterns = [
    path('', views.main),
    path('get_profiles/', views.get_profiles, name='get_profiles'),
    path('add_like/', views.add_like, name='add_like'),
    path('likes/', views.likes, name='likes'),
    path('mulally/', views.mulally, name='mulally'),
    path('detail/<int:user_id>/', views.detail_mulally, name='detail_mulally'),
    path('detail-likes/<int:user_id>//', views.detail_likes, name='detail_likes'),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)