from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from .models import Country, ClueCategory, Clue, User
import re

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name']
        read_only_fields = ['id']
        ordering = ['id']

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance

class ClueCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ClueCategory
        fields = ['id', 'name']
        read_only_fields = ['id']

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance

class ClueSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    category = ClueCategorySerializer(read_only=True)
    submitted_by = serializers.SerializerMethodField()

    class Meta:
        model = Clue
        fields = ['id', 'country', 'category', 'text', 'status', 'submitted_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'country', 'category', 'status', 'submitted_by', 'created_at', 'updated_at']

    def get_submitted_by(self, obj):
        return obj.submitted_by.username if obj.submitted_by else None

    def update(self, instance, validated_data):
        instance.text = validated_data.get('text', instance.text)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance
    

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'confirm_password']

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_password(self, value):
        errors = []
        if len(value) < 8:
            errors.append("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', value):
            errors.append("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', value):
            errors.append("Password must contain at least one lowercase letter.")
        if not re.search(r'\d', value):
            errors.append("Password must contain at least one digit.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            errors.append("Password must contain at least one special character.")
        
        if errors:
            raise serializers.ValidationError(errors)
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User(
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    

class ClueSubmissionSerializer(serializers.ModelSerializer):
    country = serializers.PrimaryKeyRelatedField(queryset=Country.objects.all())
    category = serializers.PrimaryKeyRelatedField(queryset=ClueCategory.objects.all())

    class Meta:
        model = Clue
        fields = ['country', 'category', 'text']

    def validate_text(self, value):
        if not (100 <= len(value) <= 400):
            raise serializers.ValidationError('Clue text must be between 100 and 400 characters.')
        if not value[0].isupper():
            raise serializers.ValidationError('Clue text must start with a capital letter.')
        if value[-1] not in ['.', '?', '!']:
            raise serializers.ValidationError('Clue text must end with a punctuation mark (., ?, or !).')
        return value

    def validate(self, data):
        # Here we could add any cross-field validations if needed
        # For example, we might want to check if the user has submitted too many clues for this country/category recently
        return data

    def create(self, validated_data):
        validated_data['status'] = 'pending'
        validated_data['submitted_by'] = self.context['request'].user
        return super().create(validated_data)