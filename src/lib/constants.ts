// Database table names
export const TABLES = {
    PAGE_SECTIONS: 'ld_page_sections',
    HOMEPAGE_FOOTER: 'ld_homepage_footer',
    HOMEPAGE_INSIGHTS: 'ld_homepage_insights',
    MAIN_HP_FOOTER_ITEMS: 'ld_main_hp_footer_items',
    MAIN_HP_FOOTER: 'ld_main_hp_footer',
    TEAM: 'ld_team',
    VISION_MISSION: 'ld_vision_mission',
    RESOURCES: 'ld_resources',
    COURSE_PAGES: 'ld_course_pages'
} as const;

// Section keys
export const SECTION_KEYS = {
    COURSES: 'courses',
    TESTIMONIALS: 'testimonials',
    SERVICES: 'services',
    CLIENTS: 'clients',
    HERO: 'hero',
    NAVBAR: 'navbar',
    SOLUTIONS_HEADER: 'solutions_header',
    WANTS_HEADER: 'wants_header',
    DIFFICULTIES_HEADER: 'difficulties_header',
    SOLUTIONS: 'solutions',
    CTA_SECTION: 'cta_section',
} as const;

// Insight sections
export const INSIGHT_SECTIONS = {
    WANTS: 'wants',
    DIFFICULTIES: 'difficulties',
} as const;

// Default navbar links
export const DEFAULT_NAVBAR_LINKS = [
    { label: "Khóa Học", href: "/shop" },
    { label: "Tài Nguyên", href: "/resources" },
    { label: "Về Chúng Tôi", href: "/about" }
] as const;
