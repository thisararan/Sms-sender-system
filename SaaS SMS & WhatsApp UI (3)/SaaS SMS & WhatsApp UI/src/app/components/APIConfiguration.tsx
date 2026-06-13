import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import {
  Save,
  Key,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Star,
  Phone,
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { smsStore } from "../../services/smsStore";
import type { AdminNumber } from "../../services/smsStore";

export default function APIConfiguration() {
  const [isSaved, setIsSaved] = useState(false);

  const [smsConfig, setSmsConfig] = useState({
    enabled: true,
    apiKey: "sk_live_xxxxxxxxxxxxx",
    apiSecret: "",
    webhook: "https://api.example.com/webhooks/sms",
  });

  const [whatsappConfig, setWhatsappConfig] = useState({
    enabled: true,
    apiKey: "wa_live_yyyyyyyyyyyy",
    apiSecret: "",
    phoneNumber: "+1234567890",
    webhook: "https://api.example.com/webhooks/whatsapp",
  });

  // ── Admin Numbers ──
  const [adminNumbers, setAdminNumbers] = useState<AdminNumber[]>([]);
  const [newNumber, setNewNumber] = useState("");
  const [newLabel, setNewLabel] = useState("");

  useEffect(() => {
    const existing = smsStore.getAdminNumbers();
    const waPhone = whatsappConfig.phoneNumber.trim();
    if (waPhone && !existing.some((n) => n.number === waPhone)) {
      const updated: AdminNumber[] = [
        ...existing,
        {
          id: Date.now().toString(),
          number: waPhone,
          label: "WhatsApp Number",
          isDefault: existing.length === 0,
        },
      ];
      smsStore.saveAdminNumbers(updated);
      setAdminNumbers(updated);
    } else {
      setAdminNumbers(existing);
    }
  }, []);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddNumber = () => {
    if (!newNumber.trim()) return;
    const updated: AdminNumber[] = [
      ...adminNumbers,
      {
        id: Date.now().toString(),
        number: newNumber.trim(),
        label: newLabel.trim() || "My Number",
        isDefault: adminNumbers.length === 0,
      },
    ];
    smsStore.saveAdminNumbers(updated);
    setAdminNumbers(updated);
    setNewNumber("");
    setNewLabel("");
  };

  const handleRemoveNumber = (id: string) => {
    const updated = adminNumbers.filter((n) => n.id !== id);
    if (updated.length > 0 && !updated.some((n) => n.isDefault)) {
      updated[0].isDefault = true;
    }
    smsStore.saveAdminNumbers(updated);
    setAdminNumbers(updated);
  };

  const handleSetDefault = (id: string) => {
    const updated = adminNumbers.map((n) => ({
      ...n,
      isDefault: n.id === id,
    }));
    smsStore.saveAdminNumbers(updated);
    setAdminNumbers(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">API Configuration</h1>
        <p className="text-gray-600 mt-1">
          Manage your sender numbers and API settings
        </p>
      </div>

      {isSaved && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="size-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Configuration saved successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Key className="size-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">SMS Gateway</p>
                  <p className="text-sm text-gray-600">
                    Last connection: 2 mins ago
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="size-3 mr-1" />
                Connected
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Key className="size-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">WhatsApp API</p>
                  <p className="text-sm text-gray-600">
                    Last connection: 1 min ago
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="size-3 mr-1" />
                Connected
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Admin Sender Numbers ── */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="size-5 text-blue-600" />
            Admin Sender Numbers
          </CardTitle>
          <CardDescription>
            Add your SIM numbers here. All SMS messages will be sent from the
            selected number. The default number is pre-selected on the Send SMS
            page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {adminNumbers.length === 0 ? (
            <p className="text-sm text-gray-400 italic">
              No numbers added yet. Add your first sender number below.
            </p>
          ) : (
            <div className="space-y-2">
              {adminNumbers.map((n) => (
                <div
                  key={n.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50"
                >
                  <Phone className="size-4 text-gray-400 shrink-0" />
                  <span className="font-mono font-medium text-gray-900 flex-1">
                    {n.number}
                  </span>
                  <span className="text-sm text-gray-500 shrink-0">
                    {n.label}
                  </span>
                  {n.isDefault ? (
                    <Badge className="bg-blue-100 text-blue-700 text-xs shrink-0">
                      Default
                    </Badge>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-gray-500 h-7 px-2 shrink-0"
                      onClick={() => handleSetDefault(n.id)}
                    >
                      <Star className="size-3 mr-1" />
                      Set default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 shrink-0"
                    onClick={() => handleRemoveNumber(n.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Number */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Add New Number
            </p>
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[160px] space-y-1">
                <Label htmlFor="new-number">Phone Number</Label>
                <Input
                  id="new-number"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  placeholder="+94771234567"
                  className="font-mono"
                  onKeyDown={(e) => e.key === "Enter" && handleAddNumber()}
                />
              </div>
              <div className="flex-1 min-w-[140px] space-y-1">
                <Label htmlFor="new-label">Label (Optional)</Label>
                <Input
                  id="new-label"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Main Line"
                  onKeyDown={(e) => e.key === "Enter" && handleAddNumber()}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleAddNumber}
                  disabled={!newNumber.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="size-4 mr-2" />
                  Add Number
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMS Gateway Configuration */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>SMS Gateway Configuration</CardTitle>
              <CardDescription>
                Configure your SMS provider API credentials
              </CardDescription>
            </div>
            <Switch
              checked={smsConfig.enabled}
              onCheckedChange={(checked) =>
                setSmsConfig({ ...smsConfig, enabled: checked })
              }
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sms-api-key">API Key</Label>
              <Input
                id="sms-api-key"
                value={smsConfig.apiKey}
                onChange={(e) =>
                  setSmsConfig({ ...smsConfig, apiKey: e.target.value })
                }
                disabled={!smsConfig.enabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sms-api-secret">API Secret</Label>
              <Input
                id="sms-api-secret"
                type="password"
                placeholder="••••••••••••••••"
                value={smsConfig.apiSecret}
                onChange={(e) =>
                  setSmsConfig({ ...smsConfig, apiSecret: e.target.value })
                }
                disabled={!smsConfig.enabled}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sms-webhook">Webhook URL</Label>
            <Input
              id="sms-webhook"
              value={smsConfig.webhook}
              onChange={(e) =>
                setSmsConfig({ ...smsConfig, webhook: e.target.value })
              }
              disabled={!smsConfig.enabled}
            />
          </div>
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="size-4 text-amber-600" />
            <AlertDescription className="text-amber-700 text-sm">
              Keep your API credentials secure. Never share them or commit them
              to version control.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* WhatsApp Configuration */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>WhatsApp API Configuration</CardTitle>
              <CardDescription>
                Configure your WhatsApp Business API settings
              </CardDescription>
            </div>
            <Switch
              checked={whatsappConfig.enabled}
              onCheckedChange={(checked) =>
                setWhatsappConfig({ ...whatsappConfig, enabled: checked })
              }
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wa-api-key">API Key</Label>
              <Input
                id="wa-api-key"
                value={whatsappConfig.apiKey}
                onChange={(e) =>
                  setWhatsappConfig({
                    ...whatsappConfig,
                    apiKey: e.target.value,
                  })
                }
                disabled={!whatsappConfig.enabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wa-api-secret">API Secret</Label>
              <Input
                id="wa-api-secret"
                type="password"
                placeholder="••••••••••••••••"
                value={whatsappConfig.apiSecret}
                onChange={(e) =>
                  setWhatsappConfig({
                    ...whatsappConfig,
                    apiSecret: e.target.value,
                  })
                }
                disabled={!whatsappConfig.enabled}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wa-phone">Phone Number</Label>
              <Input
                id="wa-phone"
                value={whatsappConfig.phoneNumber}
                onChange={(e) =>
                  setWhatsappConfig({
                    ...whatsappConfig,
                    phoneNumber: e.target.value,
                  })
                }
                disabled={!whatsappConfig.enabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wa-webhook">Webhook URL</Label>
              <Input
                id="wa-webhook"
                value={whatsappConfig.webhook}
                onChange={(e) =>
                  setWhatsappConfig({
                    ...whatsappConfig,
                    webhook: e.target.value,
                  })
                }
                disabled={!whatsappConfig.enabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          className="bg-blue-600 hover:bg-blue-700 px-8"
          onClick={handleSave}
        >
          <Save className="size-4 mr-2" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
