"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface Issue {
  id: number;
  title: string;
  status: "Pending" | "In Progress" | "Resolved";
  severity: "Low" | "Medium" | "High";
  region: string;
  createdBy: string;
  userId: string;
  email: string;
}

interface IssueContextType {
  issues: Issue[];
  addIssue: (issue: Issue) => void;
  updateStatus: (id: number, status: Issue["status"]) => void;
  deleteIssue: (id: number) => void;
}

const IssueContext = createContext<IssueContextType | null>(null);

export function IssueProvider({ children }: { children: React.ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("issues");

    if (stored) {
      const parsed = JSON.parse(stored);

      if (parsed.length > 0) {
        setIssues(parsed);
        return;
      }
    }

    // 🔥 Always seed if empty
    const demoIssues: Issue[] = [
      {
        id: 1001,
        title: "Garbage not collected for 3 days",
        status: "Pending",
        severity: "High",
        region: "North Zone",
        createdBy: "Rahul Sharma",
        userId: "rahul@gmail.com",
        email: "rahul@gmail.com",
      },
      {
        id: 1002,
        title: "Street light flickering",
        status: "In Progress",
        severity: "Medium",
        region: "South Zone",
        createdBy: "Anita Verma",
        userId: "anita@gmail.com",
        email: "anita@gmail.com",
      },
      {
        id: 1003,
        title: "False complaint about loud music",
        status: "Pending",
        severity: "Low",
        region: "East Zone",
        createdBy: "Fake User",
        userId: "fake@gmail.com",
        email: "fake@gmail.com",
      },
    ];

    localStorage.setItem("issues", JSON.stringify(demoIssues));
    setIssues(demoIssues);
  }, []);

  useEffect(() => {
    localStorage.setItem("issues", JSON.stringify(issues));
  }, [issues]);

  const addIssue = (issue: Issue) => {
    setIssues((prev) => [issue, ...prev]);
  };

  const updateStatus = (id: number, status: Issue["status"]) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, status } : issue
      )
    );
  };

  const deleteIssue = (id: number) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== id));
  };

  return (
    <IssueContext.Provider
      value={{ issues, addIssue, updateStatus, deleteIssue }}
    >
      {children}
    </IssueContext.Provider>
  );
}

export function useIssues() {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error("useIssues must be used inside IssueProvider");
  }
  return context;
}