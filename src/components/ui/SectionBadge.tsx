import React from "react";
import { cn } from "@/lib/utils";

interface SectionBadgeProps {
    children: React.ReactNode;
    className?: string; // Allow override if absolutely necessary
}

const SectionBadge: React.FC<SectionBadgeProps> = ({ children, className }) => {
    return (
        <span className={cn(
            "bg-[#59B4E9] !text-white text-lg font-bold px-4 py-1 rounded-full uppercase mb-4 inline-block w-fit tracking-[0.1em]",
            className
        )}>
            {children}
        </span>
    );
};

export default SectionBadge;
