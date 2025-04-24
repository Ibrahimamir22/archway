from rest_framework import serializers
from .models import FAQ, FAQCategory


class FAQCategorySerializer(serializers.ModelSerializer):
    """Serializer for FAQ Categories"""
    name = serializers.SerializerMethodField()
    
    class Meta:
        model = FAQCategory
        fields = ['id', 'name', 'slug', 'order', 'is_active']
    
    def get_name(self, obj):
        # Set language for the object based on context
        lang = self.context.get('language', None)
        if lang:
            obj._current_language = lang
        return obj.name


class FAQSerializer(serializers.ModelSerializer):
    """Serializer for FAQ items"""
    category = FAQCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=FAQCategory.objects.all(),
        source='category',
        write_only=True
    )
    
    class Meta:
        model = FAQ
        fields = [
            'id', 
            'question', 
            'answer', 
            'language', 
            'category',
            'category_id',
            'order', 
            'is_active'
        ]


class FAQListSerializer(serializers.ModelSerializer):
    """Simplified serializer for FAQ items in list views"""
    
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'order']


class FAQLanguageSerializer(serializers.ModelSerializer):
    """Serializer for FAQ items that includes language information"""
    language_display = serializers.CharField(source='get_language_display', read_only=True)
    
    class Meta:
        model = FAQ
        fields = [
            'id', 
            'question', 
            'answer', 
            'language',
            'language_display',
            'order',
            'is_active'
        ]


class FAQCategoryWithFAQsSerializer(FAQCategorySerializer):
    """Serializer for FAQ categories that includes nested FAQs"""
    faqs = serializers.SerializerMethodField()
    
    class Meta(FAQCategorySerializer.Meta):
        fields = FAQCategorySerializer.Meta.fields + ['faqs']
    
    def get_faqs(self, obj):
        """Returns active FAQs for this category in the requested language"""
        # Get language from context
        language = self.context.get('language', 'en')
        
        # Filter active FAQs by language and order them
        faqs = obj.faqs.filter(is_active=True, language=language).order_by('order')
        serializer = FAQSerializer(
            faqs, 
            many=True, 
            context=self.context
        )
        return serializer.data 