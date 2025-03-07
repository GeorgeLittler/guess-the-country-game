from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.core.cache import cache
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

class UserManager(BaseUserManager):
    def active_users(self):
        return self.filter(is_active=True)

    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, password, **extra_fields)

    def get_by_natural_key(self, username):
        return self.get(username=username)

class User(AbstractUser):
    clues_seen = models.ManyToManyField('Clue', related_name='seen_by_users', blank=True,
                                        help_text=_("Clues that have been seen by this user."))
    
    objects = UserManager()

    class Meta:
        indexes = [
            models.Index(fields=['username']),
        ]

class CountryManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().order_by('name')

    def get_countries_list(self):
        countries_list = cache.get('countries_list')
        if not countries_list:
            countries_list = list(self.values_list('name', flat=True))
            cache.set('countries_list', countries_list, 60 * 60 * 12)  # Cache for 15 minutes
        return countries_list

class Country(models.Model):
    name = models.CharField(max_length=100, unique=True, blank=False, help_text=_("The name of the country."))

    objects = CountryManager()

    class Meta:
        verbose_name_plural = "Countries"
        indexes = [
            models.Index(fields=['name']),
        ]

    def __str__(self):
        return self.name

@receiver(post_save, sender=Country)
@receiver(post_delete, sender=Country)
def clear_country_cache(sender, **kwargs):
    cache.delete('countries_list')

class ClueCategoryManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().order_by('name')

    def get_clue_categories_list(self):
        clue_categories_list = cache.get('clue_categories_list')
        if not clue_categories_list:
            clue_categories_list = list(self.values_list('name', flat=True))
            cache.set('clue_categories_list', clue_categories_list, 60 * 60 * 12)  # Cache for 15 minutes
        return clue_categories_list

class ClueCategory(models.Model):
    name = models.CharField(max_length=100, unique=True, blank=False, help_text=_("The name of the clue category."))

    objects = ClueCategoryManager()

    class Meta:
        verbose_name_plural = "Clue Categories"
        indexes = [
            models.Index(fields=['name']),
        ]

    def __str__(self):
        return self.name

@receiver(post_save, sender=ClueCategory)
@receiver(post_delete, sender=ClueCategory)
def clear_clue_category_cache(sender, **kwargs):
    cache.delete('clue_categories_list')

class ClueManager(models.Manager):
    def approved(self):
        return self.filter(status='approved')

    def pending(self):
        return self.filter(status='pending')

    def get_approved_clues(self, country, category):
        cache_key = f"approved_clues_{country.id}_{category.id}"
        clues = cache.get(cache_key)
        if not clues:
            clues = list(self.approved().filter(country=country, category=category))
            cache.set(cache_key, clues, 60 * 15)  # Cache for 15 minutes
        return clues

class Clue(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    country = models.ForeignKey(
        Country,
        on_delete=models.CASCADE,
        related_name='clues',
        help_text=_("The country this clue is about.")
    )
    category = models.ForeignKey(
        ClueCategory,
        on_delete=models.CASCADE,
        related_name='clues',
        help_text=_("The category this clue belongs to.")
    )
    text = models.TextField(
        help_text=_("The text of the clue. Should be between 100 and 400 characters.")
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending',
        help_text=_("The current status of the clue.")
    )
    submitted_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='submitted_clues',
        help_text=_("The user who submitted this clue.")
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text=_("The date and time when this clue was created.")
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text=_("The date and time when this clue was last updated.")
    )

    objects = ClueManager()

    class Meta:
        verbose_name_plural = "Clues"
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['country', 'category']),
            models.Index(fields=['submitted_by']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.country.name} - {self.category.name}: {self.text[:50]}..."

@receiver(post_save, sender=Clue)
@receiver(post_delete, sender=Clue)
def clear_clue_cache(sender, instance, **kwargs):
    if instance.status == 'approved':
        cache_key = f"approved_clues_{instance.country.id}_{instance.category.id}"
        cache.delete(cache_key)
