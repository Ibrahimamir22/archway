(function($) {
    $(document).ready(function() {
        // Add a preview button to the form
        if ($('body').hasClass('model-footersettings')) {
            const submitRow = $('.submit-row');
            
            if (submitRow.length && $('#id_email, #id_phone, #id_address_en').length) {
                const previewButton = $('<input type="submit" value="Preview Contact Info" name="_preview_contact" class="default" style="background: #417690; color: white; margin-right: 5px;">');
                submitRow.prepend(previewButton);
                
                // Add anchor for contact section
                $('fieldset').eq(1).attr('id', 'contact-info');
            }
            
            // Add shortcuts to sections
            const shortcuts = $('<div class="module footer-shortcuts" style="margin-bottom: 20px;">' +
                '<h2>Quick Navigation</h2>' +
                '<div style="display: flex; flex-wrap: wrap; gap: 10px; padding: 10px;">' +
                '<a href="#" data-section="0" class="button">Company Info</a>' +
                '<a href="#contact-info" data-section="1" class="button">Contact Info</a>' +
                '<a href="#" data-section="2" class="button">Copyright</a>' +
                '<a href="#" data-section="3" class="button">Contact Section</a>' +
                '<a href="#" data-section="4" class="button">Newsletter</a>' +
                '<a href="#" data-section="5" class="button">Display</a>' +
                '</div>' +
                '</div>');
            
            $('.form-row').first().before(shortcuts);
            
            // Make shortcuts work
            $('.footer-shortcuts a').on('click', function(e) {
                if (!$(this).attr('href') || $(this).attr('href') === '#') {
                    e.preventDefault();
                    const sectionIndex = $(this).data('section');
                    const targetSection = $('fieldset').eq(sectionIndex);
                    if (targetSection.length) {
                        $('html, body').animate({
                            scrollTop: targetSection.offset().top - 50
                        }, 400);
                    }
                }
            });
        }
        
        // Enhance contact preview in list view
        if ($('body').hasClass('changelist') && $('body').hasClass('app-footer')) {
            // Add highlight to contact info cells
            $('.field-contact_info_preview').each(function() {
                $(this).closest('td').css({
                    'background-color': '#f8f8f8',
                    'border-radius': '4px',
                    'border': '1px solid #eee'
                });
            });
        }
    });
})(django.jQuery); 