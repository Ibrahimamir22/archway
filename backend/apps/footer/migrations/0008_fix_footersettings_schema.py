from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('footer', '0007_footerbottomlink'),
    ]

    operations = [
        # Ensure show_company_info field exists and has correct default/nullability
        migrations.RunSQL(
            sql="""
            DO $$
            BEGIN
                BEGIN
                    ALTER TABLE footer_footersettings ADD COLUMN IF NOT EXISTS show_company_info BOOLEAN DEFAULT true;
                EXCEPTION WHEN duplicate_column THEN
                    NULL;
                END;
                
                -- Make contact_title fields nullable to avoid constraint violations
                BEGIN
                    ALTER TABLE footer_footersettings ALTER COLUMN contact_title_ar DROP NOT NULL;
                EXCEPTION WHEN undefined_column OR invalid_column_reference THEN
                    NULL;
                END;
                
                BEGIN
                    ALTER TABLE footer_footersettings ALTER COLUMN contact_title_en DROP NOT NULL;
                EXCEPTION WHEN undefined_column OR invalid_column_reference THEN
                    NULL;
                END;
                
                -- Fix null values for these fields to avoid constraint issues
                UPDATE footer_footersettings 
                SET contact_title_ar = 'معلومات الاتصال', contact_title_en = 'Contact Information'
                WHERE (contact_title_ar IS NULL OR contact_title_en IS NULL);
            END $$;
            """,
            reverse_sql="""
            -- No reverse SQL needed
            """
        ),
    ] 