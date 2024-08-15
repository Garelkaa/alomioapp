from django.shortcuts import render
from django.db.models import Subquery, OuterRef
from django.http import JsonResponse

from users.models import User

from datetime import date


def main(request):
    return render(request, 'index.html')


def calculate_age(birth_date):
    today = date.today()
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    return age


def get_profiles(request):
    gender_filter = request.GET.get('gender')
    min_age_filter = request.GET.get('min_age')
    max_age_filter = request.GET.get('max_age')
    
    profiles = User.objects.all()

    # Exclude profiles that the user has liked
    # liked_profiles = Likes.objects.filter(user=request.user).values_list('likeuser_id', flat=True)

    # Exclude profiles where there is a coincidence
    

    
    
    profile_list = []
    
    for profile in profiles:
        age = calculate_age(profile.bidth) if profile.bidth else None
        
        image_urls = []
        if profile.gallery and profile.gallery.galleryimage_set.exists():
            image_urls = [image.image.url for image in profile.gallery.galleryimage_set.all()]
        
        profile_data = {
            'id': profile.id,
            'firstName': profile.name,
            'age': age,
            'gender': profile.gender,
            'about': profile.about_user,
            'interests': [interest.name for interest in profile.interests.all()],
            'images': image_urls,
            'distance': profile.city,
            'user_id': request.user.id
        }
        profile_list.append(profile_data)
    
    return JsonResponse({'profiles': profile_list})
