import datetime
import json
from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

from card.models import Likes
from gallery.models import GalleryImage
from users.models import User, UserFilters

from datetime import date, datetime

from dateutil.relativedelta import relativedelta


def main(request):
    user_settings, created = UserFilters.objects.get_or_create(user=7)
    return render(request, 'index.html', {'user_settings': user_settings})


def calculate_age(birth_date):
    today = date.today()
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    return age


def get_profiles(request):
    # Получение фильтров для пользователя с id=7
    user_filters = UserFilters.objects.get(user=7)
    
    # Определение фильтров
    gender_filter = user_filters.gender
    min_age = user_filters.min_age
    max_age = user_filters.max_age
    city_filter = user_filters.city
    min_bidth_date = datetime.now() - relativedelta(years=max_age)
    max_bidth_date = datetime.now() - relativedelta(years=min_age)
    
    # Получение списка пользователей, которых уже лайкнули
    liked_user_ids = Likes.objects.filter(user=7).values_list('liked_user', flat=True)
    
    # Базовый запрос для фильтрации профилей
    base_query = User.objects.exclude(id=7).exclude(id__in=liked_user_ids).filter(
        Q(bidth__gte=min_bidth_date) &
        Q(bidth__lte=max_bidth_date)
    )
    
    # Фильтрация по городу
    if gender_filter == 'A':
        profiles = base_query.filter(
            Q(city=city_filter)
        ).values(
            'id', 'name', 'bidth', 'about', 'gender', 'city', 'orientation', 'relationship', 'childrens', 'languages', 'personality', 'zodiac', 'education', 'work', 'gallery'
        )
    else:
        profiles = base_query.filter(
            Q(gender=gender_filter) &
            Q(city=city_filter)
        ).values(
            'id', 'name', 'bidth', 'about', 'gender', 'city', 'orientation', 'relationship', 'childrens', 'languages', 'personality', 'zodiac', 'education', 'work', 'gallery'
        )
    
    # Проверка, если профилей недостаточно, расширяем поиск на все города
    if not profiles.exists():
        if gender_filter == 'A':
            profiles = base_query.values(
                'id', 'name', 'bidth', 'about', 'gender', 'city', 'orientation', 'relationship', 'childrens', 'languages', 'personality', 'zodiac', 'education', 'work', 'gallery'
            )
        else:
            profiles = base_query.filter(
                Q(gender=gender_filter)
            ).values(
                'id', 'name', 'bidth', 'about', 'gender', 'city', 'orientation', 'relationship', 'childrens', 'languages', 'personality', 'zodiac', 'education', 'work', 'gallery'
            )
    
    # Список профилей для отправки на фронтенд
    profiles_list = []

    for profile in profiles:
        bidth = profile.get('bidth')
        if bidth:
            profile['age'] = calculate_age(bidth)

        gallery = profile.get('gallery')
        if gallery:
            images = GalleryImage.objects.filter(gallery=gallery)
            image_urls = [img.image.url for img in images]
            profile['images'] = image_urls if image_urls else ['https://via.placeholder.com/800x600']
        

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


@csrf_exempt
def update_settings(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        gender = data.get('gender')
        min_age = data.get('min_age', 18)
        max_age = data.get('max_age', 60)
        print(gender)

        if min_age > max_age:
            return JsonResponse({'success': False, 'error': 'Минимальный возраст не может быть больше максимального.'})

        # Assume `request.user` is the current logged-in user
        user_filter, created = UserFilters.objects.get_or_create(user=7)
        user_filter.gender = gender
        user_filter.min_age = min_age
        user_filter.max_age = max_age
        user_filter.save()

        return JsonResponse({'success': True})

    return JsonResponse({'success': False, 'error': 'Invalid request method'})
    