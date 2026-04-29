"use client"
import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

export const Tabs = TabsPrimitive.Root;

export const TabsList = ({ children }: { children: React.ReactNode }) => (
  <TabsPrimitive.List className="tabs-list-line">
    {children}
  </TabsPrimitive.List>
);

export const TabsTrigger = ({ value, children }: { value: string, children: React.ReactNode }) => (
  <TabsPrimitive.Trigger value={value} className="tabs-trigger-line">
    {children}
  </TabsPrimitive.Trigger>
);

export const TabsContent = TabsPrimitive.Content;