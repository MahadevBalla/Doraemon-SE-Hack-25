
import { useState } from "react";
import { BarChart, LineChart, PieChart, Download, Filter, Calendar, Brain } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  BarChart as RechartBarChart,
  LineChart as RechartLineChart,
  PieChart as RechartPieChart,
  Bar,
  Line,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import { useToast } from "@/hooks/use-toast";

// Sample data for charts
const stockTrendData = [
  { month: "Jan", value: 12000 },
  { month: "Feb", value: 19000 },
  { month: "Mar", value: 14000 },
  { month: "Apr", value: 22000 },
  { month: "May", value: 25000 },
  { month: "Jun", value: 23000 },
];

const itemMovementData = [
  { day: "Mon", incoming: 12, outgoing: 8 },
  { day: "Tue", incoming: 18, outgoing: 14 },
  { day: "Wed", incoming: 15, outgoing: 12 },
  { day: "Thu", incoming: 20, outgoing: 18 },
  { day: "Fri", incoming: 25, outgoing: 20 },
  { day: "Sat", incoming: 10, outgoing: 8 },
  { day: "Sun", incoming: 5, outgoing: 3 },
];

const categoryDistributionData = [
  { name: "Electronics", value: 400, fill: "#0088FE" },
  { name: "Office Supplies", value: 300, fill: "#00C49F" },
  { name: "Furniture", value: 200, fill: "#FFBB28" },
  { name: "Food", value: 150, fill: "#FF8042" },
  { name: "Pharmaceutical", value: 100, fill: "#8884d8" },
];

// AI-generated insights
const aiInsights = {
  summary: "In the period from March 1 to April 19, 2025, your inventory performance showed several notable trends. Overall stock value increased by 15.2%, with Electronics being your strongest category (+22.3%).",
  bulletPoints: [
    "3 items reached low stock levels across all warehouses",
    "Warehouse C is operating at 95% capacity and may need expansion soon",
    "You processed 247 incoming and 198 outgoing movements this period",
    "Blue Widgets showed the highest turnover rate, followed by Red Gadgets",
    "12 units were disposed of due to expiry, representing a 0.8% loss"
  ],
  recommendation: "Consider increasing the reorder threshold for Blue Widgets by 15% to avoid stockouts, and conduct a stock rotation in Warehouse C to optimize space utilization."
};

const Analytics = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const { toast } = useToast();

  const handleExportPDF = () => {
    toast({
      title: "PDF Export Started",
      description: "Your analytics report is being generated.",
    });
    // In a real app, this would generate and download a PDF
  };

  const handleGenerateInsights = () => {
    setIsGeneratingReport(true);

    // Simulate AI processing delay
    setTimeout(() => {
      setIsGeneratingReport(false);
      toast({
        title: "AI Analysis Complete",
        description: "Smart summary has been generated based on your data.",
      });
    }, 2000);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            View insights and performance metrics for your inventory
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="smart-summary">Smart Summary</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">Stock Value Trend</h3>
              </div>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBarChart
                    data={stockTrendData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Stock Value']} />
                    <Bar dataKey="value" fill="#8884d8" name="Stock Value ($)" />
                  </RechartBarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <LineChart className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">Item Movement</h3>
              </div>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartLineChart
                    data={itemMovementData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="incoming" stroke="#8884d8" name="Incoming" />
                    <Line type="monotone" dataKey="outgoing" stroke="#82ca9d" name="Outgoing" />
                  </RechartLineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">Category Distribution</h3>
              </div>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartPieChart>
                    <Pie
                      data={categoryDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} units`, name]} />
                  </RechartPieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="smart-summary">
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Brain className="h-5 w-5 text-primary" />
                AI-Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              <div className="grid gap-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aiDateRange">Date Range</Label>
                    <Select defaultValue="30days">
                      <SelectTrigger id="aiDateRange" className="mt-1">
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">Last 7 days</SelectItem>
                        <SelectItem value="30days">Last 30 days</SelectItem>
                        <SelectItem value="90days">Last 90 days</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="aiWarehouse">Warehouse</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="aiWarehouse" className="mt-1">
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Warehouses</SelectItem>
                        <SelectItem value="wh-1">Warehouse A</SelectItem>
                        <SelectItem value="wh-2">Warehouse B</SelectItem>
                        <SelectItem value="wh-3">Warehouse C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  onClick={handleGenerateInsights}
                  disabled={isGeneratingReport}
                >
                  {isGeneratingReport ? (
                    <>Generating Insights...</>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Smart Summary
                    </>
                  )}
                </Button>
              </div>

              <div className="border border-dashed rounded-md p-6">
                <div className="mb-4">
                  <div className="text-xl font-medium mb-2">Summary</div>
                  <p className="text-muted-foreground">{aiInsights.summary}</p>
                </div>

                <div className="mb-4">
                  <div className="text-xl font-medium mb-2">Key Findings</div>
                  <ul className="list-disc list-inside space-y-1">
                    {aiInsights.bulletPoints.map((point, index) => (
                      <li key={index} className="text-muted-foreground">{point}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xl font-medium mb-2">Recommendations</div>
                  <p className="text-muted-foreground">{aiInsights.recommendation}</p>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Custom Reports</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label>Report Type</Label>
                    <Select defaultValue="inventory">
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inventory">Inventory Status</SelectItem>
                        <SelectItem value="movement">Movement History</SelectItem>
                        <SelectItem value="value">Stock Value</SelectItem>
                        <SelectItem value="expiry">Expiry Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Date Range</Label>
                    <Select defaultValue="30days">
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">Last 7 days</SelectItem>
                        <SelectItem value="30days">Last 30 days</SelectItem>
                        <SelectItem value="90days">Last 90 days</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Warehouse</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Warehouses</SelectItem>
                        <SelectItem value="wh-1">Warehouse A</SelectItem>
                        <SelectItem value="wh-2">Warehouse B</SelectItem>
                        <SelectItem value="wh-3">Warehouse C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button>Generate Report</Button>

                <div className="border rounded-md p-6 flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                  <Filter className="h-12 w-12 mb-4 text-muted-foreground/50" />
                  <p className="text-center font-medium">Select report parameters and click "Generate Report" to create a custom report</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Analytics;
