# Generated by Django 5.2 on 2025-04-10 13:36

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name_en', models.CharField(max_length=50)),
                ('name_ar', models.CharField(blank=True, max_length=50)),
                ('slug', models.SlugField(max_length=70, unique=True)),
            ],
            options={
                'ordering': ['name_en'],
            },
        ),
        migrations.CreateModel(
            name='ProjectCategory',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name_en', models.CharField(max_length=100)),
                ('name_ar', models.CharField(blank=True, max_length=100)),
                ('slug', models.SlugField(max_length=120, unique=True)),
                ('description_en', models.TextField(blank=True)),
                ('description_ar', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='children', to='projects.projectcategory')),
            ],
            options={
                'verbose_name': 'Project Category',
                'verbose_name_plural': 'Project Categories',
                'ordering': ['name_en'],
            },
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title_en', models.CharField(max_length=200)),
                ('title_ar', models.CharField(blank=True, max_length=200)),
                ('slug', models.SlugField(max_length=250, unique=True)),
                ('description_en', models.TextField()),
                ('description_ar', models.TextField(blank=True)),
                ('client', models.CharField(blank=True, max_length=100)),
                ('location_en', models.CharField(blank=True, max_length=200)),
                ('location_ar', models.CharField(blank=True, max_length=200)),
                ('area', models.FloatField(blank=True, help_text='Area in square meters', null=True)),
                ('completed_date', models.DateField(blank=True, null=True)),
                ('is_featured', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='projects', to='projects.projectcategory')),
                ('tags', models.ManyToManyField(blank=True, related_name='projects', to='projects.tag')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='ProjectImage',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('image', models.ImageField(upload_to='projects/%Y/%m/')),
                ('alt_text_en', models.CharField(blank=True, max_length=200)),
                ('alt_text_ar', models.CharField(blank=True, max_length=200)),
                ('is_cover', models.BooleanField(default=False)),
                ('order', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='projects.project')),
            ],
            options={
                'ordering': ['order'],
            },
        ),
    ]
