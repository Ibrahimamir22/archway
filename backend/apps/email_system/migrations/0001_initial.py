# Generated by Django 5.1.6 on 2025-04-13 18:12

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('newsletter', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmailConfiguration',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(help_text='Name for this configuration', max_length=100)),
                ('email_backend', models.CharField(default='django.core.mail.backends.smtp.EmailBackend', max_length=255)),
                ('email_host', models.CharField(help_text='SMTP server hostname', max_length=255)),
                ('email_port', models.PositiveIntegerField(default=587)),
                ('email_use_tls', models.BooleanField(default=True)),
                ('email_host_user', models.CharField(help_text='SMTP username/email', max_length=255)),
                ('email_host_password', models.CharField(help_text='SMTP password', max_length=255)),
                ('default_from_email', models.EmailField(max_length=254)),
                ('active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Email Configuration',
                'verbose_name_plural': 'Email Configurations',
            },
        ),
        migrations.CreateModel(
            name='EmailDelivery',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('sent', 'Sent'), ('delivered', 'Delivered'), ('opened', 'Opened'), ('clicked', 'Clicked'), ('bounced', 'Bounced'), ('failed', 'Failed'), ('unsubscribed', 'Unsubscribed')], default='pending', max_length=20)),
                ('tracking_key', models.UUIDField(default=uuid.uuid4, editable=False)),
                ('sent_at', models.DateTimeField(blank=True, null=True)),
                ('delivered_at', models.DateTimeField(blank=True, null=True)),
                ('opened_at', models.DateTimeField(blank=True, null=True)),
                ('clicked_at', models.DateTimeField(blank=True, null=True)),
                ('open_count', models.PositiveIntegerField(default=0)),
                ('click_count', models.PositiveIntegerField(default=0)),
                ('bounce_reason', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('campaign', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='deliveries', to='newsletter.newslettercampaign')),
                ('subscriber', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_emails', to='newsletter.newslettersubscription')),
            ],
            options={
                'verbose_name': 'Email Delivery',
                'verbose_name_plural': 'Email Deliveries',
                'ordering': ['-created_at'],
                'unique_together': {('campaign', 'subscriber')},
            },
        ),
        migrations.CreateModel(
            name='LinkClick',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('url', models.URLField()),
                ('clicked_at', models.DateTimeField(auto_now_add=True)),
                ('user_agent', models.TextField(blank=True)),
                ('ip_address', models.GenericIPAddressField(blank=True, null=True)),
                ('delivery', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='link_clicks', to='email_system.emaildelivery')),
            ],
            options={
                'verbose_name': 'Link Click',
                'verbose_name_plural': 'Link Clicks',
                'ordering': ['-clicked_at'],
            },
        ),
        migrations.CreateModel(
            name='NewsletterAutomation',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('is_active', models.BooleanField(default=True)),
                ('trigger_type', models.CharField(choices=[('subscription', 'New Subscription'), ('confirmation', 'Email Confirmed'), ('segment_added', 'Added to Segment'), ('time_delay', 'Time Delay')], max_length=20)),
                ('delay_days', models.PositiveIntegerField(default=0, help_text='Days to wait before sending (for time_delay trigger)')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('segment', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='automations', to='newsletter.subscribersegment')),
            ],
            options={
                'verbose_name': 'Newsletter Automation',
                'verbose_name_plural': 'Newsletter Automations',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='AutomationStep',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('order', models.PositiveIntegerField(default=0)),
                ('delay_days', models.PositiveIntegerField(default=0, help_text='Days to wait before sending this step after the previous one')),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('template', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='automation_steps', to='newsletter.newslettertemplate')),
                ('automation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='steps', to='email_system.newsletterautomation')),
            ],
            options={
                'verbose_name': 'Automation Step',
                'verbose_name_plural': 'Automation Steps',
                'ordering': ['automation', 'order'],
                'unique_together': {('automation', 'order')},
            },
        ),
        migrations.CreateModel(
            name='AutomationExecution',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('in_progress', 'In Progress'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='pending', max_length=20)),
                ('started_at', models.DateTimeField(auto_now_add=True)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('next_step_scheduled_at', models.DateTimeField(blank=True, null=True)),
                ('subscriber', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='automation_executions', to='newsletter.newslettersubscription')),
                ('current_step', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='executions', to='email_system.automationstep')),
                ('automation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='executions', to='email_system.newsletterautomation')),
            ],
            options={
                'verbose_name': 'Automation Execution',
                'verbose_name_plural': 'Automation Executions',
                'ordering': ['-started_at'],
                'unique_together': {('automation', 'subscriber')},
            },
        ),
    ]
