from random import choice
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model, authenticate
from rest_framework.authtoken.models import Token
from .models import Country, ClueCategory, Clue
from .serializers import CountrySerializer, ClueCategorySerializer, ClueSerializer, UserSerializer, ClueSubmissionSerializer

User = get_user_model()

class RegisterRateThrottle(UserRateThrottle):
    rate = '20/hour'

class LoginRateThrottle(UserRateThrottle):
    rate = '10/hour'

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([AnonRateThrottle, RegisterRateThrottle])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([AnonRateThrottle, LoginRateThrottle])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        })
    return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        countries = Country.objects.get_countries_list()
        return Response(countries)

    @action(detail=False, methods=['get'])
    def random(self, request):
        random_country = choice(self.queryset)
        serializer = self.get_serializer(random_country)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def get_clue(self, request, pk=None):
        country = self.get_object()
        category_name = request.query_params.get('category', None)
        
        if not category_name:
            return Response({"error": "Category parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            category = ClueCategory.objects.get(name=category_name)
        except ClueCategory.DoesNotExist:
            return Response({"error": "Invalid category."}, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user

        approved_clues = Clue.objects.get_approved_clues(country, category)
        unseen_clues = [clue for clue in approved_clues if clue not in user.clues_seen.all()]

        if unseen_clues:
            clue = choice(unseen_clues)
        else:
            user.clues_seen.remove(*approved_clues)
            clue = choice(approved_clues)
        
        user.clues_seen.add(clue)
        
        serializer = ClueSerializer(clue)
        return Response(serializer.data)

class ClueCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ClueCategory.objects.all()
    serializer_class = ClueCategorySerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        categories = ClueCategory.objects.get_clue_categories_list()
        return Response(categories)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_clue(request):
    user = request.user
    today = timezone.now().date()
    clues_today = Clue.objects.filter(submitted_by=user, created_at__date=today).count()
    
    if clues_today >= 5:
        return Response({'error': 'You can only submit 5 clues per day.'}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = ClueSubmissionSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        clue = serializer.save()
        return Response(ClueSerializer(clue).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
