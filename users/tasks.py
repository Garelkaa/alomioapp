from celery import shared_task
from django.core.mail import send_mail


@shared_task
def send_verification_email(email, code):
    subject = 'Ваш код подтверждения'
    message = f'Ваш код подтверждения: {code}'
    from_email = 'beshenlyteam@gmail.com'
    
    send_mail(subject, message, from_email, [email], fail_silently=False,)
