from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Tag(models.Model):
    name = models.CharField(max_length=50)
    
    def __str__(self):
        return self.name
    
class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="blog_posts")  # Renamed from author_user
    tags = models.ManyToManyField(Tag, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['author']),
        ]
    
    def __str__(self):
        return f"{self.title} by {self.author.username}"
    
class Comment(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")  # Renamed from user_fk
    
    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['post', '-created_at']),
            models.Index(fields=['user']),
        ]
    
    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.title}"
    
    
class Upvote(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name="upvotes")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="upvotes")  # Renamed from user_fk
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = [('post', 'user')]
        indexes = [
            models.Index(fields=['post']),
            models.Index(fields=['user']),
        ]
    
    def __str__(self):
        return f'{self.user.username} upvoted {self.post.title}'
    
class Downvote(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name="downvotes")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="downvotes")  # Renamed from user_fk
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = [('post', 'user')]
        indexes = [
            models.Index(fields=['post']),
            models.Index(fields=['user']),
        ]
    
    def __str__(self):
        return f'{self.user.username} downvoted {self.post.title}'
    
    
