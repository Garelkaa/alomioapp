from django.db import models
from django.contrib.auth.models import AbstractUser

from gallery.models import Gallery

class User(AbstractUser):
    CHOICES = [
        ('F', 'Female'),
        ('M', 'Male'),
        ('A', 'All'),
    ]
    
    GOAL_CHOICES = [
        ('L', 'Love'),
        ('R', 'Romantice'),
        ('O', 'Obzhenie'),
    ]
    
    CHILDRENS_CHOICES = [
        ('Y', 'Yes'),
        ('N', 'No')
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
        ('Y', 'Yes'),
        ('N', 'No'),
        ('S', 'Soso')
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
    
    SMOKING_CHOICES = [
        ('Y', 'Yes'),
        ('N', 'No'),
    ]
    
    name = models.CharField(max_length=32, null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    bidth = models.DateField(null=True, blank=True)
    # Ensure to add the correct related model for gallery_id
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
    # Uncomment and modify these fields as necessary
    goal = models.CharField(max_length=1, choices=GOAL_CHOICES, null=True, blank=True)
    # interests = models.CharField(max_length=32, choices=INTERESTS_CHOICES, null=True, blank=True)
    orientation = models.CharField(max_length=32, choices=ORIENTATION_CHOICES, null=True, blank=True)
    relationship = models.CharField(max_length=32, choices=RELATIONSHIP_CHOICES, null=True, blank=True)
    childrens = models.CharField(max_length=32, choices=CHILDRENS_CHOICES, null=True, blank=True)
    # languages = models.CharField(max_length=32, choices=LANGUAGES_CHOICES, null=True, blank=True)
    personality = models.CharField(max_length=32, choices=PERSONALITY_CHOICES, null=True, blank=True)
    # zodiac = models.CharField(max_length=32, choices=ZODIAC_CHOICES, null=True, blank=True)
    education = models.CharField(max_length=32, choices=EDUCATION_CHOICES, null=True, blank=True)
    alcohol = models.CharField(max_length=32, choices=SMOKING_CHOICES, null=True, blank=True)
    smoking = models.CharField(max_length=32, choices=SMOKING_CHOICES, null=True, blank=True)
    code = models.IntegerField(null=True, blank=True)
