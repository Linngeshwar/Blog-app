from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action
from rest_framework import generics
from .models import BlogPost,Tag,Upvote,Downvote,Comment
from .serializers import BlogSerializer,UserRegistrationSerializer,UserDetailSerializer,CustomTokenObtainPairSerializer,TagSerializer,CommentSerializer
from .serializers import UpvoteSerializer,DownvoteSerializer
from django.contrib.auth.models import User
from .permissions import IsAuthor
from rest_framework.permissions import AllowAny
from django.db.models import Count, Prefetch
# Create your views here.\
    
class UpvoteViewSet(ModelViewSet):
    serializer_class = UpvoteSerializer
    queryset = Upvote.objects.select_related('user', 'post')
    
    def list(self,request):
        queryset = Upvote.objects.select_related('user', 'post').filter(
            user=request.user, 
            post=request.data.get("post")
        )
        serializer = UpvoteSerializer(queryset,many=True)
        return Response(serializer.data,status=200)
    
    def create(self,request):
        serializer = UpvoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=201)
        return Response(serializer.errors,status=400)
    
    # @action(detail=False, methods=['delete'])
    # def delete_upvote(self, request):
    #     post_id = request.data.get("post")
    #     user = request.data.get("user")
        
    #     try:
    #         upvote = Upvote.objects.get(user=user, post_id=post_id)
    #         upvote.delete()
    #         return Response("Upvote deleted", status=204)
    #     except Upvote.DoesNotExist:
    #         return Response({"error": "Upvote not found"}, status=404)
        
    @action(detail=False, methods=['post'])
    def del_upvote(self, request, *args, **kwargs):
        queryset = Upvote.objects.select_related('user', 'post').filter(
            user=request.user, 
            post=request.data.get("post")
        )
        try:
            upvote = queryset.get()
            upvote.delete()
            return Response("Upvote deleted", status=204)
        except Upvote.DoesNotExist:
            return Response({"error": "Upvote not found"}, status=404)

class DownvoteViewSet(ModelViewSet):
    serializer_class = DownvoteSerializer
    queryset = Downvote.objects.select_related('user', 'post')
    
    def list(self,request):
        queryset = Downvote.objects.select_related('user', 'post').all()
        serializer = DownvoteSerializer(queryset,many=True)
        return Response(serializer.data,status=200)
    
    def create(self,request):
        serializer = DownvoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=201)
        return Response(serializer.errors,status=400)
    
    # @action(detail=False, methods=['delete'])
    # def delete_downvote(self, request):
    #     post_id = request.data.get("post")
    #     user = request.data.get("user")
        
    #     try:
    #         downvote = Downvote.objects.get(user=user, post_id=post_id)
    #         downvote.delete()
    #         return Response("Downvote deleted", status=204)
    #     except Downvote.DoesNotExist:
    #         return Response({"error": "Downvote not found"}, status=404)
    
    @action(detail=False, methods=['post'])
    def del_downvote(self,request):
        queryset = Downvote.objects.select_related('user', 'post').filter(
            user=request.user,
            post=request.data.get("post")
        )
        try:
            downvote = queryset.get()
            downvote.delete()
            return Response("Downvote deleted",status=204)
        except Downvote.DoesNotExist:
            return Response({"error":"Downvote not found"},status=404)

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = CustomTokenObtainPairSerializer

class UserRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = UserRegistrationSerializer
    
class TagViewSet(ModelViewSet):
    serializer_class = TagSerializer
    queryset = Tag.objects.all()
    
    def list(self,request):
        queryset = Tag.objects.all()
        serializer = TagSerializer(queryset,many=True)
        return Response(serializer.data,status=200)
    
class CommentViewSet(ModelViewSet):
    serializer_class = CommentSerializer
    queryset = Comment.objects.select_related('user', 'post').all()
    
    def list(self, request):
        queryset = self.get_queryset()
        serializer = CommentSerializer(queryset, many=True)
        return Response(serializer.data, status=200)
    
    def create(self, request):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            # The user field is now a ForeignKey, so we can save directly
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def update(self, request, pk=None):
        try:
            comment = self.get_queryset().get(pk=pk)
        except Comment.DoesNotExist:
            return Response({"error": "Comment not found"}, status=404)
        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    
    def destroy(self, request, pk=None):
        try:
            comment = self.get_queryset().get(pk=pk)
            comment.delete()
            return Response("Comment deleted", status=204)
        except Comment.DoesNotExist:
            return Response({"error": "Comment not found"}, status=404)

class UserDetailView(ModelViewSet):
    queryset = User.objects.prefetch_related('blog_posts', 'comments', 'upvotes', 'downvotes')
    serializer_class = UserDetailSerializer
    
    def list(self,request,pk=None):
        queryset = User.objects.prefetch_related('blog_posts', 'comments', 'upvotes', 'downvotes').get(pk=pk)
        serializer = UserDetailSerializer(queryset)
        return Response(serializer.data,status=200)

class BlogPostViewSet(ModelViewSet):
    queryset = BlogPost.objects.select_related('author').prefetch_related(
        'tags', 
        'comments__user',
        Prefetch('upvotes', queryset=Upvote.objects.select_related('user')),
        Prefetch('downvotes', queryset=Downvote.objects.select_related('user'))
    ).annotate(
        upvotes_count=Count('upvotes', distinct=True),
        downvotes_count=Count('downvotes', distinct=True),
        comments_count=Count('comments', distinct=True)
    )
    serializer_class = BlogSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = BlogSerializer(queryset, many=True, context={"request": request})
        # Add counts from annotations - no more N+1 queries!
        for i, post in enumerate(queryset):
            serializer.data[i]["upvotes"] = post.upvotes_count
            serializer.data[i]["downvotes"] = post.downvotes_count
            serializer.data[i]["comments"] = post.comments_count
        return Response(serializer.data, status=200)
    
    def create(self, request):
        tags = request.data["tags"].split()
        tag_objects = [Tag.objects.get_or_create(name=tag)[0] for tag in tags]
        serializer = BlogSerializer(data=request.data)
        if serializer.is_valid():
            # Use the author from request data directly since it's now a ForeignKey
            serializer.save(tags=tag_objects)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def update(self, request, pk=None):
        tags = request.data["tags"].split()
        tag_objects = [Tag.objects.get_or_create(name=tag)[0] for tag in tags]
        try:
            post = self.get_queryset().get(pk=pk)
        except BlogPost.DoesNotExist:
            return Response({"error": "Post not found"}, status=404)
        serializer = BlogSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save(tags=tag_objects)
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    
    def destroy(self, request, pk=None):
        try:
            post = self.get_queryset().get(pk=pk)
            post.delete()
            return Response("Post deleted", status=204)
        except BlogPost.DoesNotExist:
            return Response({"error": "Post not found"}, status=404)
    
    @action(detail=True, methods=['get'])
    def user_posts(self, request, pk=None):
        try:
            author = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "Author not found"}, status=404)
        
        posts = BlogPost.objects.filter(author=author).select_related('author').prefetch_related(
            'tags', 
            'comments__user'
        ).annotate(
            upvotes_count=Count('upvotes', distinct=True),
            downvotes_count=Count('downvotes', distinct=True),
            comments_count=Count('comments', distinct=True)
        )
        serializer = BlogSerializer(posts, many=True, context={"request": request})
        # Add counts from annotations - no more N+1 queries!
        for i, post in enumerate(posts):
            serializer.data[i]["upvotes"] = post.upvotes_count
            serializer.data[i]["downvotes"] = post.downvotes_count
        return Response(serializer.data, status=200)
    
    @action(detail=True, methods=['get'])
    def get_post(self, request, pk=None):
        try:
            post = BlogPost.objects.select_related('author').prefetch_related(
                'tags', 
                'comments__user'
            ).annotate(
                upvotes_count=Count('upvotes', distinct=True),
                downvotes_count=Count('downvotes', distinct=True),
                comments_count=Count('comments', distinct=True)
            ).get(pk=pk)
        except BlogPost.DoesNotExist:
            return Response({"error": "Post not found"}, status=404)
        serializer = BlogSerializer(post, context={"request": request})
        data = serializer.data
        data["upvotes"] = post.upvotes_count
        data["downvotes"] = post.downvotes_count
        data["comments"] = post.comments_count
        print(data["upvotes"])
        return Response(data, status=200)
    
