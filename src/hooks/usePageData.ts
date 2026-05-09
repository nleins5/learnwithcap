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
                if (sectionsData) {
                    const processed = processPageSections(sectionsData);

                    setCourses(processed.courses || []);
                    setTestimonials(processed.testimonials || []);
                    setTestimonialsHeader(processed.testimonialsHeader);
                    setServiceItems(processed.serviceItems || []);
                    setServicesHeader(processed.servicesHeader);
                    setClients(processed.clients || []);
                    setClientsHeader(processed.clientsHeader);
                    setHero(heroData || processed.hero || null);
                    setSolutionsHeader(processed.solutionsHeader);
                    setWantsHeader(processed.wantsHeader);
                    setDifficultiesHeader(processed.difficultiesHeader);
                    setSolutions(processed.solutions || []);
                    setCtaSection(processed.ctaSection);

                    // Process navbar
                    if (processed.navbar) {
                        setNavbar(processed.navbar);
                    }
                } else {
                    // Fallback to all mock data if sectionsData is null
                    setCourses(MOCK_COURSES);
                    setTestimonials(MOCK_TESTIMONIALS);
                    setServiceItems(MOCK_SERVICES);
                    setClients(MOCK_CLIENTS);
                    setHero(MOCK_HERO);
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
