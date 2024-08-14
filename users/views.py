from datetime import datetime
import json
import random
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt

from users.tasks import send_verification_email

from .models import User
from gallery.models import Gallery, GalleryImage
from .forms import UsersForm

from datetime import date


def calculate_age(birth_date):
    today = date.today()
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    return age



def regestration(request):
    if request.method == 'POST':
        form = UsersForm(request.POST)
        if form.is_valid():
            # Вытаскиваем очищенные данные из формы
            email_or_phone = form.cleaned_data['email_or_phone']
            password = form.cleaned_data['password']
            code = random.randint(10000, 99999)
            
            if '@' in email_or_phone:
                email = email_or_phone
                phone_number = None
                # send_verification_email.delay(email, code)
    

            user = User.objects.create(
                email=email,
                phone_number=phone_number,
                password=make_password(password),
                username=email_or_phone,
                first_name = None,
                last_name = None,
                name=None,
                age=None,
                city=None,
                about=None,
                work=None,
                height=None,
                code=code
            )
            user.save()
            
            return render(request, 'success.html')
        else:
            print(form.errors)
    
    else:
        form = UsersForm()

    return render(request, 'regestration.html', {'form': form})


def verify_email(request):
    user = User.objects.get(pk=7)
    if request.method == 'POST':
        code = int(request.POST.get('code'))
        code_user = int(user.code)        
        if code == code_user:
            print('success')
        else:
            print('net')
    
    return render(request, 'verify_email.html')


def personal_info(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        birth = request.POST.get('date')
        selected_gender = request.POST.get('selected_gender')
        selected_interest = request.POST.get('selected_interest')
        
        try:
            birth = datetime.strptime(birth, '%d.%m.%Y').date()
        except ValueError:
            return render(request, 'personal_info.html', {'error': 'Invalid date format. Please use DD.MM.YYYY.'})
        
        
        user = User.objects.get(pk=7)
        gallery = Gallery.objects.create(title=user.username)
        gallery.save()
        user.name = name
        user.bidth = birth
        user.gender = selected_gender
        user.interest_gender = selected_interest
        user.save()
        return render(request, 'success.html')
    return render(request, 'personal_info.html')


def goal(request):
    if request.method == 'POST':
        selected_goal = request.POST.get('selected_goal')
        user = User.objects.get(pk=7)
        user.goal = selected_goal
        user.save()
        return render(request, 'success.html')
    return render(request, 'goal.html')


def choice_your_city(request):
    if request.method == 'POST':
        selected_city = request.POST.get('selected_city')
        user = User.objects.get(pk=7)
        user.city = selected_city
        user.save()
        return render(request, 'success.html')
    return render(request, 'choice_your_city.html')


def add_photo(request):
        
    return render(request, 'add_photo.html')


@csrf_exempt
def upload_image(request):
    if request.method == 'POST' and request.FILES.get('image'):
        user = User.objects.get(pk=7)
        image = request.FILES['image']

        if not user.gallery:
            user.gallery = Gallery.objects.create(title=user.username)
            user.save()

        gallery_image = GalleryImage.objects.create(image=image, gallery=user.gallery)

        return JsonResponse({'success': True})

    return JsonResponse({'success': False})


@csrf_exempt
def delete_photo(request):
    try:
        data = json.loads(request.body)
        image_id = data.get('id')
        print(image_id)
        user = User.objects.get(pk=7)
        # Найдите и удалите изображение
        image = user.gallery.images.get(id=image_id)
        print(image)
        image.delete()
        
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


@csrf_exempt 
def update_info_user(request):
    if request.method == 'POST':
        try:
            # Получаем данные из запроса
            data = json.loads(request.POST.get('user_data', '{}'))
            user = User.objects.get(pk=7)
            user.name = data.get('name')
            user.bidth = data.get('age')
            if data.get('gender') == 'Женский':
                user.gender = 'F'
            else:
                user.gender = 'M'
            user.city = data.get('city')
            print(data.get('goal'))
            user.goal = data.get('goal')
            user.save()
            
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
    
    
@csrf_exempt
def update_about_user(request):
    if request.method == 'POST':
        about = request.POST.get('about')
        user = User.objects.get(pk=7)
        user.about = about
        user.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)


@csrf_exempt
def update_work_user(request):
    if request.method == 'POST':
        work = request.POST.get('work')
        print(work)
        user = User.objects.get(pk=7)
        user.work = work
        user.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)


@csrf_exempt
def update_gender_user(request):
    if request.method == 'POST':
        about = request.POST.get('about')
        user = User.objects.get(pk=7)
        user.orientation = about
        user.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)


@csrf_exempt
def update_family_user(request):
    if request.method == 'POST':
        about = request.POST.get('about')
        user = User.objects.get(pk=7)
        user.relationship = about
        user.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)


@csrf_exempt
def update_personality_user(request):
    if request.method == 'POST':
        about = request.POST.get('about')
        user = User.objects.get(pk=7)
        user.personality = about
        user.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)


@csrf_exempt
def update_children_user(request):
    if request.method == 'POST':
        about = request.POST.get('about')
        user = User.objects.get(pk=7)
        user.childrens = about
        user.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)


@csrf_exempt
def update_education_user(request):
    if request.method == 'POST':
        about = request.POST.get('about')
        user = User.objects.get(pk=7)
        user.education = about
        user.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)


@csrf_exempt
def update_smoking_user(request):
    if request.method == 'POST':
        about = request.POST.get('about')
        user = User.objects.get(pk=7)
        user.smoking = about
        user.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)


@csrf_exempt
def update_alco_user(request):
    if request.method == 'POST':
        about = request.POST.get('about')
        user = User.objects.get(pk=7)
        user.alcohol = about
        user.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)


@csrf_exempt
def update_height_user(request):
    if request.method == 'POST':
        height = request.POST.get('height')
        print(height)
        user = User.objects.get(pk=7)
        user.height = height
        user.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)


@csrf_exempt
def update_language_user(request):
    if request.method == 'POST':
        language = request.POST.get('language')
        user = User.objects.get(pk=7)
        user.languages = language
        user.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)


@csrf_exempt
def update_zodiac_user(request):
    if request.method == 'POST':
        zodiac = request.POST.get('zodiac')
        user = User.objects.get(pk=7)
        user.zodiac = zodiac
        user.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)

@csrf_exempt
def update_theme(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        dark_mode = data.get('dark_mode', None)
        user = User.objects.get(pk=7)
        user.theme = dark_mode
        user.save()
        print(f"Received dark_mode: {dark_mode}")  # Для отладки
        # Ваш код для обработки значения dark_mode
        return JsonResponse({'status': 'success', 'dark_mode': dark_mode})
    return JsonResponse({'status': 'fail'}, status=400)

    
def profile(request):
    user = User.objects.get(pk=7)
    age = calculate_age(user.bidth) if user.bidth else None
    gallery = Gallery.objects.get(title=user.username)
    bidth = user.bidth
    
    return render(request, 'profile.html', context={'user': user, 'age':age, 'gallery': gallery, 'bidth': bidth})

def prem_popup(request):
    user = User.objects.get(pk=7)
    return render(request, 'premium-popup.html', {'user': user})

def prem_detail(request):
    user = User.objects.get(pk=7)
    return render(request, 'prem_tariff_popup.html', {'user': user})

def payment(request):
    user = User.objects.get(pk=7)
    return render(request, 'payment.html', {'user': user})

def settings(request):
    user = User.objects.get(pk=7)
    return render(request, 'settings.html', {'user': user})

def user_account(request):
    user = User.objects.get(pk=7)
    return render(request, 'user_account.html', {'user': user})

@csrf_exempt
def user_account_delete(request):
    user = User.objects.get(pk=8).delete()
    return render(request, 'user_account.html', {'user': user})

def interface(request):
    user = User.objects.get(pk=7)
    return render(request, 'interface.html', {'user': user})

def info_user(request):
    user = get_object_or_404(User, id=7)
    return render(request, 'info_user.html', {'user': user})

def genders(request):
    return render(request, 'genders.html')

def about(request):
    user = get_object_or_404(User, id=7)
    is_dark_mode = user.theme
    return render(request, 'about.html', {'user': user, 'is_dark_mode': is_dark_mode,})

def interested(request):
    return render(request, 'interested.html')

def user_gender(request):
    user = get_object_or_404(User, id=7)
    return render(request, 'user_gender.html', context={'user': user})

def family(request):
    user = User.objects.get(pk=7)
    return render(request, 'family.html',context={'user': user})

def personality(request):
    user = User.objects.get(pk=7)
    return render(request, 'personality.html',context={'user': user})

def children(request):
    user = get_object_or_404(User, id=7)
    return render(request, 'children.html', {'user':user})

def education(request):
    user = get_object_or_404(User, id=7)
    return render(request, 'education.html', {'user':user})

def language(request):
    user = get_object_or_404(User, id=7)
    return render(request, 'language.html', {'user':user})

def work(request):
    user = get_object_or_404(User, id=7)
    return render(request, 'work.html', {'user':user})

def smoking(request):
    user = get_object_or_404(User, id=7)
    return render(request, 'smoking.html', {'user':user})

def zodiac(request):
    user = get_object_or_404(User, id=7)
    return render(request, 'zodiac.html', {'user':user})

def alcohol(request):
    user = get_object_or_404(User, id=7)
    return render(request, 'alcohol.html', {'user':user})

def user_height(request):
    user = get_object_or_404(User, id=7)
    return render(request, 'height_user.html', {'user':user})

def detail_profile(request):
    user = get_object_or_404(User, id=7)
    gallery = Gallery.objects.get(pk=user.gallery_id)
    age = calculate_age(user.bidth) if user.bidth else None
    bidth = user.bidth
    return render(request, 'detail_profile.html', {'user': user, 'gallery': gallery, 'age': age, 'bidth': bidth})