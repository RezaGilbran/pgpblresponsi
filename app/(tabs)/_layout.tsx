import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      {/* EXPLORE */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />

      {/* FORM INPUT */}
      <Tabs.Screen
        name="forminput"
        options={{
          title: "Input",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="pencil.circle.fill" color={color} />
          ),
        }}
      />

      {/* LIST DATA */}
      <Tabs.Screen
        name="listPengunjung"
        options={{
          title: "Data",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.3.fill" color={color} />
          ),
        }}
      />

      {/* MAP SCREEN — WAJIB NAME SESUAI FILE: map.tsx */}
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="map.fill" color={color} />
          ),
        }}
      />

      {/* EDIT DATA (HIDDEN) */}
      <Tabs.Screen
        name="editPengunjung"
        options={{
          href: null,
          title: "Edit Data",
        }}
      />

      {/* FORM WISATA (HIDDEN) */}
      <Tabs.Screen
        name="formwisata"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
