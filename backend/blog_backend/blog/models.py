from django.db import models

# Create your models here.

class Tag(models.Model):
    name = models.CharField(max_length=50)
    
    def __str__(self):
        return self.name
    
class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.CharField(max_length=100, default="Anonymous")
    tags = models.ManyToManyField(Tag)
    
    def __str__(self):
        all_details = """
        Title: {}
        Content: {}
        Author: {}
        """.format(self.title,self.content,self.author)
        return all_details
    
class Comment(models.Model):
    post = models.ForeignKey(BlogPost,on_delete=models.CASCADE,related_name="comments")
    name = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
class Upvote(models.Model):
    post = models.ForeignKey(BlogPost,on_delete=models.CASCADE,related_name="upvotes")
    user = models.CharField()
    
    def __str__(self):
        string = f'''{self.user} upvoted {self.post}'''
        return string
    
class Downvote(models.Model):
    post = models.ForeignKey(BlogPost,on_delete=models.CASCADE,related_name="downvotes")
    user = models.CharField()
    
    def __str__(self):
        string = f'''{self.user} upvoted {self.post}'''
        return string
    