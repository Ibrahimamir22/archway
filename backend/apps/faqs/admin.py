from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import FAQCategory, FAQ


class FAQInline(admin.TabularInline):
    """Inline editor for FAQs within a category"""
    model = FAQ
    extra = 1
    fields = ('question_text', 'answer_text', 'language', 'order', 'is_active')
    ordering = ('order',)


@admin.register(FAQCategory)
class FAQCategoryAdmin(admin.ModelAdmin):
    """Admin interface for FAQ categories"""
    list_display = ('name_en', 'name_ar', 'slug', 'order', 'is_active', 'faq_count')
    list_filter = ('is_active',)
    search_fields = ('name_en', 'name_ar', 'slug')
    prepopulated_fields = {'slug': ('name_en',)}
    inlines = [FAQInline]
    fieldsets = (
        (None, {
            'fields': ('is_active', 'order')
        }),
        (_('English Content'), {
            'fields': ('name_en',)
        }),
        (_('Arabic Content'), {
            'fields': ('name_ar',)
        }),
        (_('Advanced Options'), {
            'fields': ('slug',),
            'classes': ('collapse',)
        }),
    )

    def faq_count(self, obj):
        """Display the number of FAQs in this category"""
        return obj.faqs.count()
    faq_count.short_description = _("Number of FAQs")


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    """Admin interface for FAQ items"""
    list_display = ('question_text', 'category', 'language', 'order', 'is_active', 'updated_at')
    list_filter = ('is_active', 'category', 'language')
    search_fields = ('question_text', 'answer_text')
    list_editable = ('order', 'is_active')
    fieldsets = (
        (None, {
            'fields': ('category', 'language', 'is_active', 'order')
        }),
        (_('Content'), {
            'fields': ('question_text', 'answer_text')
        }),
    )
    
    class Media:
        css = {
            'all': ('admin/css/admin-wysiwyg.css',)
        }
        js = ('admin/js/tiny_mce/tiny_mce.js', 'admin/js/admin-wysiwyg.js') 