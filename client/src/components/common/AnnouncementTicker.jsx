import React, { useEffect, useState } from 'react';
import { getAnnouncements } from '../../services/announcementService';
import { Megaphone, ChevronRight } from 'lucide-react';

const AnnouncementTicker = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAnnouncements();
        if (res.success && res.data.announcements) {
          setAnnouncements(res.data.announcements);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  if (announcements.length === 0) return null;

  const current = announcements[currentIndex];

  return (
    <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-brand-950 text-white px-4 py-2 flex items-center justify-between shadow-xs border-b border-brand-800/40 text-xs">
      <div className="flex items-center gap-2.5 overflow-hidden flex-1">
        <span className="px-2 py-0.5 rounded bg-brand-600 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 flex-shrink-0">
          <Megaphone className="w-3 h-3" /> Announcement
        </span>
        <div className="truncate font-medium text-slate-200">
          <span className="font-bold text-white mr-2">{current.title}:</span>
          <span>{current.content}</span>
        </div>
      </div>

      {announcements.length > 1 && (
        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono ml-4 flex-shrink-0">
          <span>{currentIndex + 1} / {announcements.length}</span>
        </div>
      )}
    </div>
  );
};

export default AnnouncementTicker;
