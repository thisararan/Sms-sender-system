import { useState, useEffect } from "react";
import { api } from "../../services/api";
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
import { Search, Download, Filter } from "lucide-react";
import { Button } from "./ui/button";

interface MessageLog {
  id: string;
  recipient: string;
  phone: string;
  message: string;
  type: "SMS";
  status: "Sent" | "Delivered" | "Pending" | "Failed";
  timestamp: string;
}

export default function MessageLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const [logs, setLogs] = useState<MessageLog[]>([]);

  // Load messages from API on mount
  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const response = await api.messages.list();
      if (response.ok) {
        const data = await response.json();
        const formattedLogs = (data.data || []).map((msg: any) => ({
          id: msg.id.toString(),
          recipient: "User",
          phone: msg.phone,
          message: msg.message,
          type: "SMS" as const,
          status: msg.status || "Pending",
          timestamp: msg.created_at || new Date().toISOString(),
        }));
        setLogs(formattedLogs);
      }
    } catch (error) {
      console.error("Failed to load message logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent":
        return "bg-blue-100 text-blue-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (type: string) => {
    return "bg-blue-100 text-blue-700";
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.phone.includes(searchQuery) ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "all" || log.type === filterType;
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: logs.length,
    sent: logs.filter((l) => l.status === "Sent").length,
    delivered: logs.filter((l) => l.status === "Delivered").length,
    pending: logs.filter((l) => l.status === "Pending").length,
    failed: logs.filter((l) => l.status === "Failed").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Message Logs & History
        </h1>
        <p className="text-gray-600 mt-1">View and track all sent messages</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.total}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Sent</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {stats.sent}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Delivered</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {stats.delivered}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {stats.pending}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Failed</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {stats.failed}
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
                placeholder="Search by recipient, phone, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Message Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="SMS">SMS Only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Sent">Sent</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full md:w-auto">
              <Download className="size-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Message Logs Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Message History ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {log.recipient}
                    </TableCell>
                    <TableCell className="text-gray-600">{log.phone}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {log.message}
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(log.type)}>
                        {log.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(log.status)}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {log.timestamp}
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
