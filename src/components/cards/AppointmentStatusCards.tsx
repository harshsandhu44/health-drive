"use client";

import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AppointmentStats {
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

interface AppointmentStatusCardsProps {
  stats: AppointmentStats;
  isLoading?: boolean;
}

export function AppointmentStatusCards({
  stats,
  isLoading = false,
}: AppointmentStatusCardsProps) {
  const cards = [
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      title: "Confirmed",
      value: stats.confirmed,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Card key={`skeleton-${i}`} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-16 rounded bg-gray-200"></div>
              </CardTitle>
              <div className="h-4 w-4 rounded bg-gray-200"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-12 rounded bg-gray-200"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className={`${card.borderColor} ${card.bgColor}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
              <p className="mt-1 text-xs text-gray-600 capitalize">
                {card.title.toLowerCase()} appointments
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
