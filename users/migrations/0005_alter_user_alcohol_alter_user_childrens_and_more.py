# Generated by Django 4.1.7 on 2024-08-16 14:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_user_theme'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='alcohol',
            field=models.CharField(blank=True, choices=[('Y', 'Пью'), ('N', 'Не пью')], max_length=32, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='childrens',
            field=models.CharField(blank=True, choices=[('Y', 'Есть'), ('N', 'Нету')], max_length=32, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='gender',
            field=models.CharField(choices=[('F', 'Женский'), ('M', 'Мужской'), ('A', 'All')], default='A', max_length=1),
        ),
        migrations.AlterField(
            model_name='user',
            name='goal',
            field=models.CharField(blank=True, choices=[('L', 'Любовь'), ('R', 'Романтика'), ('O', 'Общение')], max_length=1, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='interest_gender',
            field=models.CharField(choices=[('F', 'Женский'), ('M', 'Мужской'), ('A', 'All')], default='A', max_length=1),
        ),
        migrations.AlterField(
            model_name='user',
            name='relationship',
            field=models.CharField(blank=True, choices=[('Y', 'В отношениях'), ('N', 'Не в отношениях'), ('S', 'В свободных отношениях')], max_length=32, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='smoking',
            field=models.CharField(blank=True, choices=[('Y', 'Курю'), ('N', 'Не курю')], max_length=32, null=True),
        ),
    ]
