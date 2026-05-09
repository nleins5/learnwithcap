import { useState, useEffect } from "react";
import {
    fetchPageSections,
    fetchFooterData,
    fetchInsights,
    fetchTeam,
    fetchVisionMission,
    fetchResources,
    fetchHeroData,
    processPageSections,
    processInsights,
} from "@/lib/api";
import { 
    NavbarData, 
    FooterSettings as FooterData, 
    HeroData, 
    VisionMissionData,
    InsightItem,
    TeamMember,
    ResourceData
} from "@/lib/types";

// Mock data fallbacks for when database is empty
const MOCK_HERO = {
    title: "NÂNG TẦM KỸ NĂNG CÙNG LEARNWITHCAP",
    video_url: "https://lv-vod.wpscdn.com/wps-v/v/2024/04/15/1713174400.mp4",
    media_type: 'video' as const,
    images: []
};

const MOCK_SERVICES = [
    { title: "Kỹ sư & Kiến trúc sư", image: "https://course.learnwithcap.com/wp-content/uploads/2025/10/cap-logo-1.webp", href: "/courses" },
    { title: "Quản lý dự án", image: "https://course.learnwithcap.com/wp-content/uploads/2025/10/cap-logo-1.webp", href: "/courses" },
    { title: "Sinh viên & Newbie", image: "https://course.learnwithcap.com/wp-content/uploads/2025/10/cap-logo-1.webp", href: "/courses" },
    { title: "Kỹ sư MEP", image: "https://course.learnwithcap.com/wp-content/uploads/2025/10/cap-logo-1.webp", href: "/courses" },
    { title: "Kỹ sư Kết cấu", image: "https://course.learnwithcap.com/wp-content/uploads/2025/10/cap-logo-1.webp", href: "/courses" },
    { title: "Nhà thầu", image: "https://course.learnwithcap.com/wp-content/uploads/2025/10/cap-logo-1.webp", href: "/courses" },
    { title: "Chủ đầu tư", image: "https://course.learnwithcap.com/wp-content/uploads/2025/10/cap-logo-1.webp", href: "/courses" },
    { title: "Thiết kế nội thất", image: "https://course.learnwithcap.com/wp-content/uploads/2025/10/cap-logo-1.webp", href: "/courses" },
    { title: "Kỹ sư Hạ tầng", image: "https://course.learnwithcap.com/wp-content/uploads/2025/10/cap-logo-1.webp", href: "/courses" },
];

const MOCK_COURSES: any[] = [];
const MOCK_TESTIMONIALS: any[] = [];
const MOCK_CLIENTS: any[] = [];
const MOCK_SOLUTIONS: any[] = [];

export const usePageData = () => {
    // State initialized with empty values - mock data only used as fallback
    const [courses, setCourses] = useState<any[]>([]);
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [testimonialsHeader, setTestimonialsHeader] = useState<any>(null);
    const [solutions, setSolutions] = useState<any[]>([]);
    const [serviceItems, setServiceItems] = useState<any[]>([]);
    const [servicesHeader, setServicesHeader] = useState<any>(null);
    const [clients, setClients] = useState<any[]>([]);
    const [clientsHeader, setClientsHeader] = useState<any>(null);
    const [hero, setHero] = useState<HeroData | null>(null);
    const [navbar, setNavbar] = useState<NavbarData | null>(null);
    const [footer, setFooter] = useState<FooterData | null>(null);
    const [solutionsHeader, setSolutionsHeader] = useState<any>(null);
    const [wantsHeader, setWantsHeader] = useState<any>(null);
    const [difficultiesHeader, setDifficultiesHeader] = useState<any>(null);
    const [wants, setWants] = useState<InsightItem[]>([]);
    const [difficulties, setDifficulties] = useState<InsightItem[]>([]);
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [visionMission, setVisionMission] = useState<VisionMissionData | null>(null);
    const [ctaSection, setCtaSection] = useState<any>(null);
    const [resources, setResources] = useState<ResourceData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // Fetch all data in parallel for better performance
                const [
                    sectionsData,
                    footerData,
                    insightsData,
                    teamData,
                    visionMissionData,
                    resourcesData,
                    heroData
                ] = await Promise.all([
                    fetchPageSections(),
                    fetchFooterData(),
                    fetchInsights(),
                    fetchTeam(),
                    fetchVisionMission(),
                    fetchResources(),
                    fetchHeroData()
                ]);

                // Process page sections
                if (sectionsData && sectionsData.length > 0) {
                    const processed = processPageSections(sectionsData);

                    setCourses(processed.courses || MOCK_COURSES);
                    setTestimonials(processed.testimonials || MOCK_TESTIMONIALS);
                    setTestimonialsHeader(processed.testimonialsHeader || { title: '', subtitle: '' });
                    setServiceItems(processed.serviceItems || MOCK_SERVICES);
                    setServicesHeader(processed.servicesHeader || { title: 'BẠN LÀ', subtitle: '' });
                    setClients(processed.clients || MOCK_CLIENTS);
                    setClientsHeader(processed.clientsHeader || { title: '', subtitle: '' });
                    setHero(heroData || processed.hero || MOCK_HERO);
                    setSolutionsHeader(processed.solutionsHeader || { title: '', subtitle: '' });
                    setWantsHeader(processed.wantsHeader || { title: '', subtitle: '' });
                    setDifficultiesHeader(processed.difficultiesHeader || { title: '', subtitle: '' });
                    setSolutions(processed.solutions || MOCK_SOLUTIONS);
                    setCtaSection(processed.ctaSection);

                    // Process navbar
                    if (processed.navbar) {
                        setNavbar(processed.navbar);
                    }
                } else {
                    // Fallback to all mock data if sectionsData is null or empty
                    setCourses(MOCK_COURSES);
                    setTestimonials(MOCK_TESTIMONIALS);
                    setServiceItems(MOCK_SERVICES);
                    setClients(MOCK_CLIENTS);
                    setHero(heroData || MOCK_HERO);
                    setSolutions(MOCK_SOLUTIONS);
                }

                // Process footer
                if (footerData) {
                    setFooter(footerData);
                }

                // Process insights
                const { wants: wantsData, difficulties: difficultiesData } = processInsights(insightsData);
                setWants(wantsData || []);
                setDifficulties(difficultiesData || []);

                // Process team
                setTeam(teamData || []);

                // Process vision & mission
                setVisionMission(visionMissionData || null);

                // Process resources
                setResources(resourcesData || []);
            } catch (error) {
                console.error("Error fetching page data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    return {
        courses,
        testimonials,
        testimonialsHeader,
        solutions,
        serviceItems,
        servicesHeader,
        clients,
        clientsHeader,
        hero,
        navbar,
        footer,
        solutionsHeader,
        wantsHeader,
        difficultiesHeader,
        wants,
        difficulties,
        team,
        visionMission,
        resources,
        ctaSection,
        loading
    };
};
