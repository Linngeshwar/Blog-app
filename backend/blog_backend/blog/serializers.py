from rest_framework import serializers
from .models import BlogPost,Tag,Upvote,Downvote,Comment
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class BlogSerializer(serializers.ModelSerializer):
    upvoted = serializers.SerializerMethodField()
    downvoted = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = ["id", "content", "title", "created_at", "author", "tags", "upvotes", "downvotes", "upvoted", "downvoted", "comments"]
        extra_kwargs = {
            "upvotes": {"read_only": True},
            "downvotes": {"read_only": True},
            "upvoted": {"read_only": True},
            "downvoted": {"read_only": True},
        }
        depth = 1

    def get_upvoted(self, obj):
        request = self.context.get('request')
        bool = False
        # print(request.user)
        if request and request.user.is_authenticated:
            bool = Upvote.objects.filter(post=obj, user=request.user).exists()
            # print(Upvote.objects.filter(post=obj, user=request.user))
        return bool

    
    def get_downvoted(self, obj):
        request = self.context.get('request')
        bool = False
        # print(request.user)
        if request and request.user.is_authenticated:
            bool = Downvote.objects.filter(post=obj, user=request.user).exists()
            # print(Downvote.objects.filter(post=obj, user=request.user))
        return bool
        
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["name","id"]
        
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"
        
        
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


