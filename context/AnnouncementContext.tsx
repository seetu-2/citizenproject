"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Announcement = {
  id: number;
  message: string;
  author: string;
};

type AnnouncementContextType = {
  announcements: Announcement[];
  addAnnouncement: (announcement: Announcement) => void;
};

const AnnouncementContext = createContext<AnnouncementContextType | null>(null);

export const AnnouncementProvider = ({ children }: { children: React.ReactNode }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("announcements") || "[]");
    setAnnouncements(stored);
  }, []);

  const addAnnouncement = (announcement: Announcement) => {
    const updated = [announcement, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem("announcements", JSON.stringify(updated));
  };

  return (
    <AnnouncementContext.Provider value={{ announcements, addAnnouncement }}>
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (!context) throw new Error("useAnnouncements must be used within Provider");
  return context;
};