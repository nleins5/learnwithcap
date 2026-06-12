import { supabase } from './supabase';
import {
    PageSection,
    InsightItem,
    TeamMember,
    ResourceData,
    FooterSettings,
    CoursePageData,
    HeroData
} from './types';
import { TABLES, SECTION_KEYS, INSIGHT_SECTIONS } from './constants';

/**
 * Fetch all page sections in a single query
 */
export async function fetchPageSections() {
    const { data, error } = await supabase
        .from(TABLES.PAGE_SECTIONS)
        .select('*');

    if (error) {
        // Log detailed error information. JSON.stringify helps if the error object is not a standard Error instance.
        // If the error object is truly empty {}, it might indicate a network issue or a suppressed error from Supabase client.
        console.warn('Error fetching page sections:', JSON.stringify(error, null, 2));
        return null;
    }

    return data as PageSection[];
}

/**
 * Fetch footer data
 */
export async function fetchFooterData() {
    const { data, error } = await supabase
        .from(TABLES.HOMEPAGE_FOOTER)
        .select('*')
        .single();

    if (error) {
        console.warn('Error fetching footer:', JSON.stringify(error, null, 2));
        return null;
    }

    return data as FooterSettings;
}

/**
 * Fetch hero data from centralized table
 */
export async function fetchHeroData() {
    const { data } = await supabase
        .from('main_hp_hero')
        .select('*')
        .eq('site_key', 'main')
        .maybeSingle();
    
    return data as HeroData | null;
}

/**
 * Fetch homepage insights (wants & difficulties)
 */
export async function fetchInsights() {
    const { data, error } = await supabase
        .from(TABLES.HOMEPAGE_INSIGHTS)
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.warn('Error fetching insights:', JSON.stringify(error, null, 2));
        return null;
    }

    return data as InsightItem[];
}

/**
 * Fetch team members
 */
export async function fetchTeam() {
    const { data, error } = await supabase
        .from(TABLES.TEAM)
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    if (error) {
        console.warn('Error fetching team:', JSON.stringify(error, null, 2));
        return null;
    }

    return data as TeamMember[];
}

/**
 * Fetch vision & mission
 */
export async function fetchVisionMission() {
    const { data, error } = await supabase
        .from(TABLES.VISION_MISSION)
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single();

    if (error) {
        console.warn('Error fetching vision/mission:', JSON.stringify(error, null, 2));
        return null;
    }

    if (!data) return null;

    return {
        vision: {
            title: data.vision_title,
            content: data.vision_content
        },
        mission: {
            title: data.mission_title,
            content: data.mission_content
        }
    };
}

/**
 * Fetch resources
 */
export async function fetchResources() {
    const { data, error } = await supabase
        .from(TABLES.RESOURCES)
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    if (error) {
        console.warn('Error fetching resources:', JSON.stringify(error, null, 2));
        return null;
    }

    return data as ResourceData[];
}

/**
 * Fetch detailed content for a specific course page by slug
 */
export const fetchCoursePageData = async (slug: string): Promise<CoursePageData | null> => {
    try {
        const { data, error } = await supabase
            .from(TABLES.COURSE_PAGES)
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error(`Error fetching course page data for ${slug}:`, error);
            return null;
        }

        return data as CoursePageData;
    } catch (err) {
        console.error(`Unexpected error fetching course page data for ${slug}:`, err);
        return null;
    }
};

/**
 * Process page sections data into structured format
 */
export function processPageSections(sections: PageSection[] | null) {
    if (!sections) return {};

    const processed: Record<string, PageSection['data']> = {};

    sections.forEach((section) => {
        switch (section.section_key) {
            case SECTION_KEYS.COURSES:
                if (section.data?.length > 0) {
                    processed.courses = section.data;
                }
                break;
            case SECTION_KEYS.TESTIMONIALS:
                if (section.data?.items?.length > 0) {
                    processed.testimonials = section.data.items;
                    processed.testimonialsHeader = section.data.header;
                }
                break;
            case SECTION_KEYS.SERVICES:
                if (section.data?.items?.length > 0) {
                    processed.serviceItems = section.data.items;
                    processed.servicesHeader = section.data.header;
                }
                break;
            case SECTION_KEYS.CLIENTS:
                if (section.data?.items?.length > 0) {
                    processed.clients = section.data.items;
                    processed.clientsHeader = section.data.header;
                }
                break;
            case SECTION_KEYS.HERO:
                if (section.data) {
                    processed.hero = section.data;
                }
                break;
            case SECTION_KEYS.NAVBAR:
                if (section.data) {
                    processed.navbar = section.data;
                }
                break;
            case SECTION_KEYS.SOLUTIONS_HEADER:
                processed.solutionsHeader = section.data;
                break;
            case SECTION_KEYS.WANTS_HEADER:
                processed.wantsHeader = section.data;
                break;
            case SECTION_KEYS.DIFFICULTIES_HEADER:
                processed.difficultiesHeader = section.data;
                break;
            case SECTION_KEYS.SOLUTIONS:
                if (section.data?.length > 0) {
                    processed.solutions = section.data;
                }
                break;
            case SECTION_KEYS.CTA_SECTION:
                if (section.data) {
                    processed.ctaSection = section.data;
                }
                break;
            case SECTION_KEYS.RESOURCES_HERO:
                if (section.data) {
                    processed.resourcesHero = section.data;
                }
                break;
            case SECTION_KEYS.CONTACT_HERO:
                if (section.data) {
                    processed.contactHero = section.data;
                }
                break;
            case SECTION_KEYS.PRIVACY_POLICY:
                if (section.data) {
                    processed.privacyPolicy = section.data;
                }
                break;
        }
    });

    return processed;
}

/**
 * Process insights data into wants and difficulties
 */
export function processInsights(insights: InsightItem[] | null) {
    if (!insights || insights.length === 0) {
        return { wants: null, difficulties: null };
    }

    const wants = insights
        .filter(item => item.section === INSIGHT_SECTIONS.WANTS);

    const difficulties = insights
        .filter(item => item.section === INSIGHT_SECTIONS.DIFFICULTIES);

    return {
        wants: wants.length > 0 ? wants : null,
        difficulties: difficulties.length > 0 ? difficulties : null
    };
}
