import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
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
import { Plus, Search, Pencil, Trash2, FileText, Copy } from "lucide-react";
import { Badge } from "./ui/badge";

interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function MessageTemplates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  const [templates, setTemplates] = useState<Template[]>([]);

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    content: "",
    category: "",
  });

  // Load templates from API on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await api.templates.list();

      if (response.success && response.data) {
        const formattedTemplates = (response.data || []).map(
          (template: any) => ({
            id: template.id.toString(),
            name: template.name,
            content: template.content,
            category: template.category || "General",
            createdAt:
              template.created_at?.split("T")[0] ||
              new Date().toISOString().split("T")[0],
          })
        );
        setTemplates(formattedTemplates);
      } else {
        console.warn("No templates returned from API");
      }
    } catch (error) {
      console.error("Failed to load templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTemplate = async () => {
    if (!newTemplate.name || !newTemplate.content) {
      alert("❌ Please fill in name and content");
      return;
    }

    try {
      const response = await api.templates.create({
        name: newTemplate.name,
        content: newTemplate.content,
        category: newTemplate.category || "General",
        variables: [],
      });

      if (response.success && response.data) {
        const template: Template = {
          id: response.data.id.toString(),
          name: response.data.name,
          content: response.data.content,
          category: response.data.category || "General",
          createdAt: new Date().toISOString().split("T")[0],
        };

        // Add template to list
        setTemplates([...templates, template]);

        // Clear form
        setNewTemplate({ name: "", content: "", category: "" });

        // Close dialog
        setIsAddDialogOpen(false);

        // Show success message
        alert("✅ Template created successfully!");

        // Reload templates to ensure sync
        await loadTemplates();
      } else {
        alert(
          "❌ Failed to create template: " +
            (response.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error adding template:", error);
      alert(
        "❌ Error creating template: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) {
      return;
    }

    try {
      const response = await api.templates.delete(parseInt(id));

      if (response.success) {
        setTemplates(templates.filter((t) => t.id !== id));
        if (selectedTemplate?.id === id) {
          setSelectedTemplate(null);
        }
        alert("✅ Template deleted successfully!");
      } else {
        alert(
          "❌ Failed to delete template: " +
            (response.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      alert(
        "❌ Error deleting template: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    "Onboarding",
    "Transactional",
    "Reminders",
    "Marketing",
    "Billing",
    "Feedback",
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Message Templates
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage reusable message templates
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="size-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>
                Create a reusable message template with variables
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  placeholder="e.g., Welcome Message"
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Onboarding, Marketing"
                  value={newTemplate.category}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, category: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Message Content</Label>
                <Textarea
                  id="content"
                  placeholder="Type your message here. Use {{variableName}} for dynamic content."
                  rows={6}
                  value={newTemplate.content}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, content: e.target.value })
                  }
                />
                <p className="text-sm text-gray-500">
                  Tip: Use {"{{variableName}}"} for dynamic content (e.g.,{" "}
                  {"{{firstName}}"}, {"{{orderNumber}}"})
                </p>
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
                onClick={handleAddTemplate}
              >
                Create Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Search templates by name, content, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">
            Templates ({filteredTemplates.length})
          </h2>
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className={`border-0 shadow-md cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate?.id === template.id
                    ? "ring-2 ring-blue-600"
                    : ""
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {template.name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {template.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Created: {template.createdAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button variant="ghost" size="icon" className="size-8">
                        <Copy className="size-4 text-gray-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8">
                        <Pencil className="size-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTemplate(template.id);
                          if (selectedTemplate?.id === template.id) {
                            setSelectedTemplate(null);
                          }
                        }}
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:sticky lg:top-24 h-fit">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5 text-blue-600" />
                Template Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTemplate ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-600">
                      Template Name
                    </Label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {selectedTemplate.name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Category</Label>
                    <Badge className="mt-1">{selectedTemplate.category}</Badge>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">
                      Message Content
                    </Label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedTemplate.content}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">
                      Character Count
                    </Label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedTemplate.content.length} characters
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">
                      Variables Used
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[
                        ...selectedTemplate.content.matchAll(/\{\{(\w+)\}\}/g),
                      ].map((match, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-blue-50 text-blue-700"
                        >
                          {match[1]}
                        </Badge>
                      ))}
                      {[...selectedTemplate.content.matchAll(/\{\{(\w+)\}\}/g)]
                        .length === 0 && (
                        <p className="text-sm text-gray-500">
                          No variables in this template
                        </p>
                      )}
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Use This Template
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="size-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Select a template to preview its details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
