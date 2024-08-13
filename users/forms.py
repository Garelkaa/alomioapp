from django import forms
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator

from users.models import User


class UsersForm(forms.ModelForm):
    email_or_phone = forms.CharField(
        max_length=255,
        required=True,
        label='Email или номер телефона'
    )
    
    class Meta:
        model = User
        fields = ('email', 'phone_number', 'password')

    def clean_email_or_phone(self):
        data = self.cleaned_data['email_or_phone']
        if '@' in data:
            EmailValidator()(data)
        return data