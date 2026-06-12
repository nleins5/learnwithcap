import React from "react";
import Link from "next/link";
import SectionBadge from "@/components/ui/SectionBadge";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import Counter from "@/components/ui/Counter";

interface CoursesProps {
    courses: any[];
}

const Courses = ({ courses }: CoursesProps) => {
    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('.reveal-piano');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [courses]);

    return (
        <>
            {courses.map((course, idx) => (
                <section
                    key={idx}
                    className={`${idx === 0 ? "bg-[#002A4C]" : idx % 2 !== 0 ? "bg-[#001e3d]" : "bg-[#002A4C]"
                        } py-10 text-white`}
                >
                    <div className="container mx-auto px-5 md:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-[3fr_7fr] gap-16 items-center">
                            <div className="section-header reveal-staggered">
                                <SectionBadge className="mb-2.5">
                                    KHÓA HỌC
                                </SectionBadge>
                                <div className="font-bold mb-3 whitespace-pre-line">
                                    <AnimatedHeading
                                        text={course.type}
                                        tag="h2"
                                        className="text-sub-h2"
                                        fillColor="#ffffff"
                                        ghostColor="rgba(255, 255, 255, 0.2)"
                                    />
                                </div>
                                <div className="flex gap-12 mt-6 mb-8 border-b border-white/10 pb-6">
                                    <div>
                                        <Counter value={course.stats?.left} className="text-3xl font-bold block" />
                                        <span className="text-xs text-white/60 uppercase">
                                            {course.stats?.leftLabel}
                                        </span>
                                    </div>
                                    <div>
                                        <Counter value={course.stats?.right} className="text-3xl font-bold block" />
                                        <span className="text-xs text-white/60 uppercase">
                                            {course.stats?.rightLabel}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-4 mb-8">
                                    <button className="px-6 py-2 bg-white text-[#002A4C] font-bold rounded text-sm hover:bg-gray-100 transition">
                                        {course.cta1_label || "Tư Vấn Ngay"}
                                    </button>
                                    <Link
                                        href={course.cta2_link || "/course-detail"}
                                        className="px-6 py-2 border border-white text-white font-bold rounded text-sm hover:bg-white/10 transition block"
                                    >
                                        {course.cta2_label || "Xem Chi Tiết"}
                                    </Link>
                                </div>
                            </div>
                            <div className="!text-[19px] text-white/80 space-y-4 max-w-2xl mx-auto leading-relaxed">
                                <p dangerouslySetInnerHTML={{ __html: course.desc1 }} />
                                <p dangerouslySetInnerHTML={{ __html: course.desc2 }} />
                                <button className="mt-4 px-6 py-2 bg-[#59B4E9] text-white font-bold rounded text-sm hover:bg-[#3690F8] transition">
                                    Tư Vấn Ngay
                                </button>
                            </div>
                        </div>
                        <div className="flex overflow-x-auto gap-8 mt-6 reveal-piano pb-8 scrollbar-hide snap-x pr-4">
                            {course.modules?.map((mod: any, mIdx: number) => (
                                <div key={mIdx} className="group cursor-pointer piano-item min-w-[85vw] md:min-w-0 md:w-[calc((100%-4rem)/3)] snap-start flex-shrink-0">
                                    <div className="aspect-[5/3] bg-gray-800 rounded-2xl overflow-hidden relative shadow-lg">
                                        <img
                                            src={mod.img}
                                            alt={mod.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    <h4 className="text-white text-center mt-4 tracking-wider">
                                        {mod.title}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ))}
        </>
    );
};

export default Courses;
