# About Page Markdown Export/Import Utility

This utility provides a user-friendly way to manage About page content using Markdown files, which are easier for content writers to edit compared to JSON or the admin interface.

## Command Usage

### Basic Commands

```bash
# Export all About page content (both languages)
python manage.py export_import_about export --dir=about_content

# Import all About page content from markdown files
python manage.py export_import_about import --dir=about_content
```

### Language Options

```bash
# Export only English content
python manage.py export_import_about export --dir=about_content --lang=en

# Export only Arabic content
python manage.py export_import_about export --dir=about_content --lang=ar
```

## Directory Structure

The command creates a directory structure organized by content type:

```
about_content/
├── about/          # Main About page content
├── team/           # Team member profiles
├── values/         # Core values
├── testimonials/   # Client testimonials
├── history/        # Company history events
├── stats/          # Company statistics
└── clients/        # Client logos
```

## File Format Specifications

Each content type follows a specific Markdown format to ensure proper import/export.

### About Page (about/about_page.md)

```markdown
# About Archway Innovations

## Subtitle
Our journey and mission

## Mission
To redefine interior design through innovative solutions that blend functionality with aesthetic excellence.

## Vision
To become the leading interior design firm known for sustainable, culturally responsive spaces that inspire and endure.

## Meta Description
Archway Innovations is an award-winning interior design studio specializing in commercial and residential spaces that harmoniously blend functionality, sustainability, and aesthetic excellence.

---

# عن آرشواي إنوفيشنز

## العنوان الفرعي
رحلتنا ومهمتنا

## المهمة
إعادة تعريف التصميم الداخلي من خلال حلول مبتكرة تمزج بين الوظائف والتميز الجمالي.

## الرؤية
أن نصبح شركة التصميم الداخلي الرائدة المعروفة بالمساحات المستدامة والمستجيبة ثقافيًا التي تلهم وتدوم.

## وصف تعريفي
آرشواي إنوفيشنز هي استوديو تصميم داخلي حائز على جوائز متخصص في المساحات التجارية والسكنية التي تمزج بانسجام بين الوظائف والاستدامة والتميز الجمالي.
```

### Team Members (team/member_[id].md)

```markdown
# Sarah Johnson

## Role
Design Director

## Department
Interior Design

## Bio
Sarah brings over 15 years of experience in commercial and residential design. Her innovative approach has earned recognition in Architectural Digest and Interior Design Magazine.

## Image
/media/team/sarah_johnson.jpg

## Social Links
- linkedin: https://linkedin.com/in/sarahjohnson
- twitter: https://twitter.com/sarahjdesign
- instagram: https://instagram.com/sarahjohnsondesign

---

# سارة جونسون

## الدور
مديرة التصميم

## القسم
التصميم الداخلي

## السيرة الذاتية
تجلب سارة أكثر من 15 عامًا من الخبرة في التصميم التجاري والسكني. نهجها المبتكر حصل على اعتراف في مجلة Architectural Digest ومجلة Interior Design.

## الصورة
/media/team/sarah_johnson.jpg

## روابط التواصل الاجتماعي
- linkedin: https://linkedin.com/in/sarahjohnson
- twitter: https://twitter.com/sarahjdesign
- instagram: https://instagram.com/sarahjohnsondesign
```

### Core Values (values/value_[id].md)

```markdown
# Innovation

## Description
We constantly push the boundaries of design, embracing new technologies and methodologies to create spaces that surprise and delight.

## Icon
lightbulb

---

# الابتكار

## الوصف
نحن نتجاوز باستمرار حدود التصميم، ونتبنى تقنيات ومنهجيات جديدة لإنشاء مساحات تفاجئ وتسعد.

## الأيقونة
lightbulb
```

### Testimonials (testimonials/testimonial_[id].md)

```markdown
# Client Testimonial

## Client Name
John Smith

## Client Position
CEO, TechSpace Inc.

## Quote
Archway Innovations transformed our office into a space that truly reflects our company culture. The thoughtful design has improved team collaboration and client impressions.

## Image
/media/testimonials/john_smith.jpg

---

# شهادة العميل

## اسم العميل
جون سميث

## منصب العميل
الرئيس التنفيذي، شركة تيك سبيس

## الاقتباس
قامت آرشواي إنوفيشنز بتحويل مكتبنا إلى مساحة تعكس حقًا ثقافة شركتنا. أدى التصميم المدروس إلى تحسين تعاون الفريق وانطباعات العملاء.

## الصورة
/media/testimonials/john_smith.jpg
```

### Company History (history/event_[id].md)

```markdown
# Company Founding

## Year
2010

## Description
Archway Innovations was founded by architects David Chen and Maria Rodriguez with a vision to create interior spaces that harmonize form and function.

---

# تأسيس الشركة

## السنة
2010

## الوصف
تأسست آرشواي إنوفيشنز على يد المهندسين المعماريين ديفيد تشن وماريا رودريغيز برؤية لإنشاء مساحات داخلية تناغم الشكل والوظيفة.
```

### Company Statistics (stats/stat_[id].md)

```markdown
# Projects Completed

## Value
250+

## Description
Successful projects delivered across residential, commercial, and hospitality sectors.

---

# المشاريع المنجزة

## القيمة
+250

## الوصف
مشاريع ناجحة تم تسليمها في القطاعات السكنية والتجارية والضيافة.
```

### Client Logos (clients/client_[id].md)

```markdown
# TechSpace Inc.

## Image
/media/clients/techspace.png

## Website
https://techspaceinc.com

---

# شركة تيك سبيس

## الصورة
/media/clients/techspace.png

## الموقع الإلكتروني
https://techspaceinc.com
```

## Working with Markdown Files

### Workflow for Content Editors

1. **Export current content**: Run the export command to get all content in markdown format
2. **Edit content**: Use any text editor or markdown editor to make changes
3. **Import updated content**: Run the import command to update the database

### Best Practices

1. Always back up your content before making significant changes
2. Maintain the file structure created by the export command
3. Keep the markdown formatting intact for proper import
4. Be careful with image paths - they should match the media storage structure
5. When adding new content, create new files following the naming convention (e.g., `team/member_new.md`)

### Common Issues and Solutions

#### Image Paths
Ensure image paths are relative to the media directory. The command will handle mapping these to the correct storage locations.

#### Content Not Importing
Check that your markdown follows the correct format. Each section must be properly delimited with the expected headers.

#### Special Characters
The markdown format supports special characters and Unicode. There's no need for special encoding for Arabic or other non-Latin text.

## Technical Details

The command utilizes Python's markdown library to parse and generate markdown content. It maps the markdown structure to Django model fields and handles the storage of media files.

This approach offers several advantages over JSON:
- Human-readable and editable format
- Better content organization with separate files
- Support for rich text formatting within the content
- Easier version control and diff tracking for content changes

## Future Enhancements

Planned enhancements for this utility include:
- Support for more content types as they are added to the About app
- Improved validation for imported content
- Interactive command-line interface for selecting specific content to export/import
- Support for markdown preview in the command line 