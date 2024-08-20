from django.db import models
from django.contrib.auth.models import AbstractUser

from gallery.models import Gallery

class User(AbstractUser):
    CHOICES = [
        ('F', 'Женский'),
        ('M', 'Мужской'),
        ('A', 'All'),
    ]
    
    GOAL_CHOICES = [
        ('L', 'Любовь'),
        ('R', 'Романтика'),
        ('O', 'Общение'),
    ]
    
    CHILDRENS_CHOICES = [
        ('Y', 'Есть'),
        ('N', 'Нету')
    ]
    
    ORIENTATION_CHOICES = [
        ('H', 'Гетеросексуал'),
        ('G', 'Гей / Лесбиянка'),
        ('B', 'Бисексуал'),
        ('A', 'Асексуал'),
        ('D', 'Демисексуал'),
        ('P', 'Пансексуал')
    ]
    
    RELATIONSHIP_CHOICES = [
        ('Y', 'В отношениях'),
        ('N', 'Не в отношениях'),
        ('S', 'В свободных отношениях')
    ]
    
    PERSONALITY_CHOICES = [
        ('E', 'Экстраверт'),
        ('I', 'Интроверт'),
        ('S', 'Что-то между'),
    ]
    
    EDUCATION_CHOICES = [
        ('S', 'Среднее'),
        ('M', "Магистр"),
        ('V', "Высшее"),
    ]
    
    SMOKING_ALCO = [
        ('Y', 'Пью'),
        ('N', 'Не пью'),
    ]
    
    SMOKING_CHOICES = [
        ('Y', 'Курю'),
        ('N', 'Не курю'),
    ]
    
    LANGUAGE_CHOICES = [
        ('E', 'English'),
        ('S', 'Spanish'),
        ('C', 'Chinese'),
        ('F', 'French'),
        ('G', 'German'),
        ('R', 'Russian'),
        ('J', 'Japanese'),
        ('I', 'Italian'),
        ('P', 'Portuguese'),
        ('A', 'Arabic'),
        ('K', 'Korean'),
        ('H', 'Hindi'),
        ('D', 'Dutch'),
        ('W', 'Swedish'),
        ('T', 'Turkish'),
        ('Gr', 'Greek'),  
    ]
    
    ZODIAC_CHOICES = [
        ('Ari', 'Овен'),
        ('Tau', 'Телец'),
        ('Gem', 'Близнецы'),
        ('Can', 'Рак'),
        ('Leo', 'Лев'),
        ('Vir', 'Дева'),
        ('Lib', 'Весы'),
        ('Sco', 'Скорпион'),
        ('Sag', 'Стрелец'),
        ('Cap', 'Козерог'),
        ('Aqu', 'Водолей'),
        ('Pis', 'Рыбы'),
    ]
    
    name = models.CharField(max_length=32, null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    bidth = models.DateField(null=True, blank=True)
    gallery = models.ForeignKey(Gallery, on_delete=models.CASCADE, null=True, blank=True)
    phone_number = models.CharField(max_length=123, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    first_name = models.CharField(max_length=150, null=True, blank=True)
    last_name = models.CharField(max_length=150, null=True, blank=True)
    gender = models.CharField(max_length=1, choices=CHOICES, default='A')
    interest_gender = models.CharField(max_length=1, choices=CHOICES, default='A')
    city = models.CharField(max_length=32, null=True, blank=True)
    about = models.TextField(null=True, blank=True)
    work = models.TextField(null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    goal = models.CharField(max_length=1, choices=GOAL_CHOICES, null=True, blank=True)
    # interests = models.CharField(max_length=32, choices=INTERESTS_CHOICES, null=True, blank=True)
    orientation = models.CharField(max_length=32, choices=ORIENTATION_CHOICES, null=True, blank=True)
    relationship = models.CharField(max_length=32, choices=RELATIONSHIP_CHOICES, null=True, blank=True)
    childrens = models.CharField(max_length=32, choices=CHILDRENS_CHOICES, null=True, blank=True)
    languages = models.CharField(max_length=32, choices=LANGUAGE_CHOICES, null=True, blank=True)
    personality = models.CharField(max_length=32, choices=PERSONALITY_CHOICES, null=True, blank=True)
    zodiac = models.CharField(max_length=32, choices=ZODIAC_CHOICES, null=True, blank=True)
    education = models.CharField(max_length=32, choices=EDUCATION_CHOICES, null=True, blank=True)
    alcohol = models.CharField(max_length=32, choices=SMOKING_ALCO, null=True, blank=True)
    smoking = models.CharField(max_length=32, choices=SMOKING_CHOICES, null=True, blank=True)
    code = models.IntegerField(null=True, blank=True)
    theme = models.BooleanField(null=True, blank=True, default=False)
    

class UserInterest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.TextField(null=True, blank=True)


class UserFilters(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    gender = models.CharField(max_length=32,default='A')
    min_age = models.IntegerField(default=18)
    max_age = models.IntegerField(default=60)
    city = models.CharField(max_length=32)