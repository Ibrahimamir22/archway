from rest_framework import serializers
from .models import Project, ProjectCategory, Tag, ProjectImage

class TagSerializer(serializers.ModelSerializer):
    """Serializer for project tags"""
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']

class CategorySerializer(serializers.ModelSerializer):
    """Serializer for project categories"""
    class Meta:
        model = ProjectCategory
        fields = ['id', 'name', 'slug', 'description']

class ProjectImageSerializer(serializers.ModelSerializer):
    """Serializer for project images"""
    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'alt_text', 'is_cover', 'order']

class ProjectListSerializer(serializers.ModelSerializer):
    """Serializer for listing projects"""
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'description', 'category',
            'location', 'area', 'completed_date', 'is_featured',
            'created_at', 'tags', 'cover_image'
        ]
    
    def get_cover_image(self, obj):
        cover_image = obj.images.filter(is_cover=True).first()
        if cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(cover_image.image.url)
            return cover_image.image.url
        return None

class ProjectDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for a single project"""
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'description', 'category',
            'client', 'location', 'area', 'completed_date', 
            'is_featured', 'created_at', 'updated_at',
            'tags', 'images'
        ]

class LocalizedTagSerializer(serializers.ModelSerializer):
    """Tag serializer with localization support"""
    name = serializers.SerializerMethodField()
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']
    
    def get_name(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'name_{language}') if getattr(obj, f'name_{language}') else obj.name_en

class LocalizedCategorySerializer(serializers.ModelSerializer):
    """Category serializer with localization support"""
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    
    class Meta:
        model = ProjectCategory
        fields = ['id', 'name', 'slug', 'description']
    
    def get_name(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'name_{language}') if getattr(obj, f'name_{language}') else obj.name_en
    
    def get_description(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'description_{language}') if getattr(obj, f'description_{language}') else obj.description_en

class LocalizedProjectImageSerializer(serializers.ModelSerializer):
    """Project image serializer with localization support"""
    alt_text = serializers.SerializerMethodField()
    
    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'alt_text', 'is_cover', 'order']
    
    def get_alt_text(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'alt_text_{language}') if getattr(obj, f'alt_text_{language}') else obj.alt_text_en

class LocalizedProjectListSerializer(serializers.ModelSerializer):
    """Project list serializer with localization support"""
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    category = LocalizedCategorySerializer(read_only=True)
    tags = LocalizedTagSerializer(many=True, read_only=True)
    cover_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'description', 'category',
            'location', 'area', 'completed_date', 'is_featured',
            'created_at', 'tags', 'cover_image'
        ]
    
    def get_title(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'title_{language}') if getattr(obj, f'title_{language}') else obj.title_en
    
    def get_description(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'description_{language}') if getattr(obj, f'description_{language}') else obj.description_en
    
    def get_location(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'location_{language}') if getattr(obj, f'location_{language}') else obj.location_en
    
    def get_cover_image(self, obj):
        cover_image = obj.images.filter(is_cover=True).first()
        if cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(cover_image.image.url)
            return cover_image.image.url
        return None

class LocalizedProjectDetailSerializer(serializers.ModelSerializer):
    """Detailed project serializer with localization support"""
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    category = LocalizedCategorySerializer(read_only=True)
    tags = LocalizedTagSerializer(many=True, read_only=True)
    images = LocalizedProjectImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'description', 'category',
            'client', 'location', 'area', 'completed_date', 
            'is_featured', 'created_at', 'updated_at',
            'tags', 'images'
        ]
    
    def get_title(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'title_{language}') if getattr(obj, f'title_{language}') else obj.title_en
    
    def get_description(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'description_{language}') if getattr(obj, f'description_{language}') else obj.description_en
    
    def get_location(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'location_{language}') if getattr(obj, f'location_{language}') else obj.location_en 