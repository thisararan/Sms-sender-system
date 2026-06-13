import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Search,
  Download,
  Filter,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Button } from "./ui/button";

interface SystemLog {
  id: string;
  timestamp: string;
  level: "Info" | "Warning" | "Error" | "Success";
  category: string;
  message: string;
  user?: string;
}

export default function SystemLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const [logs, setLogs] = useState<SystemLog[]>([
    {
      id: "1",
      timestamp: "2026-01-06 14:35:22",
      level: "Info",
      category: "API",
      message: "SMS API connection established successfully",
      user: "System",
    },
    {
      id: "2",
      timestamp: "2026-01-06 14:30:15",
      level: "Success",
      category: "Message",
      message: "Bulk message campaign sent to 2,156 recipients",
      user: "john.doe@example.com",
    },
    {
      id: "3",
      timestamp: "2026-01-06 14:25:48",
      level: "Warning",
      category: "Rate Limit",
      message: "User #1234 approaching hourly rate limit (950/1000)",
      user: "System",
    },
    {
      id: "5",
      timestamp: "2026-01-06 14:15:12",
      level: "Info",
      category: "User",
      message: "New user registered: alice.w@example.com",
      user: "admin@example.com",
    },
    {
      id: "6",
      timestamp: "2026-01-06 14:10:45",
      level: "Success",
      category: "Message",
      message: "Scheduled message sent to VIP group (342 recipients)",
      user: "System",
    },
    {
      id: "7",
      timestamp: "2026-01-06 14:05:28",
      level: "Warning",
      category: "Database",
      message: "Database query took longer than expected (2.5s)",
      user: "System",
    },
    {
      id: "8",
      timestamp: "2026-01-06 14:00:10",
      level: "Info",
      category: "Auth",
      message: "User logged in: john.doe@example.com",
      user: "john.doe@example.com",
    },
    {
      id: "9",
      timestamp: "2026-01-06 13:55:42",
      level: "Error",
      category: "Message",
      message: "Failed to send message: Invalid phone number format",
      user: "jane.smith@example.com",
    },
    {
      id: "10",
      timestamp: "2026-01-06 13:50:15",
      level: "Success",
      category: "API",
      message: "API credentials updated successfully",
      user: "admin@example.com",
    },
    {
      id: "11",
      timestamp: "2026-01-06 13:45:33",
      level: "Info",
      category: "System",
      message: "Daily backup completed successfully",
      user: "System",
    },
    {
      id: "12",
      timestamp: "2026-01-06 13:40:22",
      level: "Warning",
      category: "Storage",
      message: "Storage usage at 75% capacity",
      user: "System",
    },
  ]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Info":
        return <Info className="size-4" />;
      case "Success":
        return <CheckCircle className="size-4" />;
      case "Warning":
        return <AlertTriangle className="size-4" />;
      case "Error":
        return <AlertCircle className="size-4" />;
      default:
        return null;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Info":
        return "bg-blue-100 text-blue-700";
      case "Success":
        return "bg-green-100 text-green-700";
      case "Warning":
        return "bg-yellow-100 text-yellow-700";
      case "Error":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.user && log.user.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLevel = filterLevel === "all" || log.level === filterLevel;
    const matchesCategory =
      filterCategory === "all" || log.category === filterCategory;

    return matchesSearch && matchesLevel && matchesCategory;
  });

  const stats = {
    total: logs.length,
    info: logs.filter((l) => l.level === "Info").length,
    success: logs.filter((l) => l.level === "Success").length,
    warning: logs.filter((l) => l.level === "Warning").length,
    error: logs.filter((l) => l.level === "Error").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
        <p className="text-gray-600 mt-1">
          Monitor system activities and troubleshoot issues
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Logs</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.total}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Info</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {stats.info}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Success</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {stats.success}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Warnings</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {stats.warning}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Errors</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {stats.error}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search logs by message, category, or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Log Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Info">Info</SelectItem>
                <SelectItem value="Success">Success</SelectItem>
                <SelectItem value="Warning">Warning</SelectItem>
                <SelectItem value="Error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="API">API</SelectItem>
                <SelectItem value="Message">Message</SelectItem>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Auth">Auth</SelectItem>
                <SelectItem value="System">System</SelectItem>
                <SelectItem value="Database">Database</SelectItem>
                <SelectItem value="Storage">Storage</SelectItem>
                <SelectItem value="Rate Limit">Rate Limit</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full md:w-auto">
              <Download className="size-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Logs Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Activity Logs ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>
                      <Badge className={getLevelColor(log.level)}>
                        {getLevelIcon(log.level)}
                        <span className="ml-1">{log.level}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.category}</Badge>
                    </TableCell>
                    <TableCell className="max-w-md">{log.message}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {log.user}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
