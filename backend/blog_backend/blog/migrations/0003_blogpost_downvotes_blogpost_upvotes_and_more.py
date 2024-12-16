# Generated by Django 5.1.4 on 2024-12-12 09:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_blogpost_author'),
    ]

    operations = [
        migrations.AddField(
            model_name='blogpost',
            name='downvotes',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='blogpost',
            name='upvotes',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='blogpost',
            name='author',
            field=models.CharField(default=models.F('username'), max_length=100),
        ),
    ]