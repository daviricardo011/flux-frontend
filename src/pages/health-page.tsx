"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DailyLog } from "@/components/daily-log"
import { HealthDashboard } from "@/components/health-dashboard"
import { HealthTimeline } from "@/components/health-timeline"
import { Activity, BarChart3, FileText } from "lucide-react"

export function HealthPage() {
  const [activeTab, setActiveTab] = useState("log")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Health & Journal</h1>
        <p className="text-white/60">Track your wellness journey</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass border-white/10 h-12 p-1 w-full md:w-auto">
          <TabsTrigger
            value="log"
            className="flex items-center gap-2 data-[state=active]:bg-[#22D3EE]/20 data-[state=active]:text-[#22D3EE]"
          >
            <FileText className="w-4 h-4" />
            Daily Log
          </TabsTrigger>
          <TabsTrigger
            value="dashboard"
            className="flex items-center gap-2 data-[state=active]:bg-[#22D3EE]/20 data-[state=active]:text-[#22D3EE]"
          >
            <BarChart3 className="w-4 h-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger
            value="timeline"
            className="flex items-center gap-2 data-[state=active]:bg-[#22D3EE]/20 data-[state=active]:text-[#22D3EE]"
          >
            <Activity className="w-4 h-4" />
            Timeline
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="log" className="mt-0">
            <DailyLog />
          </TabsContent>

          <TabsContent value="dashboard" className="mt-0">
            <HealthDashboard />
          </TabsContent>

          <TabsContent value="timeline" className="mt-0">
            <HealthTimeline />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
