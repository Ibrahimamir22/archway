from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.translation import gettext as _
from .models import ContactMessage
from .serializers import ContactMessageSerializer

class ContactViewSet(viewsets.GenericViewSet):
    """
    API endpoint for contact form submissions.
    Allows only creating new messages, not viewing or editing them.
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Handle contact form submission"""
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            # Save the message to the database
            contact_message = serializer.save()
            
            try:
                # Send email notification (if configured)
                self.send_notification_email(contact_message)
            except Exception as e:
                # Log the error but don't return an error to the user
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Error sending notification email: {e}")
            
            return Response(
                {"message": _("Your message has been sent successfully!")},
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    def send_notification_email(self, contact_message):
        """Send notification email to admin"""
        subject = f"New Contact Message from {contact_message.name}"
        
        # Create email context
        context = {
            'name': contact_message.name,
            'email': contact_message.email,
            'phone': contact_message.phone,
            'message': contact_message.message,
            'created_at': contact_message.created_at
        }
        
        # Render email templates
        html_message = render_to_string('contact/email_notification.html', context)
        plain_message = render_to_string('contact/email_notification.txt', context)
        
        # Get recipients from settings or use default
        recipients = getattr(settings, 'CONTACT_NOTIFICATION_EMAILS', ['info@archwaydesign.com'])
        
        # Send email
        send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            recipients,
            html_message=html_message,
            fail_silently=False
        ) 