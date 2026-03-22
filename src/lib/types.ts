// Footer Types
export interface FooterItem {
    id: number;
    section_id: string;
    title: string;
    link_url?: string;
    sort_order: number;
    is_active: boolean;
}

export interface FooterSettings {
    id: number;
    description?: string;
    copyright_text?: string;
    facebook_url?: string;
    youtube_url?: string;
    instagram_url?: string;
    contact_email?: string;
    contact_phone?: string;
    contact_address?: string;
    logo_url?: string;
    newsletter_title?: string;
    newsletter_description?: string;
    newsletter_placeholder?: string;
    links?: Array<{
        section_id: string;
        items: FooterItem[];
    }>;
}

// Page Data Types
export interface HeroData {
    title: string;
    video_url?: string;
    images: string[];
    media_type?: 'video' | 'slider';
}

export interface ServiceItem {
    title: string;
    image: string;
    href: string;
}

export interface WantItem {
    icon: string;
    text: string;
    bg: string;
}

export interface DifficultyItem {
    icon: string;
    text: string;
    highlight: boolean;
}

export interface SolutionItem {
    icon: string;
    text: string;
}

export interface CourseModule {
    title: string;
    img: string;
}

export interface CourseData {
    type: string;
    stats: {
        left: string;
        leftLabel: string;
        right: string;
        rightLabel: string;
    };
    desc1: string;
    desc2: string;
    modules: CourseModule[];
}

export interface ClientData {
    name: string;
    img: string;
    sub: string;
    desc: string;
    logo: string;
}

export interface TestimonialData {
    text: string;
    handle: string;
    role: string;
    img: string;
}

export interface TeamMember {
    id: number;
    name: string;
    english_name: string;
    img: string;
    points: string[];
    display_order: number;
}

export interface VisionMissionData {
    vision: {
        title: string;
        content: string;
    };
    mission: {
        title: string;
        content: string;
    };
}

export interface ResourceData {
    id: number;
    type: string;
    title: string;
    image: string;
    read_time: string;
    link: string;
    description?: string;
    display_order: number;
}

export interface NavbarLink {
    label: string;
    href: string;
    dropdown?: NavbarLink[];
}

export interface NavbarData {
    logo_url?: string;
    login_label?: string;
    cta_label?: string;
    links: NavbarLink[];
}

// Course Detail Page Types
export interface CoursePageFeature {
    title: string;
    desc: string;
    icon: string;
}

export interface CoursePageStructureItem {
    title: string;
    tag: string;
    features: string[];
}

export interface CoursePageData {
    slug: string;
    title: string;
    badge?: string;
    description: string;
    stats: {
        left: string;
        leftLabel: string;
        right: string;
        rightLabel: string;
    };
    hero_image: string;
    features: {
        image: string;
        quote: string;
        items: CoursePageFeature[];
    };
    structure: {
        title: string;
        items: CoursePageStructureItem[];
    };
    evaluation?: {
        title: string;
        desc: string;
        image: string;
        highlight?: string;
        subHighlight?: string;
        methods: string[];
    };
    cta_banner?: {
        title: string;
        desc: string;
        buttonText: string;
    };
}

export interface SectionHeader {
    title?: string;
    subtitle?: string;
    titlePrefix?: string;
    titleSuffix?: string;
    description?: string;
}

// Supabase Response Types
export interface PageSection {
    section_key: string;
    data: any;
    created_at: string;
    updated_at: string;
}

export interface InsightItem {
    id: number;
    section: 'wants' | 'difficulties';
    text: string;
    icon_name: string;
    bg_color?: string;
    is_highlighted?: boolean;
    display_order: number;
}
