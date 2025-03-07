from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CountryViewSet, ClueCategoryViewSet, register, login, submit_clue

router = DefaultRouter()
router.register(r'countries', CountryViewSet)
router.register(r'clue-categories', ClueCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('submit-clue/', submit_clue, name='submit-clue'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
