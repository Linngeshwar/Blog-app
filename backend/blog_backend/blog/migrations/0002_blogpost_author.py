# Generated by Django 5.1.4 on 2024-12-12 09:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='blogpost',
            name='author',
            field=models.CharField(default='sekiro pro', max_length=100),
            preserve_default=False,
        ),
    ]
