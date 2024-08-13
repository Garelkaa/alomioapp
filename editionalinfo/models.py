from django.db import models


class Interests(models.Model):
    name = models.CharField(max_length=255)


class Orientation(models.Model):
    name = models.CharField(max_length=255)
    

class Relationship(models.Model):
    name = models.CharField(max_length=255)
    

class Zodias(models.Model):
    name = models.CharField(max_length=255)
    

