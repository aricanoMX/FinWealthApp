import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme/theme';

function TabBarIcon({
  name,
  color,
  size,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  size: number;
}) {
  return <Ionicons name={name} size={size} color={color} />;
}

const DashboardIcon = ({ color, size }: { color: string; size: number }) => (
  <TabBarIcon name="stats-chart" size={size} color={color} />
);

const TransactionsIcon = ({ color, size }: { color: string; size: number }) => (
  <TabBarIcon name="swap-horizontal" size={size} color={color} />
);

const ReportsIcon = ({ color, size }: { color: string; size: number }) => (
  <TabBarIcon name="analytics" size={size} color={color} />
);

const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <TabBarIcon name="person" size={size} color={color} />
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.primary,
          borderTopWidth: 0.5,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: DashboardIcon,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transacciones',
          tabBarIcon: TransactionsIcon,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reportes',
          tabBarIcon: ReportsIcon,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tabs>
  );
}
