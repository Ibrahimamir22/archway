# Generated by Django 5.1.6 on 2025-04-22 00:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('footer', '0005_alter_footerlink_options_alter_footersection_options_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='footersettings',
            options={},
        ),
        migrations.AddField(
            model_name='footersettings',
            name='show_company_info',
            field=models.BooleanField(default=True, verbose_name='Show Company Information'),
        ),
        migrations.AddField(
            model_name='footersettings',
            name='show_contact_info',
            field=models.BooleanField(default=True, verbose_name='Show Contact Information'),
        ),
        migrations.AddField(
            model_name='footersettings',
            name='show_contact_section',
            field=models.BooleanField(default=True, verbose_name='Show Contact Section'),
        ),
        migrations.AddField(
            model_name='footersettings',
            name='show_copyright',
            field=models.BooleanField(default=True, verbose_name='Show Copyright'),
        ),
        migrations.AlterField(
            model_name='footersettings',
            name='address_ar',
            field=models.TextField(blank=True, verbose_name='Address (Arabic)'),
        ),
        migrations.AlterField(
            model_name='footersettings',
            name='address_en',
            field=models.TextField(blank=True, verbose_name='Address (English)'),
        ),
        migrations.AlterField(
            model_name='footersettings',
            name='company_name_ar',
            field=models.CharField(blank=True, max_length=100, verbose_name='Company Name (Arabic)'),
        ),
        migrations.AlterField(
            model_name='footersettings',
            name='company_name_en',
            field=models.CharField(blank=True, max_length=100, verbose_name='Company Name (English)'),
        ),
        migrations.AlterField(
            model_name='footersettings',
            name='contact_title_ar',
            field=models.CharField(blank=True, default='', max_length=100, verbose_name='Contact Section Title (Arabic)'),
        ),
        migrations.AlterField(
            model_name='footersettings',
            name='contact_title_en',
            field=models.CharField(blank=True, default='', max_length=100, verbose_name='Contact Section Title (English)'),
        ),
        migrations.AlterField(
            model_name='footersettings',
            name='copyright_text_ar',
            field=models.CharField(blank=True, max_length=255, verbose_name='Copyright Text (Arabic)'),
        ),
        migrations.AlterField(
            model_name='footersettings',
            name='copyright_text_en',
            field=models.CharField(blank=True, max_length=255, verbose_name='Copyright Text (English)'),
        ),
        migrations.AlterField(
            model_name='footersettings',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='footersettings',
            name='description_ar',
            field=models.TextField(blank=True, verbose_name='Description (Arabic)'),
        ),
        migrations.AlterField(
            model_name='footersettings',
            name='description_en',
            field=models.TextField(blank=True, verbose_name='Description (English)'),
        ),
        migrations.AlterField(
            model_name='footersettings',
            name='email',
            field=models.EmailField(blank=True, max_length=254, verbose_name='Email'),
        ),
        migrations.AlterField(
            model_name='footersettings',
            name='is_active',
            field=models.BooleanField(default=True, verbose_name='Show Footer'),
        ),
        migrations.AlterField(
            model_name='footersettings',
            name='newsletter_label_ar',
            field=models.CharField(blank=True, help_text='Label for the newsletter signup button', max_length=255, verbose_name='Newsletter Label (Arabic)'),
        ),
        migrations.AlterField(
            model_name='footersettings',
            name='newsletter_label_en',
            field=models.CharField(blank=True, help_text='Label for the newsletter signup button', max_length=255, verbose_name='Newsletter Label (English)'),
        ),
        migrations.AlterField(
            model_name='footersettings',
            name='newsletter_text_ar',
            field=models.CharField(blank=True, max_length=255, verbose_name='Newsletter Text (Arabic)'),
        ),
        migrations.AlterField(
            model_name='footersettings',
            name='newsletter_text_en',
            field=models.CharField(blank=True, max_length=255, verbose_name='Newsletter Text (English)'),
        ),
        migrations.AlterField(
            model_name='footersettings',
            name='phone',
            field=models.CharField(blank=True, max_length=20, verbose_name='Phone'),
        ),
        migrations.AlterField(
            model_name='footersettings',
            name='show_newsletter',
            field=models.BooleanField(default=False, verbose_name='Show Newsletter Signup'),
        ),
        migrations.AlterField(
            model_name='footersettings',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
