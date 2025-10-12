'use client';

import { useState, useRef, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

type AnnouncementType = 'success' | 'alert';

interface AnnouncementCardProps {
  type: AnnouncementType;
  title: string;
  children: React.ReactNode;
}

const announcementStyles = {
  success: {
    icon: <CheckCircleIcon className="h-8 w-8 text-green-500" />,
    borderColor: 'border-green-500',
  },
  alert: {
    icon: <XCircleIcon className="h-8 w-8 text-red-500" />,
    borderColor: 'border-red-500',
  },
};

export default function AnnouncementCard({ type, title, children }: AnnouncementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const styles = announcementStyles[type];

  useEffect(() => {
    if (contentRef.current && contentRef.current.scrollHeight > contentRef.current.clientHeight) {
      setIsClamped(true);
    } else {
      setIsClamped(false);
    }
  }, [children]); 

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`rounded-lg border bg-white shadow-sm border-l-4 ${styles.borderColor} overflow-hidden`}>
      <div className="flex items-start gap-4 p-4">
        <div className="flex-shrink-0 pt-1">{styles.icon}</div>
        <div className="flex-grow">
          <strong className="block font-bold text-tu-navy">{title}</strong>
          <div
            ref={contentRef} 
            className={`mt-1 text-sm text-gray-600 transition-all duration-300 ${!isExpanded ? 'line-clamp-2' : ''}`}
          >
            {children}
          </div>
        </div>
      </div>
      
      {isClamped && (
        <button 
          onClick={toggleExpansion}
          className="flex w-full items-center justify-center gap-1 bg-gray-50 p-2 text-xs font-medium text-gray-600 hover:bg-gray-100 focus:outline-none"
        >
          <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
          <ChevronDownIcon className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
}

