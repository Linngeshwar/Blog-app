from rest_framework import serializers
from .models import BlogPost
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ["id","content","title","created_at"]
        
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    password = serializers.CharField(write_only=True)
    
    def validate(self,attrs):
        if not User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username":"User Does not exist"})
        return super().validate(attrs)
        
class UserRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100)
    password = serializers.CharField(max_length=100,write_only=True)
    email = serializers.EmailField()
    
    def validate(self,attrs):
        if User.objects.filter(username=attrs["username"]).exists():
            raise serializers.ValidationError({"username":"Username already exists"})
        if User.objects.filter(email=attrs["email"]).exists():
            raise serializers.ValidationError({"email":"Email already exists"})
        return attrs
    
    
    def create(self,validated_data):
        user = User.objects.create_user(validated_data["username"],validated_data["email"],validated_data["password"])
        return user
    
class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","username","email"]

