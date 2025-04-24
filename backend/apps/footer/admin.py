from django.contrib import admin
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from django.db.models import Count
from django.contrib import messages
from django.db import models
from django.urls import reverse
from django.template.defaultfilters import truncatechars
from django import forms
from django.contrib.admin.widgets import AdminURLFieldWidget
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
import uuid

from .models import FooterSettings, FooterSection, FooterLink, SocialMedia, SOCIAL_MEDIA_PLATFORMS, FooterBottomLink


class FooterSettingsForm(forms.ModelForm):
    show_contact_info = forms.BooleanField(
        label=_('Show Contact Information'),
        help_text=_('Toggle visibility of email, phone and address on the website'),
        required=False
    )
    
    show_copyright = forms.BooleanField(
        label=_('Show Copyright'),
        help_text=_('Toggle visibility of copyright text in the footer'),
        required=False,
        initial=True
    )
    
    show_contact_section = forms.BooleanField(
        label=_('Show Contact Section'),
        help_text=_('Toggle visibility of the contact section in the footer'),
        required=False,
        initial=True
    )
    
    show_company_info = forms.BooleanField(
        label=_('Show Company Information'),
        help_text=_('Toggle visibility of company name and description'),
        required=False,
        initial=True
    )
    
    class Meta:
        model = FooterSettings
        fields = '__all__'
        widgets = {
            'description_en': forms.Textarea(attrs={'rows': 3, 'cols': 80}),
            'description_ar': forms.Textarea(attrs={'rows': 3, 'cols': 80}),
            'address_en': forms.Textarea(attrs={'rows': 2, 'cols': 80}),
            'address_ar': forms.Textarea(attrs={'rows': 2, 'cols': 80}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        instance = kwargs.get('instance')
        
        # Make all fields not required initially
        self.fields['email'].required = False
        self.fields['phone'].required = False
        self.fields['address_en'].required = False
        self.fields['address_ar'].required = False
        self.fields['copyright_text_en'].required = False
        self.fields['copyright_text_ar'].required = False
        self.fields['company_name_en'].required = False
        self.fields['company_name_ar'].required = False
        self.fields['description_en'].required = False
        self.fields['description_ar'].required = False
        self.fields['newsletter_text_en'].required = False
        self.fields['newsletter_text_ar'].required = False
        self.fields['newsletter_label_en'].required = False
        self.fields['newsletter_label_ar'].required = False
        
        if instance:
            # Check if contact info exists
            self.fields['show_contact_info'].initial = bool(
                instance.email or instance.phone or instance.address_en or instance.address_ar
            )
            
            # Check if copyright exists
            self.fields['show_copyright'].initial = bool(
                instance.copyright_text_en or instance.copyright_text_ar
            )
            
            # Check if contact section exists
            self.fields['show_contact_section'].initial = bool(
                instance.contact_title_en or instance.contact_title_ar
            )
            
            # Check if company info exists
            self.fields['show_company_info'].initial = bool(
                instance.company_name_en or instance.company_name_ar or 
                instance.description_en or instance.description_ar
            )
            
            # Set required fields based on toggles
            if self.fields['show_contact_info'].initial:
                self.fields['email'].required = True
                self.fields['phone'].required = True
            
            if self.fields['show_copyright'].initial:
                self.fields['copyright_text_en'].required = True
                self.fields['copyright_text_ar'].required = True
                
            if self.fields['show_company_info'].initial:
                self.fields['company_name_en'].required = True
                self.fields['company_name_ar'].required = True
                
            if instance.show_newsletter:
                self.fields['newsletter_text_en'].required = True
                self.fields['newsletter_text_ar'].required = True
                self.fields['newsletter_label_en'].required = True
                self.fields['newsletter_label_ar'].required = True

    def clean(self):
        cleaned_data = super().clean()
        
        # Handle show_contact_info field
        show_contact = cleaned_data.get('show_contact_info', False)
        if not show_contact:
            cleaned_data['email'] = ''
            cleaned_data['phone'] = ''
            cleaned_data['address_en'] = ''
            cleaned_data['address_ar'] = ''
        elif show_contact:
            if not cleaned_data.get('email'):
                self.add_error('email', _('Email is required when contact information is enabled.'))
            if not cleaned_data.get('phone'):
                self.add_error('phone', _('Phone is required when contact information is enabled.'))
        
        # Handle show_copyright field
        show_copyright = cleaned_data.get('show_copyright', False)
        if not show_copyright:
            cleaned_data['copyright_text_en'] = ''
            cleaned_data['copyright_text_ar'] = ''
        elif show_copyright:
            if not cleaned_data.get('copyright_text_en'):
                self.add_error('copyright_text_en', _('Copyright text is required when copyright is enabled.'))
            if not cleaned_data.get('copyright_text_ar'):
                self.add_error('copyright_text_ar', _('Arabic copyright text is required when copyright is enabled.'))
        
        # Handle show_contact_section field
        show_contact_section = cleaned_data.get('show_contact_section', False)
        if not show_contact_section:
            cleaned_data['contact_title_en'] = None
            cleaned_data['contact_title_ar'] = None
        elif show_contact_section:
            # Ensure both or neither contact titles are provided
            contact_en = cleaned_data.get('contact_title_en')
            contact_ar = cleaned_data.get('contact_title_ar')
            
            if bool(contact_en) != bool(contact_ar):
                if not contact_en:
                    self.add_error('contact_title_en', _('Both English and Arabic titles must be provided or left blank.'))
                if not contact_ar:
                    self.add_error('contact_title_ar', _('Both English and Arabic titles must be provided or left blank.'))
        
        # Handle show_company_info field
        show_company = cleaned_data.get('show_company_info', False)
        if not show_company:
            cleaned_data['company_name_en'] = ''
            cleaned_data['company_name_ar'] = ''
            cleaned_data['description_en'] = ''
            cleaned_data['description_ar'] = ''
        elif show_company:
            if not cleaned_data.get('company_name_en'):
                self.add_error('company_name_en', _('Company name is required when company information is enabled.'))
            if not cleaned_data.get('company_name_ar'):
                self.add_error('company_name_ar', _('Arabic company name is required when company information is enabled.'))
        
        # Handle show_newsletter field
        show_newsletter = cleaned_data.get('show_newsletter', False)
        if not show_newsletter:
            cleaned_data['newsletter_text_en'] = ''
            cleaned_data['newsletter_text_ar'] = ''
            cleaned_data['newsletter_label_en'] = ''
            cleaned_data['newsletter_label_ar'] = ''
        elif show_newsletter:
            if not cleaned_data.get('newsletter_text_en'):
                self.add_error('newsletter_text_en', _('Newsletter text is required when newsletter is enabled.'))
            if not cleaned_data.get('newsletter_text_ar'):
                self.add_error('newsletter_text_ar', _('Arabic newsletter text is required when newsletter is enabled.'))
            if not cleaned_data.get('newsletter_label_en'):
                self.add_error('newsletter_label_en', _('Newsletter label is required when newsletter is enabled.'))
            if not cleaned_data.get('newsletter_label_ar'):
                self.add_error('newsletter_label_ar', _('Arabic newsletter label is required when newsletter is enabled.'))
        
        return cleaned_data


@admin.register(FooterSettings)
class FooterSettingsAdmin(admin.ModelAdmin):
    """Admin interface for managing global footer settings."""
    form = FooterSettingsForm
    
    fieldsets = [
        ('Visibility', {
            'fields': ('is_active',),
        }),
        ('Company Information', {
            'fields': ('show_company_info', 'company_name_en', 'company_name_ar', 'description_en', 'description_ar'),
        }),
        ('Contact Information', {
            'fields': ('show_contact_info', 'email', 'phone', 'address_en', 'address_ar'),
        }),
        ('Contact Section', {
            'fields': ('show_contact_section', 'contact_title_en', 'contact_title_ar'),
        }),
        ('Copyright', {
            'fields': ('show_copyright', 'copyright_text_en', 'copyright_text_ar'),
        }),
        ('Newsletter', {
            'fields': ('show_newsletter', 'newsletter_text_en', 'newsletter_text_ar', 'newsletter_label_en', 'newsletter_label_ar'),
        }),
    ]
    list_display = ('company_name_display', 'footer_status', 'company_info_status', 'contact_info_status', 'contact_section_status', 'copyright_status', 'newsletter_status', 'updated_date')
    list_display_links = ('updated_date', 'company_name_display')
    actions = ['enable_all', 'disable_all']
    search_fields = ('company_name_en', 'company_name_ar', 'email', 'phone')
    readonly_fields = ('id', 'created_at', 'updated_at')
    
    def updated_date(self, obj):
        return obj.updated_at.strftime("%b %d, %Y")
    updated_date.short_description = "Last Updated"
    
    def company_name_display(self, obj):
        return obj.company_name_en or "Company Name"
    company_name_display.short_description = "Company"
    
    def footer_status(self, obj):
        return self._get_toggle_icon(obj, 'is_active')
    footer_status.short_description = "Footer"
    
    def company_info_status(self, obj):
        return self._get_toggle_icon(obj, 'show_company_info')
    company_info_status.short_description = "Company Info"
    
    def contact_info_status(self, obj):
        return self._get_toggle_icon(obj, 'show_contact_info')
    contact_info_status.short_description = "Contact Info"
    
    def contact_section_status(self, obj):
        return self._get_toggle_icon(obj, 'show_contact_section')
    contact_section_status.short_description = "Contact Section"
    
    def copyright_status(self, obj):
        return self._get_toggle_icon(obj, 'show_copyright')
    copyright_status.short_description = "Copyright"
    
    def newsletter_status(self, obj):
        return self._get_toggle_icon(obj, 'show_newsletter')
    newsletter_status.short_description = "Newsletter"
    
    def _get_toggle_icon(self, obj, field_name):
        is_active = getattr(obj, field_name)
        url = reverse('admin:footer_footersettings_changelist')
        toggle_url = f"{url}?id={obj.id}&toggle={field_name}"
        
        if is_active:
            return format_html(
                '<a href="{}" title="Click to disable" style="color: #28a745; text-decoration: none; font-size: 18px;">✅</a>',
                toggle_url
            )
        return format_html(
            '<a href="{}" title="Click to enable" style="color: #dc3545; text-decoration: none; font-size: 18px;">❌</a>',
            toggle_url
        )
    
    # Simplified actions
    def enable_all(self, request, queryset):
        """Enable all footer features at once"""
        fields = ['is_active', 'show_company_info', 'show_contact_info', 
                 'show_contact_section', 'show_copyright', 'show_newsletter']
        update_dict = {field: True for field in fields}
        queryset.update(**update_dict)
        self.message_user(request, "All footer features enabled.")
    enable_all.short_description = "Enable all features"
    
    def disable_all(self, request, queryset):
        """Disable all footer features at once"""
        fields = ['is_active', 'show_company_info', 'show_contact_info', 
                 'show_contact_section', 'show_copyright', 'show_newsletter']
        update_dict = {field: False for field in fields}
        queryset.update(**update_dict)
        self.message_user(request, "All footer features disabled.")
    disable_all.short_description = "Disable all features"
    
    def has_add_permission(self, request):
        """Only allow one footer settings object to exist."""
        if FooterSettings.objects.exists():
            return False
        return super().has_add_permission(request)
    
    def has_delete_permission(self, request, obj=None):
        """Prevent deletion of the only settings object."""
        return False

    def response_change(self, request, obj):
        """Handle custom actions from the change form."""
        if "_preview_contact" in request.POST:
            self.message_user(
                request,
                format_html(
                    _("<strong>Contact Preview:</strong><br>"
                      "<div style='padding: 15px; border: 1px solid #ddd; background: #f9f9f9; margin: 10px 0;'>"
                      "<strong>{company}</strong><br>"
                      "Email: <a href='mailto:{email}'>{email}</a><br>"
                      "Phone: <a href='tel:{phone}'>{phone}</a><br>"
                      "Address: {address}"
                      "</div>"),
                    company=obj.company_name_en,
                    email=obj.email or "N/A",
                    phone=obj.phone or "N/A",
                    address=obj.address_en or "N/A"
                ),
                messages.INFO
            )
            return HttpResponseRedirect(".")
        return super().response_change(request, obj)
    
    def changeform_view(self, request, object_id=None, form_url="", extra_context=None):
        """Add extra buttons to the change form."""
        extra_context = extra_context or {}
        
        # Only add buttons if we're editing an existing object
        if object_id:
            extra_context["show_preview_button"] = True
            
        return super().changeform_view(request, object_id, form_url, extra_context)
    
    def changelist_view(self, request, extra_context=None):
        # Handle toggle requests
        if 'toggle' in request.GET and 'id' in request.GET:
            toggle_field = request.GET.get('toggle')
            item_id = request.GET.get('id')
            
            valid_fields = ['show_company_info', 'show_contact_info', 'show_contact_section', 
                           'show_copyright', 'show_newsletter', 'is_active']
            
            if toggle_field in valid_fields:
                try:
                    obj = self.model.objects.get(id=item_id)
                    current_value = getattr(obj, toggle_field)
                    setattr(obj, toggle_field, not current_value)
                    obj.save(update_fields=[toggle_field])
                    
                    status = "enabled" if not current_value else "disabled"
                    field_name = toggle_field.replace('show_', '').replace('_', ' ').title()
                    self.message_user(request, f"{field_name} {status} successfully.")
                    
                except (self.model.DoesNotExist, ValueError, AttributeError):
                    self.message_user(request, "Error toggling setting.", level=messages.ERROR)
                
                return redirect('admin:footer_footersettings_changelist')
        
        return super().changelist_view(request, extra_context)
    
    class Media:
        css = {
            'all': ('admin/css/footer_admin.css',)
        }
        js = ('admin/js/footer_admin.js',)


class FooterSectionForm(forms.ModelForm):
    """Custom form for footer section."""
    class Meta:
        model = FooterSection
        fields = '__all__'
        exclude = ['title']  # Exclude the non-editable legacy field
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['title_en'].widget.attrs.update({
            'placeholder': _('e.g., Quick Links, Services, Information'),
        })
        self.fields['title_ar'].widget.attrs.update({
            'placeholder': _('e.g., معلومات عنا، خدمات، سياسة الخصوصية'),
        })
        self.fields['slug'].widget.attrs.update({
            'placeholder': _('e.g., quick-links'),
        })


@admin.register(FooterSection)
class FooterSectionAdmin(admin.ModelAdmin):
    """Admin interface for managing footer sections."""
    form = FooterSectionForm
    prepopulated_fields = {'slug': ('title_en',)}
    list_display = ('title_en', 'slug', 'active_links_count', 'order', 'status_badge', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('title_en', 'title_ar', 'slug')
    ordering = ('order', 'title_en')
    list_editable = ('order', 'is_active')
    
    fieldsets = (
        (None, {
            'fields': ('title_en', 'title_ar', 'slug'),
        }),
        (_('Display Settings'), {
            'fields': ('order', 'is_active'),
        }),
    )
    
    actions = ['activate_sections', 'deactivate_sections', 'activate_all_links', 'deactivate_all_links']
    
    def get_queryset(self, request):
        # Add counts of links for sorting
        queryset = super().get_queryset(request)
        queryset = queryset.annotate(
            _active_links_count=Count('links', filter=models.Q(links__is_active=True)),
            _total_links_count=Count('links')
        )
        return queryset
    
    def active_links_count(self, obj):
        """Display a count of active links in this section with visual indicator."""
        active_count = getattr(obj, '_active_links_count', 0)
        total_count = getattr(obj, '_total_links_count', 0)
        
        if total_count == 0:
            return format_html('<span style="color: #dc3545;">0</span>')
        
        if active_count == total_count:
            return format_html('<span style="color: #28a745; font-weight: bold;">{} / {}</span>', active_count, total_count)
        
        if active_count == 0:
            return format_html('<span style="color: #dc3545;">{} / {}</span>', active_count, total_count)
            
        return format_html('<span style="color: #ffc107;">{} / {}</span>', active_count, total_count)
    active_links_count.short_description = _('Active/Total Links')
    active_links_count.admin_order_field = '_active_links_count'
    
    def status_badge(self, obj):
        if obj.is_active:
            return format_html(
                '<span style="background-color: #28a745; color: white; padding: 3px 8px; '
                'border-radius: 10px; font-size: 0.8em;">{}</span>',
                _('Active')
            )
        else:
            return format_html(
                '<span style="background-color: #dc3545; color: white; padding: 3px 8px; '
                'border-radius: 10px; font-size: 0.8em;">{}</span>',
                _('Inactive')
            )
    status_badge.short_description = _('Status')
    
    def activate_sections(self, request, queryset):
        """Set selected sections to active."""
        updated = queryset.update(is_active=True)
        self.message_user(
            request,
            _("{count} sections marked as active.").format(count=updated),
            messages.SUCCESS
        )
    activate_sections.short_description = _("Mark selected sections as active")
    
    def deactivate_sections(self, request, queryset):
        """Set selected sections to inactive."""
        updated = queryset.update(is_active=False)
        self.message_user(
            request,
            _("{count} sections marked as inactive.").format(count=updated),
            messages.SUCCESS
        )
    deactivate_sections.short_description = _("Mark selected sections as inactive")
    
    def activate_all_links(self, request, queryset):
        """Activate all links in selected sections."""
        count = 0
        for section in queryset:
            updated = section.links.update(is_active=True)
            count += updated
        
        self.message_user(
            request,
            _("{count} links activated across selected sections.").format(count=count),
            messages.SUCCESS
        )
    activate_all_links.short_description = _("Activate all links in selected sections")
    
    def deactivate_all_links(self, request, queryset):
        """Deactivate all links in selected sections."""
        count = 0
        for section in queryset:
            updated = section.links.update(is_active=False)
            count += updated
        
        self.message_user(
            request,
            _("{count} links deactivated across selected sections.").format(count=count),
            messages.SUCCESS
        )
    deactivate_all_links.short_description = _("Deactivate all links in selected sections")


class FooterLinkForm(forms.ModelForm):
    """Custom form for footer links."""
    class Meta:
        model = FooterLink
        fields = '__all__'
        exclude = ['title']  # Exclude the non-editable legacy field
        widgets = {
            'url': AdminURLFieldWidget(),
            'title_en': forms.TextInput(attrs={
                'placeholder': _('e.g., About Us, Services, Privacy Policy'),
            }),
            'title_ar': forms.TextInput(attrs={
                'placeholder': _('e.g., معلومات عنا، خدمات، سياسة الخصوصية'),
            }),
        }


@admin.register(FooterLink)
class FooterLinkAdmin(admin.ModelAdmin):
    """Admin interface for managing footer links."""
    form = FooterLinkForm
    
    list_display = ('title_en', 'section_link', 'url_display', 'order', 'status_badge', 'is_active', 'open_in_new_tab')
    list_filter = ('section', 'is_active', 'open_in_new_tab')
    search_fields = ('title_en', 'title_ar', 'url', 'section__title_en')
    ordering = ('section', 'order', 'title_en')
    list_editable = ('order', 'is_active', 'open_in_new_tab')
    autocomplete_fields = ['section']
    
    fieldsets = (
        (None, {
            'fields': ('section', 'title_en', 'title_ar'),
        }),
        (_('Link Settings'), {
            'fields': ('url', 'open_in_new_tab'),
        }),
        (_('Display Settings'), {
            'fields': ('order', 'is_active'),
        }),
    )
    
    actions = ['activate_links', 'deactivate_links', 'set_open_in_new_tab', 'unset_open_in_new_tab']
    
    def section_link(self, obj):
        """Display section with link to edit that section."""
        if not obj.section_id:
            return "-"
            
        section_url = reverse('admin:footer_footersection_change', args=[obj.section.id])
        status_color = '#28a745' if obj.section.is_active else '#dc3545'
        
        return format_html(
            '<a href="{}" style="color: {};">{}</a>',
            section_url,
            status_color,
            obj.section.title_en
        )
    section_link.short_description = _('Section')
    section_link.admin_order_field = 'section__title_en'
    
    def url_display(self, obj):
        """Format URL for display with indicators for internal/external links."""
        is_external = obj.url.startswith(('http://', 'https://'))
        icon = '🔗' if is_external else '📄'
        
        # Style based on active status
        style = ''
        if not obj.is_active:
            style = 'text-decoration: line-through; color: #999;'
        
        # Truncate long URLs for display
        display_url = obj.url
        if len(display_url) > 40:
            display_url = display_url[:37] + '...'
        
        # Add new tab indicator
        if obj.open_in_new_tab:
            new_tab = ' <span title="Opens in new tab">↗️</span>'
        else:
            new_tab = ''
        
        return format_html(
            '<span style="{}">{} {}{}</span>',
            style,
            icon,
            display_url,
            new_tab
        )
    url_display.short_description = _('URL')
    url_display.admin_order_field = 'url'
    
    def status_badge(self, obj):
        if obj.is_active:
            return format_html(
                '<span style="background-color: #28a745; color: white; padding: 3px 8px; '
                'border-radius: 10px; font-size: 0.8em;">{}</span>',
                _('Active')
            )
        else:
            return format_html(
                '<span style="background-color: #dc3545; color: white; padding: 3px 8px; '
                'border-radius: 10px; font-size: 0.8em;">{}</span>',
                _('Inactive')
            )
    status_badge.short_description = _('Status')
    
    def activate_links(self, request, queryset):
        """Set selected links to active."""
        updated = queryset.update(is_active=True)
        # Also make sure their sections are active
        section_ids = queryset.values_list('section_id', flat=True).distinct()
        sections_updated = FooterSection.objects.filter(id__in=section_ids, is_active=False).update(is_active=True)
        
        msg = _("{count} links marked as active.").format(count=updated)
        if sections_updated:
            msg += _(" Also activated {count} parent sections.").format(count=sections_updated)
            
        self.message_user(request, msg, messages.SUCCESS)
    activate_links.short_description = _("Mark selected links as active")
    
    def deactivate_links(self, request, queryset):
        """Set selected links to inactive."""
        updated = queryset.update(is_active=False)
        self.message_user(
            request,
            _("{count} links marked as inactive.").format(count=updated),
            messages.SUCCESS
        )
    deactivate_links.short_description = _("Mark selected links as inactive")
    
    def set_open_in_new_tab(self, request, queryset):
        """Set selected links to open in new tab."""
        updated = queryset.update(open_in_new_tab=True)
        self.message_user(
            request,
            _("{count} links set to open in new tab.").format(count=updated),
            messages.SUCCESS
        )
    set_open_in_new_tab.short_description = _("Set selected links to open in new tab")
    
    def unset_open_in_new_tab(self, request, queryset):
        """Set selected links to open in same tab."""
        updated = queryset.update(open_in_new_tab=False)
        self.message_user(
            request,
            _("{count} links set to open in same tab.").format(count=updated),
            messages.SUCCESS
        )
    unset_open_in_new_tab.short_description = _("Set selected links to open in same tab")
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """Show all sections, not just active ones."""
        if db_field.name == "section":
            kwargs["queryset"] = FooterSection.objects.all().order_by('order', 'title_en')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class SocialMediaForm(forms.ModelForm):
    """Custom form for social media links."""
    class Meta:
        model = SocialMedia
        fields = '__all__'
        widgets = {
            'url': AdminURLFieldWidget(),
            'icon': forms.TextInput(attrs={
                'placeholder': _('e.g., fab fa-facebook-f, fab fa-twitter'),
            }),
        }


@admin.register(SocialMedia)
class SocialMediaAdmin(admin.ModelAdmin):
    """Admin interface for managing social media links."""
    form = SocialMediaForm
    
    list_display = ('platform_display', 'url_preview', 'order', 'status_badge', 'is_active')
    list_filter = ('platform', 'is_active')
    search_fields = ('platform', 'url')
    ordering = ('order', 'platform')
    list_editable = ('order', 'is_active')

    fieldsets = (
        (None, {
            'fields': ('platform', 'url', 'icon'),
        }),
        (_('Display Settings'), {
            'fields': ('order', 'is_active'),
        }),
    )
    
    actions = ['activate_social_links', 'deactivate_social_links']
    
    def platform_display(self, obj):
        """Display the platform with its icon."""
        icon_class = obj.get_icon
        status_color = '#28a745' if obj.is_active else '#dc3545'
        
        return format_html(
            '<div style="display: flex; align-items: center;">'
            '<span style="font-size: 1.2em; margin-right: 8px;"><i class="{}"></i></span>'
            '<span style="color: {};">{}</span>'
            '</div>',
            icon_class,
            status_color,
            obj.get_platform_display()
        )
    platform_display.short_description = _('Platform')
    platform_display.admin_order_field = 'platform'
    
    def url_preview(self, obj):
        """Show a clickable link to the social media profile."""
        # Truncate long URLs for display
        display_url = truncatechars(obj.url, 30)
        
        return format_html(
            '<a href="{}" target="_blank" rel="noopener noreferrer">'
            '{} <span title="Opens in new tab">↗️</span></a>',
            obj.url,
            display_url
        )
    url_preview.short_description = _('URL')
    
    def status_badge(self, obj):
        if obj.is_active:
            return format_html(
                '<span style="background-color: #28a745; color: white; padding: 3px 8px; '
                'border-radius: 10px; font-size: 0.8em;">{}</span>',
                _('Active')
            )
        else:
            return format_html(
                '<span style="background-color: #dc3545; color: white; padding: 3px 8px; '
                'border-radius: 10px; font-size: 0.8em;">{}</span>',
                _('Inactive')
            )
    status_badge.short_description = _('Status')
    
    def activate_social_links(self, request, queryset):
        """Set selected social media links to active."""
        updated = queryset.update(is_active=True)
        self.message_user(
            request,
            _("{count} social media links marked as active.").format(count=updated),
            messages.SUCCESS
        )
    activate_social_links.short_description = _("Mark selected social links as active")
    
    def deactivate_social_links(self, request, queryset):
        """Set selected social media links to inactive."""
        updated = queryset.update(is_active=False)
        self.message_user(
            request,
            _("{count} social media links marked as inactive.").format(count=updated),
            messages.SUCCESS
        )
    deactivate_social_links.short_description = _("Mark selected social links as inactive")


class FooterBottomLinkForm(forms.ModelForm):
    """Custom form for footer bottom links like Terms and Privacy Policy."""
    class Meta:
        model = FooterBottomLink
        fields = '__all__'
        widgets = {
            'url': AdminURLFieldWidget(),
            'title_en': forms.TextInput(attrs={
                'placeholder': _('e.g., Terms of Service, Privacy Policy'),
            }),
            'title_ar': forms.TextInput(attrs={
                'placeholder': _('e.g., شروط الخدمة، سياسة الخصوصية'),
            }),
        }


@admin.register(FooterBottomLink)
class FooterBottomLinkAdmin(admin.ModelAdmin):
    """Admin interface for managing bottom footer links like Terms and Privacy Policy."""
    form = FooterBottomLinkForm
    
    list_display = ('title_en', 'title_ar', 'url_display', 'order', 'status_badge', 'is_active', 'open_in_new_tab')
    list_filter = ('is_active', 'open_in_new_tab')
    search_fields = ('title_en', 'title_ar', 'url')
    ordering = ('order', 'title_en')
    list_editable = ('order', 'is_active', 'open_in_new_tab')
    
    fieldsets = (
        (None, {
            'fields': ('title_en', 'title_ar'),
        }),
        (_('Link Settings'), {
            'fields': ('url', 'open_in_new_tab'),
        }),
        (_('Display Settings'), {
            'fields': ('order', 'is_active'),
        }),
    )
    
    actions = ['activate_links', 'deactivate_links', 'set_open_in_new_tab', 'unset_open_in_new_tab']
    
    def url_display(self, obj):
        """Format URL for display with indicators for internal/external links."""
        is_external = obj.url.startswith(('http://', 'https://'))
        icon = '🔗' if is_external else '📄'
        
        # Style based on active status
        style = ''
        if not obj.is_active:
            style = 'text-decoration: line-through; color: #999;'
        
        # Truncate long URLs for display
        display_url = obj.url
        if len(display_url) > 40:
            display_url = display_url[:37] + '...'
        
        # Add new tab indicator
        if obj.open_in_new_tab:
            new_tab = ' <span title="Opens in new tab">↗️</span>'
        else:
            new_tab = ''
        
        return format_html(
            '<span style="{}">{} {}{}</span>',
            style,
            icon,
            display_url,
            new_tab
        )
    url_display.short_description = _('URL')
    url_display.admin_order_field = 'url'
    
    def status_badge(self, obj):
        if obj.is_active:
            return format_html(
                '<span style="background-color: #28a745; color: white; padding: 3px 8px; '
                'border-radius: 10px; font-size: 0.8em;">{}</span>',
                _('Active')
            )
        else:
            return format_html(
                '<span style="background-color: #dc3545; color: white; padding: 3px 8px; '
                'border-radius: 10px; font-size: 0.8em;">{}</span>',
                _('Inactive')
            )
    status_badge.short_description = _('Status')
    
    def activate_links(self, request, queryset):
        """Set selected links to active."""
        updated = queryset.update(is_active=True)
        self.message_user(
            request,
            _("{count} links marked as active.").format(count=updated),
            messages.SUCCESS
        )
    activate_links.short_description = _("Mark selected links as active")
    
    def deactivate_links(self, request, queryset):
        """Set selected links to inactive."""
        updated = queryset.update(is_active=False)
        self.message_user(
            request,
            _("{count} links marked as inactive.").format(count=updated),
            messages.SUCCESS
        )
    deactivate_links.short_description = _("Mark selected links as inactive")
    
    def set_open_in_new_tab(self, request, queryset):
        """Set selected links to open in new tab."""
        updated = queryset.update(open_in_new_tab=True)
        self.message_user(
            request,
            _("{count} links set to open in new tab.").format(count=updated),
            messages.SUCCESS
        )
    set_open_in_new_tab.short_description = _("Set selected links to open in new tab")
    
    def unset_open_in_new_tab(self, request, queryset):
        """Set selected links to open in same tab."""
        updated = queryset.update(open_in_new_tab=False)
        self.message_user(
            request,
            _("{count} links set to open in same tab.").format(count=updated),
            messages.SUCCESS
        )
    unset_open_in_new_tab.short_description = _("Set selected links to open in same tab")
