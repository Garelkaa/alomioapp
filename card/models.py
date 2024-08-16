from django.db import models
from users.models import User

class Likes(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='Лайкает')
    liked_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='Лайкнутый')
    mutually = models.BooleanField(blank=True, null=True)
