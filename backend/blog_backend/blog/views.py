from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from .models import BlogPost
from .serializers import BlogSerializer,UserRegistrationSerializer,UserDetailSerializer,CustomTokenObtainPairSerializer
from django.contrib.auth.models import User
from .permissions import IsAuthor
# Create your views here.

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    
class UserDetailView(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    
    def list(self,request):
        queryset = User.objects.all()
        serializer = UserDetailSerializer(queryset,many=True)
        return Response(serializer.data,status=200)

class BlogPostViewSet(ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogSerializer

    def list(self,request):
        queryset = BlogPost.objects.all()
        serializer = BlogSerializer(queryset,many=True)
        return Response(serializer.data,status=200)
    
    def create(self,request):
        serializer = BlogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=201)
        return Response(serializer.errors,status=400)
    
    def update(self,request,pk=None):
        try:
            queryset = BlogPost.objects.all()
            post = queryset.get(pk=pk)
        except BlogPost.DoesNotExist:
            return Response({"error":"Post not found"},status=404)
        serializer = BlogSerializer(post,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=200)
        return Response(serializer.errors,status=400)
    
    def destroy(self,request,pk=None):
        queryset = BlogPost.objects.all()
        post = queryset.get(pk=pk)
        post.delete()
        return Response("Post deleted",status=204)
    