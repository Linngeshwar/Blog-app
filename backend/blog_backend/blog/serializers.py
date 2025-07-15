from rest_framework import serializers
from .models import BlogPost,Tag,Upvote,Downvote,Comment
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class BlogSerializer(serializers.ModelSerializer):
    upvoted = serializers.SerializerMethodField()
    downvoted = serializers.SerializerMethodField()
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = BlogPost
        fields = ["id", "content", "title", "created_at", "author", "author_username", "tags", "upvotes", "downvotes", "upvoted", "downvoted", "comments"]
        extra_kwargs = {
            "upvotes": {"read_only": True},
            "downvotes": {"read_only": True},
            "upvoted": {"read_only": True},
            "downvoted": {"read_only": True},
            "author": {"write_only": True},
        }
        depth = 1

    def get_upvoted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Upvote.objects.filter(post=obj, user=request.user).exists()
        return False

    def get_downvoted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Downvote.objects.filter(post=obj, user=request.user).exists()
        return False
        
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["name","id"]
        
class CommentSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Comment
        fields = ["id", "content", "created_at", "post", "user", "user_username"]
        extra_kwargs = {
            "user": {"write_only": True},
        }
        
        
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self,attrs):
        data = super().validate(attrs)
        data["username"] = self.user.username
        return data
        
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
        
class UpvoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Upvote
        fields = "__all__"
        
class DownvoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Downvote
        fields = "__all__"


