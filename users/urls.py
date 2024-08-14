from django.urls import path
from django.conf.urls.static import static
from alomioapp import settings
from . import views

app_name = 'users'

urlpatterns = [
    path('registration/', views.regestration, name='registration'),
    path('verify-email/', views.verify_email, name='verify_email'),
    path('personal-info/', views.personal_info, name='personal_info'),
    path('goal/', views.goal, name='goal'),
    path('choice-city/', views.choice_your_city, name='choice_your_city'),
    path('add-photo/', views.add_photo, name='add_photo'),
    path('upload-image/', views.upload_image, name='upload_image'),
    path('delete-photo/', views.delete_photo, name='delete_photo'),
    path('upload-user-info/', views.update_info_user, name='update_info_user'),
    path('upload-user-about/', views.update_about_user, name='update_about_user'),
    path('update-gender-user/', views.update_gender_user, name='update_gender_user'),
    path('update-family-user/', views.update_family_user, name='update_family_user'),
    path('update-personality-user/', views.update_personality_user, name='update_personality_user'),
    path('update-children-user/', views.update_children_user, name='update_children_user'),
    path('update-education-user/', views.update_education_user, name='update_education_user'),
    path('update-smoking-user/', views.update_smoking_user, name='update_smoking_user'),
    path('update-alcohol-user/', views.update_alco_user, name='update_alcohol_user'),
    path('profile/', views.profile, name='profile'),
    path('prem-popup/', views.prem_popup, name='prem_popup'),
    path('prem-detail/', views.prem_detail, name='prem_detail'),
    path('payment/', views.payment, name='payment'),
    path('settings/', views.settings, name='settings'),
    path('user-account/', views.user_account, name='user_account'),
    path('delete-user-account/', views.user_account_delete, name='user_account_delete'),
    path('notifications/', views.notifications, name='notifications'),
    path('interface/', views.interface, name='interface'),
    path('info-user/', views.info_user, name='info_user'),
    path('genders/', views.genders, name='genders'),
    path('about/', views.about, name='about'),
    path('interested/', views.interested, name='interested'),
    path('user-gender/', views.user_gender, name='user_gender'),
    path('family/', views.family, name='family'),
    path('personality/', views.personality, name='personality'),
    path('children/', views.children, name='children'),
    path('education/', views.education, name='education'),
    path('language/', views.language, name='language'),
    path('work/', views.work, name='work'),
    path('smoking/', views.smoking, name='smoking'),
    path('zodiac/', views.zodiac, name='zodiac'),
    path('alcohol/', views.alcohol, name='alcohol'),
    path('user-height/', views.user_height, name='user_height'),
    path('detail-profile/', views.detail_profile, name='detail_profile'),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
