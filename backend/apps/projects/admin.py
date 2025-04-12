from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from .models import Project, ProjectCategory, Tag, ProjectImage

print("Loading projects admin.py")

class ProjectImageInline(admin.TabularInline):
    """Inline admin for project images"""
    model = ProjectImage
    extra = 1
    fields = ('image', 'image_preview', 'alt_text_en', 'alt_text_ar', 'is_cover', 'order')
    readonly_fields = ('image_preview',)
    
    def image_preview(self, obj):
        """Preview for project images"""
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px; max-width: 100px;" />', obj.image.url)
        return "-"
    
    image_preview.short_description = _("Preview")

# Explicitly unregister any default admin that might be auto-registered
try:
    admin.site.unregister(Project)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(ProjectCategory)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(Tag)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(ProjectImage)
except admin.sites.NotRegistered:
    pass

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """Admin for projects with image upload and preview"""
    list_display = ('title_en', 'title_ar', 'category', 'display_tags', 'is_featured', 'is_published', 'created_at')
    list_filter = ('category', 'tags', 'is_featured', 'is_published', 'created_at')
    search_fields = ('title_en', 'title_ar', 'description_en', 'description_ar', 'client_en', 'client_ar')
    prepopulated_fields = {'slug': ('title_en',)}
    filter_horizontal = ('tags',)
    readonly_fields = ('cover_preview',)
    fieldsets = (
        (_('Basic Info'), {
            'fields': ('title_en', 'title_ar', 'slug', 'category', 'tags', 
                      'description_en', 'description_ar')
        }),
        (_('Details'), {
            'fields': ('client_en', 'client_ar', 'location_en', 'location_ar', 'area', 'completed_date')
        }),
        (_('Display Options'), {
            'fields': ('is_featured', 'is_published', 'cover_image', 'cover_preview')
        }),
    )
    inlines = [ProjectImageInline]
    actions = ['publish_projects', 'unpublish_projects', 'mark_as_featured', 'unmark_as_featured']
    
    def cover_preview(self, obj):
        """Preview for project cover image"""
        if obj.cover_image:
            return format_html('<img src="{}" style="max-height: 200px; max-width: 200px;" />', obj.cover_image.url)
        
        # If no cover_image but an image with is_cover=True exists, show that
        cover_image = obj.images.filter(is_cover=True).first()
        if cover_image and cover_image.image:
            return format_html('<img src="{}" style="max-height: 200px; max-width: 200px;" />', cover_image.image.url)
        
        return _("No cover image")
    
    cover_preview.short_description = _("Cover Preview")
    
    def display_tags(self, obj):
        """Display project tags as a comma-separated list"""
        return ", ".join([tag.name_en for tag in obj.tags.all()])
    
    display_tags.short_description = _("Tags")
    
    def publish_projects(self, request, queryset):
        """Action to publish selected projects"""
        queryset.update(is_published=True)
        self.message_user(request, _("Selected projects have been published."))
    
    publish_projects.short_description = _("Publish selected projects")
    
    def unpublish_projects(self, request, queryset):
        """Action to unpublish selected projects"""
        queryset.update(is_published=False)
        self.message_user(request, _("Selected projects have been unpublished."))
    
    unpublish_projects.short_description = _("Unpublish selected projects")
    
    def mark_as_featured(self, request, queryset):
        """Action to mark selected projects as featured"""
        queryset.update(is_featured=True)
        self.message_user(request, _("Selected projects have been marked as featured."))
    
    mark_as_featured.short_description = _("Mark selected projects as featured")
    
    def unmark_as_featured(self, request, queryset):
        """Action to unmark selected projects as featured"""
        queryset.update(is_featured=False)
        self.message_user(request, _("Selected projects have been unmarked as featured."))
    
    unmark_as_featured.short_description = _("Unmark selected projects as featured")

@admin.register(ProjectCategory)
class ProjectCategoryAdmin(admin.ModelAdmin):
    """Admin for project categories"""
    list_display = ('name_en', 'name_ar', 'slug', 'parent', 'created_at')
    list_filter = ('parent', 'created_at')
    search_fields = ('name_en', 'name_ar', 'description_en', 'description_ar')
    prepopulated_fields = {'slug': ('name_en',)}
    fieldsets = (
        (None, {
            'fields': ('name_en', 'name_ar', 'slug', 'description_en', 'description_ar', 'parent')
        }),
    )

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    """Admin for project tags"""
    list_display = ('name_en', 'name_ar', 'slug')
    search_fields = ('name_en', 'name_ar', 'slug')
    prepopulated_fields = {'slug': ('name_en',)}
    fieldsets = (
        (None, {
            'fields': ('name_en', 'name_ar', 'slug')
        }),
    )

@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    """Admin for project images"""
    list_display = ('project', 'image_preview', 'alt_text_en', 'is_cover', 'order')
    list_filter = ('project', 'is_cover', 'created_at')
    search_fields = ('project__title_en', 'alt_text_en', 'alt_text_ar')
    readonly_fields = ('image_preview',)
    
    def image_preview(self, obj):
        """Preview for project images"""
        if obj.image:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 50px;" />', obj.image.url)
        return "-"
    
    image_preview.short_description = _("Preview")
