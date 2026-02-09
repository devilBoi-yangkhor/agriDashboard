"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Mail,
  Users,
  Landmark,
  TrendingUp,
  Activity,
  Download,
  Calendar,
} from "lucide-react";

// Import chart components
import { ChartAreaInteractive } from "./AreaChart";
import { PieChartSection } from "./PieChartSection";
import { ChartBarInteractive } from "./BarChart";

type UserDetails = {
  fullName: string;
  email: string;
  imageUrl: string;
  roles: string[];
};

type Email = {
  id: string;
  from_email: string;
  subject: string;
  snippet: string;
};

// Mock data for charts
const salesData = [
  { month: "Jan", sales: 4000, revenue: 2400 },
  { month: "Feb", sales: 3000, revenue: 1398 },
  { month: "Mar", sales: 9800, revenue: 2000 },
  { month: "Apr", sales: 3908, revenue: 2780 },
  { month: "May", sales: 4800, revenue: 1890 },
  { month: "Jun", sales: 3800, revenue: 2390 },
  { month: "Jul", sales: 4300, revenue: 3490 },
];

const trafficData = [
  { source: "Direct", visitors: 4000 },
  { source: "Social", visitors: 3000 },
  { source: "Referral", visitors: 2000 },
  { source: "Email", visitors: 2780 },
  { source: "Organic", visitors: 1890 },
];

const performanceData = [
  { metric: "CPU Usage", value: 65 },
  { metric: "Memory", value: 48 },
  { metric: "Disk", value: 82 },
  { metric: "Network", value: 34 },
];

export default function Home() {
  const [userDetails, setUserDetails] = useState<UserDetails>({
    fullName: "Loading...",
    email: "Loading...",
    imageUrl: "/images/user/default.jpg",
    roles: [],
  });

  const [emails, setEmails] = useState<Email[]>([
    {
      id: "1",
      from_email: "john@example.com",
      subject: "Quarterly Report Ready",
      snippet: "The Q3 financial report is now available for review...",
    },
    {
      id: "2",
      from_email: "sarah@company.com",
      subject: "Meeting Tomorrow",
      snippet: "Just confirming our 2 PM meeting tomorrow...",
    },
    {
      id: "3",
      from_email: "notifications@github.com",
      subject: "Repository Update",
      snippet: "Your pull request has been merged successfully...",
    },
  ]);

  // Mock KPIs data
  const kpiData = [
    {
      title: "Total Revenue",
      value: "Nu. 45,231.89",
      change: "+20.1%",
      icon: Landmark,
      trend: "up",
    },
    {
      title: "Active Users",
      value: "2,350",
      change: "+180.1%",
      icon: Users,
      trend: "up",
    },
    {
      title: "Emails Processed",
      value: "12,234",
      change: "+19%",
      icon: Mail,
      trend: "up",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+2.1%",
      icon: TrendingUp,
      trend: "up",
    },
  ];

  useEffect(() => {
    const loadUserDetails = () => {
      try {
        const storedUser = localStorage.getItem("userDetails");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          // Safely extract user roles - don't modify PermissionContext's data
          let userRoles: string[] = [];
          
          // Check if userRole exists and is an array
          if (parsedUser.userRole && Array.isArray(parsedUser.userRole)) {
            // Map roles safely without causing format errors
            userRoles = parsedUser.userRole
              .filter((role: any) => role && role.roles && role.roles.code)
              .map((role: any) => role.roles.code);
          }
          
          setUserDetails({
            fullName: parsedUser.username || parsedUser.fullName || "Guest User",
            email: parsedUser.email || "guest@example.com",
            imageUrl: "/images/user/jigme.png",
            roles: userRoles,
          });
        }
      } catch (error) {
        console.error("Error loading user details:", error);
        // Set minimal user info on error
        setUserDetails({
          fullName: "Guest User",
          email: "guest@example.com",
          imageUrl: "/images/user/default.jpg",
          roles: [],
        });
      }
    };

    loadUserDetails();
  }, []);

  // Get first name for greeting
  const firstName = userDetails.fullName.split(" ")[0];

  return (
    <DefaultLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome back, {firstName}
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your dashboard today.
            </p>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <div className="p-2 rounded-lg bg-primary/10">
                  <kpi.icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span
                    className={
                      kpi.trend === "up"
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {kpi.change}
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Monthly sales performance for the last 7 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartAreaInteractive data={salesData} />
              </div>
            </CardContent>
          </Card>

          {/* Traffic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors come from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <PieChartSection data={trafficData} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
              <CardDescription>Current resource utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ChartBarInteractive data={performanceData} />
              </div>
            </CardContent>
          </Card>

          {/* Recent Emails */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Emails</CardTitle>
              <CardDescription>
                {emails.length} unread messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emails.map((email) => (
                  <div
                    key={email.id}
                    className="flex items-start justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <p className="font-medium">{email.from_email}</p>
                        <span className="text-xs text-muted-foreground">
                          • 2 min ago
                        </span>
                      </div>
                      <h4 className="font-semibold">{email.subject}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {email.snippet}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEmails(emails.filter((e) => e.id !== email.id));
                      }}
                    >
                      Mark as read
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">2.4 min</div>
                <Activity className="h-4 w-4 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Customer Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">94.2%</div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Tasks Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">128/150</div>
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DefaultLayout>
  );
}