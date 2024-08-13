from django import template
import datetime

register = template.Library()

@register.filter(name='custom_date')
def custom_date(value):
    if isinstance(value, datetime.date):
        return value.strftime('%d.%m.%Y')
    return value
