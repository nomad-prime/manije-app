"use client";

import { motion } from "framer-motion";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const jobs = [
  { id: 1, title: "Research", color: "bg-teal-600" },
  { id: 2, title: "Analysis", color: "bg-yellow-300" },
  { id: 3, title: "Design", color: "bg-white" },
  { id: 4, title: "Prototype", color: "bg-white" },
  { id: 5, title: "Launch", color: "bg-white" },
  { id: 6, title: "Feedback", color: "bg-white" },
  { id: 7, title: "Iteration", color: "bg-white" },
  { id: 8, title: "Finalization", color: "bg-white" },
  { id: 9, title: "Delivery", color: "bg-white" },
  { id: 10, title: "Support", color: "bg-white" },
  { id: 11, title: "Maintenance", color: "bg-white" },
  { id: 12, title: "Retirement", color: "bg-white" },
];

export default function Jobs() {
  return (
    <ScrollArea className="gap-4 h-lvh w-full p-2">
      <div className="gap-4 flex flex-col items-center justify-start">
        {jobs.map((card) => (
          <motion.div key={card.id}>
            <Card className="w-64">
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
}
