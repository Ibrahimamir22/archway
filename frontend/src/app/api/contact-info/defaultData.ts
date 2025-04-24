import { ContactInfoData } from '@/types/marketing/contact';

/**
 * Default fallback contact information
 * Used when the API request fails or during development
 */
export const defaultContactInfo: ContactInfoData = {
  address_en: "VILLA 65, Ground floor, Near El Banafseg 5, NEW CAIRO, EGYPT, Cairo, Egypt",
  address_ar: "فيلا 65، الدور الأرضي، بالقرب من البنفسج 5، القاهرة الجديدة، مصر",
  email: "info@archwayeg.com",
  phone: "07787329860",
  facebook_url: "https://www.facebook.com/archway.egypt/",
  instagram_url: "https://www.instagram.com/archway.innovations/",
  working_hours_en: "Sunday - Thursday: 9:00 AM - 5:00 PM\nFriday - Saturday: Closed",
  working_hours_ar: "الأحد - الخميس: ٩:٠٠ ص - ٥:٠٠ م\nالجمعة - السبت: مغلق"
}; 