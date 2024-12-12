from django.db import models

# Create your models here.

class Tag(models.Model):
    name = models.CharField(max_length=50)
    
class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField(Tag)
    
class Comment(models.Model):
    post = models.ForeignKey(BlogPost,on_delete=models.CASCADE,related_name="comments")
    name = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    