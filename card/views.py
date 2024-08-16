import json
from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from card.models import Likes
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
    profiles = User.objects.exclude(id=7).values(
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


@csrf_exempt
def add_like(request):
    try:
        data = json.loads(request.body)
        liked_user_id = data.get('liked_user_id')

        if not liked_user_id:
            return JsonResponse({'success': False, 'error': 'No liked user ID provided'})

        liked_user = User.objects.get(id=liked_user_id)
        current_user = User.objects.get(id=7) 

        like, created = Likes.objects.get_or_create(user=current_user, liked_user=liked_user, mutually=False)

        if created:
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'error': 'Like already exists'})
    except User.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'User not found'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})
    

def likes(request):
    current_user = User.objects.get(id=7) # Предполагается, что пользователь вошел в систему
    likes = Likes.objects.filter(liked_user=current_user).select_related('user')
    
    if likes.exists():
        context = {
            'liked_users': likes,
        }
        return render(request, 'youlikethey.html', context)
    else:
        return render(request, 'nolikes.html')
    
    
def mulally(request):
    current_user = User.objects.get(id=7) # Предполагается, что пользователь вошел в систему
    likes = Likes.objects.filter(liked_user=current_user).select_related('user')
    
    # liked_users = User.objects.filter(id__in=[like['liked_user_id'] for like in likes])
    

    if likes.filter(mutually=True):
        context = {
            'liked_users': likes,
        }
        return render(request, 'mulally.html', context)
    else:
        return render(request, 'nomulally.html')
    

def detail_mulally(request, user_id):
    user = get_object_or_404(User, id=user_id)
    return render(request, 'profile_detail_mulally.html', context={'user': user})


def detail_likes(request, user_id):
    user = get_object_or_404(User, id=user_id)
    return render(request, 'profile_detail_likes.html', context={'user': user})
    