import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { smsStore } from "../../services/smsStore";
import type { AdminNumber } from "../../services/smsStore";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Send,
  Phone,
  Users,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Settings,
  Search,
  X,
  MessageCircle,
} from "lucide-react";

const TEMPLATES: Record<string, string> = {
  welcome:
    "Welcome to our service! We're glad to have you with us. Reply STOP to unsubscribe.",
  order:
    "Your order has been confirmed! It will be delivered soon. Thank you for shopping with us!",
  appointment:
    "Reminder: You have an upcoming appointment. Reply YES to confirm or NO to cancel.",
  promo:
    "Special offer just for you! Get 20% off your next purchase with code SAVE20.",
  otp: "Your verification code is: 123456. Valid for 10 minutes. Do not share this code.",
};

interface Contact {
  id: string;
  name: string;
  phone: string;
  group: string;
}

type SendResult = { phone: string; name?: string; status: "sent" | "failed" };
type RecipientMode = "single" | "multiple" | "contacts";
type Channel = "sms" | "whatsapp";

export default function SendMessage() {
  const [channel, setChannel] = useState<Channel>("sms");
  const [adminNumbers, setAdminNumbers] = useState<AdminNumber[]>([]);
  const [fromNumber, setFromNumber] = useState("");

  const [recipientMode, setRecipientMode] = useState<RecipientMode>("contacts");
  const [singlePhone, setSinglePhone] = useState("");
  const [multiplePhones, setMultiplePhones] = useState("");

  // contacts mode
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactsError, setContactsError] = useState<string | null>(null);
  const [contactSearch, setContactSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [results, setResults] = useState<SendResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const numbers = smsStore.getAdminNumbers();
    setAdminNumbers(numbers);
    const def = numbers.find((n) => n.isDefault);
    if (def) setFromNumber(def.number);
  }, []);

  const loadContacts = () => {
    setContactsLoading(true);
    setContactsError(null);
    api.contacts
      .list()
      .then((res: any) => {
        if (res?.success && Array.isArray(res.data)) {
          setContacts(
            res.data.map((c: any) => ({
              id: String(c.id),
              name: c.name,
              phone: c.phone,
              group: c.group || "General",
            }))
          );
        } else {
          setContactsError("Contacts load venna bæri uNa. Backend run karanna.");
        }
      })
      .catch(() => {
        setContactsError("Server ekata connect venna bæri uNa. Backend run karanna: php artisan serve");
      })
      .finally(() => setContactsLoading(false));
  };

  // Load contacts on mount
  useEffect(() => {
    loadContacts();
  }, []);

  // Derived: filtered contacts list
  const groups = ["all", ...Array.from(new Set(contacts.map((c) => c.group)))];
  const filteredContacts = contacts.filter((c) => {
    const matchGroup = groupFilter === "all" || c.group === groupFilter;
    const matchSearch =
      c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.phone.includes(contactSearch);
    return matchGroup && matchSearch;
  });

  const toggleContact = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectGroup = (group: string) => {
    const ids = (group === "all" ? contacts : contacts.filter((c) => c.group === group)).map(
      (c) => c.id
    );
    setSelectedIds(new Set(ids));
  };

  const clearSelection = () => setSelectedIds(new Set());

  // Final recipients list
  const recipients: { phone: string; name?: string }[] = (() => {
    if (recipientMode === "single") {
      const p = singlePhone.trim();
      return p ? [{ phone: p }] : [];
    }
    if (recipientMode === "multiple") {
      return multiplePhones
        .split(/[\n,]+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 5)
        .map((p) => ({ phone: p }));
    }
    // contacts mode
    return contacts
      .filter((c) => selectedIds.has(c.id))
      .map((c) => ({ phone: c.phone, name: c.name }));
  })();

  const smsSegments = message ? Math.ceil(message.length / 160) : 1;
  const canSend =
    recipients.length > 0 && message.trim().length > 0 && fromNumber.length > 0;

  const handleSend = async () => {
    if (!canSend || isSending) return;
    setIsSending(true);
    setShowResults(false);

    const sendResults: SendResult[] = [];
    for (const r of recipients) {
      try {
        const res = await api.messages.send({
          sender: fromNumber,
          recipient: r.phone,
          content: message,
          channel,
        });
        sendResults.push({
          phone: r.phone,
          name: r.name,
          status: res?.success === true ? "sent" : "failed",
        });
      } catch {
        sendResults.push({ phone: r.phone, name: r.name, status: "failed" });
      }
    }

    setResults(sendResults);
    setShowResults(true);
    setIsSending(false);

    if (sendResults.every((r) => r.status === "sent")) {
      setMessage("");
      setSinglePhone("");
      setMultiplePhones("");
      setSelectedIds(new Set());
    }
  };

  const sentCount = results.filter((r) => r.status === "sent").length;
  const failedCount = results.filter((r) => r.status === "failed").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Send Message</h1>
        <p className="text-gray-600 mt-1">
          Send messages from your admin number to your contacts
        </p>
      </div>

      {/* Channel Selector */}
      <div className="flex gap-3">
        <button
          onClick={() => setChannel("sms")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors border ${
            channel === "sms"
              ? "bg-blue-600 text-white border-blue-600 shadow"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Phone className="size-4" />
          SMS
          {channel === "sms" && (
            <Badge className="bg-blue-500 text-white text-xs ml-1 py-0">Active</Badge>
          )}
        </button>
        <button
          onClick={() => setChannel("whatsapp")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors border ${
            channel === "whatsapp"
              ? "bg-green-600 text-white border-green-600 shadow"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          <MessageCircle className="size-4" />
          WhatsApp
          {channel === "whatsapp" && (
            <Badge className="bg-green-500 text-white text-xs ml-1 py-0">Active</Badge>
          )}
        </button>
      </div>

      {/* Result Alert */}
      {showResults && (
        <Alert
          className={
            failedCount === 0
              ? "border-green-200 bg-green-50"
              : sentCount === 0
              ? "border-red-200 bg-red-50"
              : "border-amber-200 bg-amber-50"
          }
        >
          {failedCount === 0 ? (
            <CheckCircle2 className="size-4 text-green-600" />
          ) : sentCount === 0 ? (
            <XCircle className="size-4 text-red-600" />
          ) : (
            <AlertTriangle className="size-4 text-amber-600" />
          )}
          <AlertDescription
            className={
              failedCount === 0
                ? "text-green-700"
                : sentCount === 0
                ? "text-red-700"
                : "text-amber-700"
            }
          >
            {sentCount > 0 && `${sentCount} message(s) sent successfully. `}
            {failedCount > 0 && `${failedCount} message(s) failed.`}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left / Main Panel ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* From Number */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="size-4 text-blue-600" />
                From Number (Admin)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {adminNumbers.length === 0 ? (
                <Alert className="border-amber-200 bg-amber-50">
                  <Settings className="size-4 text-amber-600" />
                  <AlertDescription className="text-amber-700 text-sm">
                    No admin numbers saved. Go to{" "}
                    <span className="font-semibold">API Configuration</span> to
                    add your sender number.
                  </AlertDescription>
                </Alert>
              ) : (
                <Select value={fromNumber} onValueChange={setFromNumber}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your sender number" />
                  </SelectTrigger>
                  <SelectContent>
                    {adminNumbers.map((n) => (
                      <SelectItem key={n.id} value={n.number} label={`${n.number} — ${n.label}`}>
                        <span className="font-mono font-medium">{n.number}</span>
                        <span className="text-gray-400 ml-2">— {n.label}</span>
                        {n.isDefault && (
                          <Badge className="ml-2 text-xs bg-blue-100 text-blue-700 py-0">
                            Default
                          </Badge>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

          {/* Recipients */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="size-4 text-blue-600" />
                Recipients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={recipientMode}
                onValueChange={(v: any) => setRecipientMode(v)}
                className="flex flex-wrap gap-x-6 gap-y-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single" className="cursor-pointer">
                    Single Number
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="multiple" id="multiple" />
                  <Label htmlFor="multiple" className="cursor-pointer">
                    Multiple Numbers
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="contacts" id="contacts" />
                  <Label htmlFor="contacts" className="cursor-pointer">
                    From Contacts
                  </Label>
                </div>
              </RadioGroup>

              {/* Single */}
              {recipientMode === "single" && (
                <div className="space-y-1">
                  <Label htmlFor="phone-single">Phone Number</Label>
                  <Input
                    id="phone-single"
                    value={singlePhone}
                    onChange={(e) => setSinglePhone(e.target.value)}
                    placeholder="+94771234567"
                    className="font-mono"
                  />
                </div>
              )}

              {/* Multiple */}
              {recipientMode === "multiple" && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label>Phone Numbers</Label>
                    {recipients.length > 0 && (
                      <Badge variant="outline">
                        {recipients.length} numbers
                      </Badge>
                    )}
                  </div>
                  <Textarea
                    value={multiplePhones}
                    onChange={(e) => setMultiplePhones(e.target.value)}
                    placeholder={
                      "+94771234567\n+94779876543\n+94712345678\n\nOr comma-separated:\n+94771234567, +94779876543"
                    }
                    rows={5}
                    className="font-mono text-sm resize-none"
                  />
                  <p className="text-xs text-gray-400">
                    One number per line or comma-separated
                  </p>
                </div>
              )}

              {/* From Contacts */}
              {recipientMode === "contacts" && (
                <div className="space-y-3">
                  {/* Search + group filter */}
                  <div className="flex gap-2 flex-wrap">
                    <div className="relative flex-1 min-w-[180px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                      <Input
                        value={contactSearch}
                        onChange={(e) => setContactSearch(e.target.value)}
                        placeholder="Search by name or number..."
                        className="pl-8 h-9 text-sm"
                      />
                    </div>
                    <Select value={groupFilter} onValueChange={setGroupFilter}>
                      <SelectTrigger className="w-[140px] h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g === "all" ? "All Groups" : g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quick select buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs text-gray-500 self-center">
                      Select:
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => selectGroup("all")}
                    >
                      All ({contacts.length})
                    </Button>
                    {groups
                      .filter((g) => g !== "all")
                      .map((g) => (
                        <Button
                          key={g}
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => selectGroup(g)}
                        >
                          {g} ({contacts.filter((c) => c.group === g).length})
                        </Button>
                      ))}
                    {selectedIds.size > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-red-500"
                        onClick={clearSelection}
                      >
                        <X className="size-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>

                  {/* Contacts list */}
                  {contactsLoading ? (
                    <p className="text-sm text-gray-400 py-4 text-center">
                      Contacts load wenawa...
                    </p>
                  ) : contactsError ? (
                    <div className="py-3 space-y-2">
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="size-4 text-red-600" />
                        <AlertDescription className="text-red-700 text-xs">
                          {contactsError}
                        </AlertDescription>
                      </Alert>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-sm"
                        onClick={loadContacts}
                      >
                        Retry
                      </Button>
                    </div>
                  ) : filteredContacts.length === 0 ? (
                    <p className="text-sm text-gray-400 py-4 text-center">
                      {contacts.length === 0
                        ? "Contacts naha. Contacts Management walata giyala add karanna."
                        : "No contacts found"}
                    </p>
                  ) : (
                    <div className="border rounded-lg overflow-y-auto max-h-64 divide-y divide-gray-50">
                      {filteredContacts.map((c) => {
                        const checked = selectedIds.has(c.id);
                        return (
                          <div
                            key={c.id}
                            onClick={() => toggleContact(c.id)}
                            className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
                              checked
                                ? "bg-blue-50"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            {/* Checkbox visual */}
                            <div
                              className={`size-4 rounded border-2 flex items-center justify-center shrink-0 ${
                                checked
                                  ? "bg-blue-600 border-blue-600"
                                  : "border-gray-300"
                              }`}
                            >
                              {checked && (
                                <svg
                                  className="size-2.5 text-white"
                                  fill="none"
                                  viewBox="0 0 10 10"
                                >
                                  <path
                                    d="M1.5 5l2.5 2.5 4.5-4.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {c.name}
                              </p>
                              <p className="text-xs text-gray-500 font-mono">
                                {c.phone}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {c.group}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {selectedIds.size > 0 && (
                    <p className="text-xs text-blue-600 font-medium">
                      {selectedIds.size} contact{selectedIds.size !== 1 ? "s" : ""} selected
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Message Compose */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="size-4 text-blue-600" />
                Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Template (Optional)</Label>
                <Select onValueChange={(v) => setMessage(TEMPLATES[v] ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template or write your own..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome Message</SelectItem>
                    <SelectItem value="order">Order Confirmation</SelectItem>
                    <SelectItem value="appointment">
                      Appointment Reminder
                    </SelectItem>
                    <SelectItem value="promo">Promotional Offer</SelectItem>
                    <SelectItem value="otp">OTP / Verification Code</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label>Message Content</Label>
                  <span className="text-xs text-gray-500">
                    {message.length} chars · {smsSegments} segment
                    {smsSegments !== 1 ? "s" : ""}
                  </span>
                </div>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your SMS message here..."
                  rows={5}
                  className="resize-none"
                />
                {message.length > 160 && (
                  <p className="text-xs text-amber-600">
                    Message is {message.length} characters — sent as{" "}
                    {smsSegments} SMS segments
                  </p>
                )}
              </div>

              {/* Send Button — main panel */}
              <Button
                className={`w-full h-12 text-base font-semibold ${
                  channel === "whatsapp"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={handleSend}
                disabled={!canSend || isSending}
              >
                <Send className="size-5 mr-2" />
                {isSending
                  ? "Sending..."
                  : recipients.length > 0
                  ? `Send ${channel === "whatsapp" ? "WhatsApp" : "SMS"} to ${recipients.length} recipient${recipients.length !== 1 ? "s" : ""}`
                  : `Send ${channel === "whatsapp" ? "WhatsApp" : "SMS"}`}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ── Right Summary Panel ── */}
        <div className="space-y-5">
          {/* Send Summary + Button */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Send Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Channel</span>
                <Badge className={channel === "whatsapp" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                  {channel === "whatsapp" ? "WhatsApp" : "SMS"}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">From</span>
                <span className="font-mono font-medium text-gray-800 truncate max-w-[150px]">
                  {fromNumber || "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Recipients</span>
                <Badge>{recipients.length}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">SMS Segments</span>
                <span className="font-medium">{smsSegments}</span>
              </div>
              <div className="flex justify-between text-sm border-t pt-3">
                <span className="text-gray-500">Total Messages</span>
                <span className="font-bold text-gray-900">
                  {recipients.length * smsSegments}
                </span>
              </div>

              <Button
                className={`w-full h-12 mt-2 ${
                  channel === "whatsapp"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={handleSend}
                disabled={!canSend || isSending}
              >
                <Send className="size-4 mr-2" />
                {isSending
                  ? "Sending..."
                  : `Send ${channel === "whatsapp" ? "WhatsApp" : "SMS"} to ${recipients.length} recipient${
                      recipients.length !== 1 ? "s" : ""
                    }`}
              </Button>
            </CardContent>
          </Card>

          {/* Message Preview */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-3 min-h-[80px] border border-gray-100">
                {message ? (
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {message}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    Message will appear here...
                  </p>
                )}
              </div>
              {fromNumber && (
                <p className="text-xs text-gray-400 mt-2">From: {fromNumber}</p>
              )}
            </CardContent>
          </Card>

          {/* Send Results */}
          {showResults && results.length > 0 && (
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  Results
                  <span className="text-xs font-normal text-gray-500">
                    {sentCount} sent · {failedCount} failed
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 max-h-52 overflow-y-auto">
                {results.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0"
                  >
                    <div className="min-w-0">
                      {r.name && (
                        <p className="font-medium text-gray-800 truncate text-xs">
                          {r.name}
                        </p>
                      )}
                      <p className="font-mono text-gray-500 text-xs">{r.phone}</p>
                    </div>
                    {r.status === "sent" ? (
                      <Badge className="bg-green-100 text-green-700 shrink-0">
                        Sent
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 shrink-0">
                        Failed
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
