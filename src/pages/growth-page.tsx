import { GamificationHeader } from "../components/gamification-header"
import { HabitsInteractiveList } from "../components/habits-interactive-list"
import { AchievementsSection } from "../components/achievements-section"

export function GrowthPage() {
  return (
    <div className="space-y-6">
      {/* Gamification Header */}
      <GamificationHeader />

      {/* Habits List */}
      <HabitsInteractiveList />

      {/* Achievements Section */}
      <AchievementsSection />
    </div>
  )
}
