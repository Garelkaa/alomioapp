from django.shortcuts import render
from django.db.models import Subquery, OuterRef
from django.http import JsonResponse

from gallery.models import GalleryImage
from users.models import User

from datetime import date


def main(request):
    return render(request, 'index.html')


def calculate_age(birth_date):
    today = date.today()
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    return age


def get_profiles(request):
    profiles = User.objects.all().values(
        'id', 'name', 'bidth', 'about', 'gender', 'city', 'orientation', 'relationship', 'childrens', 'languages', 'personality', 'zodiac', 'education', 'work', 'gallery'
    )
    
    # Список профилей для отправки на фронтенд
    profiles_list = []

    for profile in profiles:
        birth_date = profile.get('bidth')
        if birth_date:
            profile['age'] = calculate_age(birth_date)
        
        gallery = profile.get('gallery')
        if gallery:
            images = GalleryImage.objects.filter(gallery=gallery)
            image_urls = [img.image.url for img in images]
            profile['images'] = image_urls if image_urls else ['https://via.placeholder.com/800x600']
        else:
            profile['images'] = ['https://via.placeholder.com/800x600']

        profiles_list.append(profile)

    return JsonResponse(profiles_list, safe=False)

