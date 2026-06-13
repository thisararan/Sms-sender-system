import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Plus,
  Search,
  Upload,
  Download,
  Pencil,
  Trash2,
  Users,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface Contact {
  id: string;
  name: string;
  phone: string;
  group: string;
  platform: "SMS";
}

export default function ContactsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    group: "",
    platform: "SMS" as const,
  });

  // Load contacts from API on mount
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const response = await api.contacts.list();

      if (response.success && response.data) {
        const formattedContacts = (response.data || []).map((contact: any) => ({
          id: contact.id.toString(),
          name: contact.name,
          phone: contact.phone,
          group: contact.group || "General",
          platform: "SMS" as const,
        }));
        setContacts(formattedContacts);
      } else {
        console.warn("No contacts returned from API");
      }
    } catch (error) {
      console.error("Failed to load contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = async () => {
    setFormError(null);
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      setFormError("Name and phone number are required.");
      return;
    }

    try {
      const response = await api.contacts.create({
        name: newContact.name,
        phone: newContact.phone,
        group: newContact.group || "General",
      });

      if (response.success && response.data) {
        setNewContact({ name: "", phone: "", group: "", platform: "SMS" });
        setIsAddDialogOpen(false);
        setSuccessMsg(`Contact "${response.data.name}" added successfully!`);
        setTimeout(() => setSuccessMsg(null), 4000);
        await loadContacts();
      } else {
        setFormError(response.message || "Failed to add contact.");
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to add contact.");
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm("Delete this contact?")) return;

    try {
      const response = await api.contacts.delete(parseInt(id));
      if (response.success) {
        setContacts(contacts.filter((c) => c.id !== id));
        setSuccessMsg("Contact deleted.");
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        alert(response.message || "Failed to delete contact.");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete contact.");
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      contact.group.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPlatformBadge = (platform: string) => {
    return "bg-blue-100 text-blue-700";
  };

  const groups = ["Customers", "VIP", "Partners", "Staff"];

  return (
    <div className="space-y-6">
      {successMsg && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="size-4 text-green-600" />
          <AlertDescription className="text-green-700">{successMsg}</AlertDescription>
        </Alert>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Contacts Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your contact list and organize into groups
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) setFormError(null); }}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="size-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
                <DialogDescription>
                  Enter the contact details to add them to your list
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {formError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="size-4 text-red-600" />
                    <AlertDescription className="text-red-700 text-sm">
                      {formError}
                    </AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Contact name"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 234 567 8900"
                    value={newContact.phone}
                    onChange={(e) =>
                      setNewContact({ ...newContact, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group">Group</Label>
                  <Select
                    value={newContact.group}
                    onValueChange={(value) =>
                      setNewContact({ ...newContact, group: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={newContact.platform}
                    onValueChange={(value: any) =>
                      setNewContact({ ...newContact, platform: value })
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
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleAddContact}
                >
                  Add Contact
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Contacts",
            value: contacts.length,
            color: "bg-blue-100 text-blue-700",
          },
          {
            label: "Customers",
            value: contacts.filter((c) => c.group === "Customers").length,
            color: "bg-green-100 text-green-700",
          },
          {
            label: "VIP",
            value: contacts.filter((c) => c.group === "VIP").length,
            color: "bg-purple-100 text-purple-700",
          },
          {
            label: "Partners",
            value: contacts.filter((c) => c.group === "Partners").length,
            color: "bg-orange-100 text-orange-700",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Users className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contacts Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>All Contacts ({filteredContacts.length})</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Upload className="size-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      {contact.name}
                    </TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{contact.group}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPlatformBadge(contact.platform)}>
                        {contact.platform}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Pencil className="size-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteContact(contact.id)}
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </Button>
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
