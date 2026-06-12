import React, { useState } from 'react';

import { ResourceData } from '@/lib/types';

interface ResourcesContentProps {
    resources: ResourceData[];
}

const ResourcesContent: React.FC<ResourcesContentProps> = ({ resources }) => {
    const [activeTab, setActiveTab] = useState<'all' | 'articles' | 'links'>('all');

    const apiCards: ResourceData[] = [
        { id: 101, type: 'api', title: 'Course API', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', read_time: 'API Guide', link: '#', description: 'The course API lets you create, view, update, and delete course data.', display_order: 1 },
        { id: 102, type: 'api', title: 'Topic API', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', read_time: 'API Guide', link: '#', description: 'The topic API allows you to create, view, update, and delete Tutor LMS course topics.', display_order: 2 },
        { id: 103, type: 'api', title: 'Lesson API', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', read_time: 'API Guide', link: '#', description: 'The lesson API lets you create, update, and delete lesson data.', display_order: 3 },
        { id: 104, type: 'api', title: 'Assignment API', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', read_time: 'API Guide', link: '#', description: 'Create, update, delete, and get assignment information by ID.', display_order: 4 },
        { id: 105, type: 'api', title: 'Quiz API', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', read_time: 'API Guide', link: '#', description: 'Create, update and delete quizzes as well as quiz questions.', display_order: 5 },
        { id: 106, type: 'api', title: 'Quiz Attempt API', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', read_time: 'API Guide', link: '#', description: 'Collect students quiz attempt data.', display_order: 6 },
        { id: 107, type: 'api', title: 'Enrollment API', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', read_time: 'API Guide', link: '#', description: 'Facilitates seamless onboarding of the users in a Tutor LMS course.', display_order: 7 },
        { id: 108, type: 'api', title: 'Wishlist API', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', read_time: 'API Guide', link: '#', description: 'Enables users to add courses to their wishlist.', display_order: 8 },
        { id: 109, type: 'api', title: 'Review API', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', read_time: 'API Guide', link: '#', description: 'Get the list of course reviews or add, delete, and update reviews.', display_order: 9 },
        { id: 110, type: 'api', title: 'Student Dashboard API', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', read_time: 'API Guide', link: '#', description: 'Access student dashboard data.', display_order: 10 },
        { id: 111, type: 'api', title: 'Calendar API', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', read_time: 'API Guide', link: '#', description: 'Access student calendar data.', display_order: 11 },
        { id: 112, type: 'api', title: 'Get Student Course List API', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', read_time: 'API Guide', link: '#', description: 'Get list of courses for a student.', display_order: 12 },
        { id: 113, type: 'api', title: 'Instructor API', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', read_time: 'API Guide', link: '#', description: 'Instructor related operations.', display_order: 13 },
        { id: 114, type: 'api', title: 'Order History API', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', read_time: 'API Guide', link: '#', description: 'Get student order history.', display_order: 14 },
        { id: 115, type: 'api', title: 'Profile Management API', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', read_time: 'API Guide', link: '#', description: 'Manage user profiles.', display_order: 15 },
        { id: 116, type: 'api', title: 'Q&A API', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', read_time: 'API Guide', link: '#', description: 'Get the student’s Q&A list and update, delete, or add new Q&A.', display_order: 16 },
    ];


    return (
        <div className="w-full bg-white pb-20">
            {/* Tabs Filter */}
            <div className="container mx-auto px-4 md:px-8 py-10">
                <div className="flex space-x-4 mb-8">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-6 py-2 rounded-md font-medium text-sm transition-all duration-300 ${activeTab === 'all'
                            ? 'bg-[#002855] text-white shadow-md'
                            : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        Tất Cả
                    </button>
                    <button
                        onClick={() => setActiveTab('articles')}
                        className={`px-6 py-2 rounded-md font-medium text-sm transition-all duration-300 ${activeTab === 'articles'
                            ? 'bg-[#002855] text-white shadow-md'
                            : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        Bài Viết
                    </button>
                    <button
                        onClick={() => setActiveTab('links')}
                        className={`px-6 py-2 rounded-md font-medium text-sm transition-all duration-300 ${activeTab === 'links'
                            ? 'bg-[#002855] text-white shadow-md'
                            : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        Links
                    </button>
                </div>

                {/* Grid Content */}
                {activeTab === 'all' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-4 md:px-6">
                        {apiCards.map((item) => (
                            <div key={item.id} className="group cursor-pointer flex flex-col h-full">
                                <div className="relative overflow-hidden rounded-lg aspect-[4/3] mb-4 bg-gray-100">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="text-xs text-gray-400 mb-2 font-medium">{item.read_time}</span>
                                    <h3 className="text-xl font-bold text-[#0b2b4d] group-hover:text-[#59B4E9] transition-colors leading-snug line-clamp-2">
                                        {item.title}
                                    </h3>
                                    {item.description && (
                                        <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : activeTab === 'articles' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-4 md:px-6">
                        {resources.map((item) => (
                            <div key={item.id} className="group cursor-pointer flex flex-col h-full">
                                <div className="relative overflow-hidden rounded-lg aspect-[4/3] mb-4 bg-gray-100">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="text-xs text-gray-400 mb-2 font-medium">{item.read_time}</span>
                                    <h3 className="text-xl font-bold text-[#0b2b4d] group-hover:text-[#59B4E9] transition-colors leading-snug line-clamp-2">
                                        {item.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center text-gray-500">
                        <p>Chưa có liên kết nào.</p>
                    </div>
                )}
            </div>
            {/* Floating Action Button (Scroll to top or Chat) - Optional, mimicking the blue circle in the content if implied */}
        </div>
    );
};

export default ResourcesContent;
