# Generated by Django 5.1.4 on 2024-12-16 10:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0004_remove_blogpost_downvotes_remove_blogpost_upvotes_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='downvote',
            name='user',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='upvote',
            name='user',
            field=models.IntegerField(),
        ),
    ]