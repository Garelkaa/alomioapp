from django.db import models


class Gallery(models.Model):
    title = models.CharField(max_length=255, null=True, blank=True)


class GalleryImage(models.Model):
    image = models.ImageField()
    gallery = models.ForeignKey(Gallery, on_delete=models.CASCADE, related_name='images')
    
