import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Calendar, Clock, Plus, Trash2, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface ScheduledMessage {
  id: string;
  recipient: string;
  message: string;
  type: "SMS";
  scheduledDate: string;
  scheduledTime: string;
  status: "Scheduled" | "Sent" | "Cancelled";
}

export default function ScheduleMessage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [scheduledMessages, setScheduledMessages] = useState<
    ScheduledMessage[]
  >([
    {
      id: "2",
      recipient: "VIP Group",
      message: "Exclusive early access to our new collection starts tomorrow!",
      type: "SMS",
      scheduledDate: "2026-01-09",
      scheduledTime: "14:30",
      status: "Scheduled",
    },
  ]);

  const [newSchedule, setNewSchedule] = useState({
    recipient: "",
    message: "",
    type: "SMS" as const,
    scheduledDate: "",
    scheduledTime: "",
  });

  const handleScheduleMessage = () => {
    const scheduled: ScheduledMessage = {
      id: Date.now().toString(),
      ...newSchedule,
      status: "Scheduled",
    };
    setScheduledMessages([...scheduledMessages, scheduled]);
    setNewSchedule({
      recipient: "",
      message: "",
      type: "SMS",
      scheduledDate: "",
      scheduledTime: "",
    });
    setIsDialogOpen(false);
  };

  const handleCancelSchedule = (id: string) => {
    setScheduledMessages(
      scheduledMessages.map((msg) =>
        msg.id === id ? { ...msg, status: "Cancelled" as const } : msg
      )
    );
  };

  const handleDeleteSchedule = (id: string) => {
    setScheduledMessages(scheduledMessages.filter((msg) => msg.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-700";
      case "Sent":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (type: string) => {
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Schedule Messages
          </h1>
          <p className="text-gray-600 mt-1">
            Schedule messages to be sent at specific dates and times
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="size-4 mr-2" />
              Schedule Message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Message</DialogTitle>
              <DialogDescription>
                Set up a message to be sent automatically at your chosen time
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Group</Label>
                  <Select
                    value={newSchedule.recipient}
                    onValueChange={(value) =>
                      setNewSchedule({ ...newSchedule, recipient: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Contacts</SelectItem>
                      <SelectItem value="customers">Customers Group</SelectItem>
                      <SelectItem value="vip">VIP Group</SelectItem>
                      <SelectItem value="partners">Partners Group</SelectItem>
                      <SelectItem value="staff">Staff Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Message Type</Label>
                  <Select
                    value={newSchedule.type}
                    onValueChange={(value: any) =>
                      setNewSchedule({ ...newSchedule, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SMS">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message Content</Label>
                <Textarea
                  id="message"
                  placeholder="Type your scheduled message here..."
                  rows={5}
                  value={newSchedule.message}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, message: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">
                    <Calendar className="size-4 inline mr-2" />
                    Schedule Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newSchedule.scheduledDate}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        scheduledDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">
                    <Clock className="size-4 inline mr-2" />
                    Schedule Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={newSchedule.scheduledTime}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        scheduledTime: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleScheduleMessage}
              >
                Schedule Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {
                    scheduledMessages.filter((m) => m.status === "Scheduled")
                      .length
                  }
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="size-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {scheduledMessages.filter((m) => m.status === "Sent").length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="size-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {
                    scheduledMessages.filter((m) => m.status === "Cancelled")
                      .length
                  }
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Trash2 className="size-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scheduled Messages Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Scheduled Messages ({scheduledMessages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Scheduled Date/Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduledMessages.map((msg) => (
                  <TableRow key={msg.id}>
                    <TableCell className="font-medium">
                      {msg.recipient}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {msg.message}
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(msg.type)}>
                        {msg.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="size-3" />
                          {msg.scheduledDate}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="size-3" />
                          {msg.scheduledTime}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(msg.status)}>
                        {msg.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {msg.status === "Scheduled" && (
                          <>
                            <Button variant="ghost" size="icon">
                              <Edit className="size-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCancelSchedule(msg.id)}
                            >
                              <Trash2 className="size-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        {msg.status !== "Scheduled" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSchedule(msg.id)}
                          >
                            <Trash2 className="size-4 text-gray-600" />
                          </Button>
                        )}
                      </div>
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
