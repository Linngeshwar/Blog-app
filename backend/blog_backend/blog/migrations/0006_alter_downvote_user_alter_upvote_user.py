# Generated by Django 5.1.4 on 2024-12-17 04:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0005_alter_downvote_user_alter_upvote_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='downvote',
            name='user',
            field=models.CharField(),
        ),
        migrations.AlterField(
            model_name='upvote',
            name='user',
            field=models.CharField(),
        ),
    ]