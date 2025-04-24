import { Project } from '@/types/portfolio';

export const defaultProjects: Project[] = [
  {
    id: "1",
    title: {
      en: "Modern Apartment Building",
      ar: "مبنى شقق حديث"
    },
    description: {
      en: "A sleek, contemporary apartment building featuring sustainable materials and energy-efficient design.",
      ar: "مبنى شقق أنيق ومعاصر يتميز بمواد مستدامة وتصميم موفر للطاقة."
    },
    client: {
      en: "Urban Development Group",
      ar: "مجموعة التطوير الحضري"
    },
    location: {
      en: "Downtown, City Center",
      ar: "وسط المدينة"
    },
    area: 12500,
    date: "2022-05-15",
    services: {
      en: ["Architectural Design", "Interior Design", "Sustainability Consulting"],
      ar: ["التصميم المعماري", "التصميم الداخلي", "استشارات الاستدامة"]
    },
    images: [
      "/images/portfolio/project1/main.jpg",
      "/images/portfolio/project1/interior1.jpg",
      "/images/portfolio/project1/exterior1.jpg"
    ],
    category: "residential"
  },
  {
    id: "2",
    title: {
      en: "Corporate Headquarters",
      ar: "المقر الرئيسي للشركة"
    },
    description: {
      en: "A striking office building designed to foster collaboration and innovation while reflecting the company's brand identity.",
      ar: "مبنى مكتبي مميز مصمم لتعزيز التعاون والابتكار مع عكس هوية العلامة التجارية للشركة."
    },
    client: {
      en: "Tech Innovations Inc.",
      ar: "شركة ابتكارات التقنية"
    },
    location: {
      en: "Business District, Metropolis",
      ar: "حي الأعمال، المدينة الكبرى"
    },
    area: 30000,
    date: "2023-01-20",
    services: {
      en: ["Architectural Design", "Space Planning", "Project Management"],
      ar: ["التصميم المعماري", "تخطيط المساحة", "إدارة المشروع"]
    },
    images: [
      "/images/portfolio/project2/main.jpg",
      "/images/portfolio/project2/interior1.jpg",
      "/images/portfolio/project2/exterior1.jpg"
    ],
    category: "commercial"
  },
  {
    id: "3",
    title: {
      en: "Public Library Renovation",
      ar: "تجديد المكتبة العامة"
    },
    description: {
      en: "A complete renovation of a historic library building, preserving its architectural heritage while modernizing facilities and accessibility.",
      ar: "تجديد كامل لمبنى مكتبة تاريخي، مع الحفاظ على تراثه المعماري وتحديث المرافق وإمكانية الوصول."
    },
    client: {
      en: "City Municipal Authority",
      ar: "هيئة بلدية المدينة"
    },
    location: {
      en: "Cultural District, Historic Center",
      ar: "الحي الثقافي، المركز التاريخي"
    },
    area: 25000,
    date: "2021-11-10",
    services: {
      en: ["Restoration", "Interior Renovation", "Accessibility Planning"],
      ar: ["الترميم", "تجديد المباني الداخلية", "تخطيط إمكانية الوصول"]
    },
    images: [
      "/images/portfolio/project3/main.jpg",
      "/images/portfolio/project3/interior1.jpg",
      "/images/portfolio/project3/exterior1.jpg"
    ],
    category: "public"
  }
]; 