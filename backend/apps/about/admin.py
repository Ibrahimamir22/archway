from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import (
    AboutPage, TeamMember, CoreValue, Testimonial,
    CompanyHistory, CompanyStatistic, ClientLogo
)

@admin.register(AboutPage)
class AboutPageAdmin(admin.ModelAdmin):
    fieldsets = (
        (_('English Content'), {
            'fields': ('title', 'subtitle', 'mission_title', 'mission_description',
                       'vision_title', 'vision_description', 'team_section_title',
                       'values_section_title', 'testimonials_section_title',
                       'history_section_title', 'meta_description')
        }),
        (_('Arabic Content'), {
            'fields': ('title_ar', 'subtitle_ar', 'mission_title_ar', 'mission_description_ar',
                       'vision_title_ar', 'vision_description_ar', 'team_section_title_ar',
                       'values_section_title_ar', 'testimonials_section_title_ar',
                       'history_section_title_ar', 'meta_description_ar')
        }),
        (_('Metadata'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        })
    )
    readonly_fields = ('created_at', 'updated_at')
    list_display = ('title', 'updated_at')

    def has_add_permission(self, request):
        # Only allow one AboutPage instance
        return AboutPage.objects.count() == 0


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    fieldsets = (
        (_('Basic Information'), {
            'fields': ('name', 'role', 'department', 'bio', 'image')
        }),
        (_('Arabic Content'), {
            'fields': ('name_ar', 'role_ar', 'department_ar', 'bio_ar')
        }),
        (_('Contact Information'), {
            'fields': ('email', 'linkedin')
        }),
        (_('Display Options'), {
            'fields': ('order', 'is_active', 'is_featured')
        }),
        (_('Metadata'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        })
    )
    list_display = ('name', 'role', 'department', 'order', 'is_active', 'is_featured')
    list_filter = ('is_active', 'is_featured', 'department')
    search_fields = ('name', 'role', 'bio')
    readonly_fields = ('created_at', 'updated_at')
    list_editable = ('order', 'is_active', 'is_featured')


@admin.register(CoreValue)
class CoreValueAdmin(admin.ModelAdmin):
    fieldsets = (
        (_('English Content'), {
            'fields': ('title', 'description', 'icon')
        }),
        (_('Arabic Content'), {
            'fields': ('title_ar', 'description_ar')
        }),
        (_('Display Options'), {
            'fields': ('order',)
        }),
        (_('Metadata'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        })
    )
    list_display = ('title', 'order')
    list_editable = ('order',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    fieldsets = (
        (_('English Content'), {
            'fields': ('client_name', 'quote', 'project')
        }),
        (_('Arabic Content'), {
            'fields': ('client_name_ar', 'quote_ar', 'project_ar')
        }),
        (_('Display Options'), {
            'fields': ('is_featured',)
        }),
        (_('Metadata'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        })
    )
    list_display = ('client_name', 'project', 'is_featured', 'created_at')
    list_filter = ('is_featured',)
    search_fields = ('client_name', 'quote', 'project')
    list_editable = ('is_featured',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(CompanyHistory)
class CompanyHistoryAdmin(admin.ModelAdmin):
    fieldsets = (
        (_('Event Information'), {
            'fields': ('year', 'title', 'description')
        }),
        (_('Arabic Content'), {
            'fields': ('title_ar', 'description_ar')
        }),
        (_('Metadata'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        })
    )
    list_display = ('year', 'title', 'created_at')
    list_filter = ('year',)
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-year',)


@admin.register(CompanyStatistic)
class CompanyStatisticAdmin(admin.ModelAdmin):
    fieldsets = (
        (_('English Content'), {
            'fields': ('title', 'value', 'unit')
        }),
        (_('Arabic Content'), {
            'fields': ('title_ar', 'unit_ar')
        }),
        (_('Display Options'), {
            'fields': ('order',)
        }),
        (_('Metadata'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        })
    )
    list_display = ('title', 'value', 'unit', 'order')
    list_editable = ('value', 'unit', 'order')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ClientLogo)
class ClientLogoAdmin(admin.ModelAdmin):
    fieldsets = (
        (_('English Content'), {
            'fields': ('name', 'logo', 'url')
        }),
        (_('Arabic Content'), {
            'fields': ('name_ar',)
        }),
        (_('Display Options'), {
            'fields': ('order', 'is_active')
        }),
        (_('Metadata'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        })
    )
    list_display = ('name', 'order', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name',)
    list_editable = ('order', 'is_active')
    readonly_fields = ('created_at', 'updated_at')
