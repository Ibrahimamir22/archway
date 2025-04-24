from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('contact_management', '0003_contactinfo_working_hours_ar_and_more'),
    ]

    operations = [
        # Ensure the working_hours fields exist with nullability as an option
        migrations.RunSQL(
            sql="""
            DO $$
            BEGIN
                BEGIN
                    ALTER TABLE contact_management_contactinfo ADD COLUMN IF NOT EXISTS working_hours_en TEXT;
                EXCEPTION WHEN duplicate_column THEN
                    NULL;
                END;
                
                BEGIN
                    ALTER TABLE contact_management_contactinfo ADD COLUMN IF NOT EXISTS working_hours_ar TEXT;
                EXCEPTION WHEN duplicate_column THEN
                    NULL;
                END;
                
                -- Update the column to have the correct constraints if it already exists
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contact_management_contactinfo' AND column_name='working_hours_en') THEN
                    ALTER TABLE contact_management_contactinfo ALTER COLUMN working_hours_en SET DEFAULT '';
                    ALTER TABLE contact_management_contactinfo ALTER COLUMN working_hours_en DROP NOT NULL;
                END IF;
                
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contact_management_contactinfo' AND column_name='working_hours_ar') THEN
                    ALTER TABLE contact_management_contactinfo ALTER COLUMN working_hours_ar SET DEFAULT '';
                    ALTER TABLE contact_management_contactinfo ALTER COLUMN working_hours_ar DROP NOT NULL;
                END IF;
            END $$;
            """,
            reverse_sql="""
            -- No need for reverse SQL as we're ensuring presence, not removing
            """
        ),
        
        # Add linkedin, twitter and youtube URL fields if they don't exist
        migrations.RunSQL(
            sql="""
            DO $$
            BEGIN
                BEGIN
                    ALTER TABLE contact_management_contactinfo ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(200) DEFAULT '';
                EXCEPTION WHEN duplicate_column THEN
                    NULL;
                END;
                
                BEGIN
                    ALTER TABLE contact_management_contactinfo ADD COLUMN IF NOT EXISTS twitter_url VARCHAR(200) DEFAULT '';
                EXCEPTION WHEN duplicate_column THEN
                    NULL;
                END;
                
                BEGIN
                    ALTER TABLE contact_management_contactinfo ADD COLUMN IF NOT EXISTS youtube_url VARCHAR(200) DEFAULT '';
                EXCEPTION WHEN duplicate_column THEN
                    NULL;
                END;
            END $$;
            """,
            reverse_sql="""
            -- No need for reverse SQL as we're ensuring presence, not removing
            """
        ),
    ] 