'use client'
import { useSearchStore } from '@/store/searchStore'
import { useUIStore } from '@/store/uiStore'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'

export default function ResultsView() {
  const { query, goHome } = useSearchStore()
  const theme = useUIStore((s) => s.theme)

  return (
    <div id="results-view" className={`show rv-${theme}`}>
      <div className="results-topbar">
        <div className="rtb-logo" onClick={goHome}>
          PRI<span>.</span>
        </div>
        <div className="search-bar-inline">
          <input className="sbi-input" defaultValue={query} />
          <button className="sbi-btn">↗</button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <div className="tabs-wrapper">
          <TabsList>
            <TabsTrigger value="all">ALL</TabsTrigger>
            <TabsTrigger value="projects">PROJECTS</TabsTrigger>
            <TabsTrigger value="labs">LAB TOOLS</TabsTrigger>
            <TabsTrigger value="motion">MOTION</TabsTrigger>
            <TabsTrigger value="branding">BRANDING</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all">
          <div className="results-layout">
            <div className="results-main">{/* Search results */}</div>
          </div>
        </TabsContent>
        <TabsContent value="projects">
          <div className="results-layout">Hanya menampilkan Proyek...berdasarkan pencarian</div>
        </TabsContent>
        <TabsContent value="labs">
          <div className="results-layout">Hanya menampilkan Lab Tools...berdasarkan pencarian</div>
        </TabsContent>
        <TabsContent value="motion">
          <div className="results-layout">Hanya menampilkan Motion...berdasarkan pencarian</div>
        </TabsContent>
        <TabsContent value="branding">
          <div className="results-layout">Hanya menampilkan Branding...berdasarkan pencarian</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
