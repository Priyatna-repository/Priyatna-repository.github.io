"use client"
import React from 'react';
import { useSearchStore } from '@/store/searchStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../core/Tabs';

export default function ResultsView() {
  const { query, goHome, runSearch, theme } = useSearchStore();

  return (
    <div id="results-view" className={`show rv-${theme}`}>
      {/* TOPBAR */}
      <div className="results-topbar">
        <div className="rtb-logo" onClick={goHome}>PRI<span>.</span></div>
        <div className="search-bar-inline">
          <input className="sbi-input" defaultValue={query} />
          <button className="sbi-btn">↗</button>
        </div>
      </div>

      {/* TABS MENU (Variant Line - Pure CSS) */}
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

        {/* Layout Utama ditaruh di dalam TabsContent atau di bawahnya */}
        <TabsContent value="all">
          <div className="results-layout">
             <div className="results-main">
                {/* Hasil pencarian Anda */}
             </div>
             {/* Sidebar Anda */}
          </div>
        </TabsContent>
        
        {/* Content untuk tab hanya menampilkan project */}
        <TabsContent value="projects">
           <div className="results-layout">Hanya menampilkan Proyek...</div>
        </TabsContent>

          {/* Content untuk tab hanya menampilkan lab tools */}
        <TabsContent value="labs">
           <div className="results-layout">Hanya menampilkan Lab Tools...</div>
        </TabsContent>

          {/* Content untuk tab hanya menampilkan motion */}
        <TabsContent value="motion">
           <div className="results-layout">Hanya menampilkan Motion...</div>
        </TabsContent>

          {/* Content untuk tab hanya menampilkan branding */}
        <TabsContent value="branding">
           <div className="results-layout">Hanya menampilkan Branding...</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
