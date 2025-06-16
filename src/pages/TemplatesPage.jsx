"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import {
  FileText,
  Search,
  Download,
  Eye,
  Star,
  Users,
  Calendar,
  Shield,
  Building,
  HandMetal,
  Briefcase,
  Home,
  UserCheck,
  FileSignature,
  Scale,
  Edit3,
  Printer,
  ArrowRight,
  Clock,
  TrendingUp,
} from "lucide-react"

const templates = [
  {
    id: "1",
    name: "Non-Disclosure Agreement",
    type: "NDA",
    description: "Standard confidentiality agreement for protecting sensitive information in business dealings",
    category: "Confidentiality",
    downloads: 1250,
    rating: 4.8,
    icon: Shield,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    tags: ["Confidentiality", "Business", "Standard"],
    lastUpdated: "2024-01-10",
    jurisdiction: "India",
    complexity: "Medium",
    fields: ["party1_name", "party2_name", "effective_date", "purpose", "duration"],
  },
  {
    id: "2",
    name: "Service Agreement",
    type: "Contract",
    description: "Professional services contract template for consultants and agencies operating in India",
    category: "Services",
    downloads: 980,
    rating: 4.9,
    icon: Briefcase,
    color: "bg-green-50 text-green-600 border-green-200",
    tags: ["Services", "Professional", "Consulting"],
    lastUpdated: "2024-01-08",
    jurisdiction: "India",
    complexity: "High",
    fields: ["service_provider", "client_name", "services_description", "payment_terms", "duration"],
  },
  {
    id: "3",
    name: "Employment Contract",
    type: "Employment",
    description: "Comprehensive employment agreement compliant with Indian Labour Laws and regulations",
    category: "HR",
    downloads: 756,
    rating: 4.7,
    icon: Users,
    color: "bg-purple-50 text-purple-600 border-purple-200",
    tags: ["Employment", "HR", "Legal"],
    lastUpdated: "2024-01-05",
    jurisdiction: "India",
    complexity: "High",
    fields: ["employee_name", "position", "salary", "start_date", "company_name"],
  },
  {
    id: "4",
    name: "Rental/Lease Agreement",
    type: "Property",
    description: "Property rental agreements compliant with Indian Tenancy laws and Rent Control Acts",
    category: "Property",
    downloads: 892,
    rating: 4.9,
    icon: Home,
    color: "bg-orange-50 text-orange-600 border-orange-200",
    tags: ["Property", "Rental", "Tenancy"],
    lastUpdated: "2024-01-12",
    jurisdiction: "India",
    complexity: "Medium",
    fields: ["landlord_name", "tenant_name", "property_address", "rent_amount", "lease_duration", "security_deposit"],
  },
  {
    id: "5",
    name: "Offer Letter",
    type: "Employment",
    description: "Formal employment offer template used by Indian companies for hiring processes",
    category: "HR",
    downloads: 634,
    rating: 4.8,
    icon: UserCheck,
    color: "bg-teal-50 text-teal-600 border-teal-200",
    tags: ["Employment", "Hiring", "HR"],
    lastUpdated: "2024-01-09",
    jurisdiction: "India",
    complexity: "Low",
    fields: ["candidate_name", "position", "salary", "joining_date", "company_name", "reporting_manager"],
  },
  {
    id: "6",
    name: "Resignation Acceptance Letter",
    type: "HR",
    description: "HR automation template for accepting employee resignations in Indian companies",
    category: "HR",
    downloads: 423,
    rating: 4.6,
    icon: FileSignature,
    color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    tags: ["HR", "Resignation", "Automation"],
    lastUpdated: "2024-01-07",
    jurisdiction: "India",
    complexity: "Low",
    fields: ["employee_name", "position", "resignation_date", "last_working_day", "hr_manager"],
  },
  {
    id: "7",
    name: "Affidavit Template",
    type: "Legal",
    description: "Self-declaration template for statements in Indian courts and government offices",
    category: "Legal",
    downloads: 567,
    rating: 4.7,
    icon: Scale,
    color: "bg-red-50 text-red-600 border-red-200",
    tags: ["Legal", "Court", "Declaration"],
    lastUpdated: "2024-01-06",
    jurisdiction: "India",
    complexity: "Medium",
    fields: ["deponent_name", "father_name", "address", "statement", "place", "date"],
  },
  {
    id: "8",
    name: "Partnership Agreement",
    type: "Partnership",
    description: "Business partnership agreement for joint ventures and collaborations under Indian Partnership Act",
    category: "Business",
    downloads: 534,
    rating: 4.8,
    icon: HandMetal,
    color: "bg-pink-50 text-pink-600 border-pink-200",
    tags: ["Partnership", "Business", "Collaboration"],
    lastUpdated: "2023-12-28",
    jurisdiction: "India",
    complexity: "High",
    fields: ["partner1_name", "partner2_name", "business_name", "capital_contribution", "profit_sharing"],
  },
]

const categories = ["All", "Confidentiality", "Services", "HR", "Property", "Legal", "Business"]
const complexityColors = {
  Low: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-red-100 text-red-800",
}

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("popular")
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.downloads - a.downloads
      case "rating":
        return b.rating - a.rating
      case "recent":
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const handleUseTemplate = (template) => {
    setSelectedTemplate(template)
  }

  const handlePreview = (template) => {
    setSelectedTemplate(template)
    setShowPreview(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">LegalMind.AI</h1>
                <p className="text-sm text-slate-600">Professional Legal Templates</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <motion.h1
              className="text-5xl font-bold text-slate-800 mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Legal Document Templates
            </motion.h1>
            <motion.p
              className="text-xl text-slate-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Professional, legally-compliant templates for Indian jurisdiction. Fill in your details and generate
              ready-to-use legal documents instantly.
            </motion.p>
          </div>

          {/* Enhanced Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: "Total Templates",
                value: templates.length,
                color: "text-blue-600",
                bg: "bg-blue-50",
                icon: FileText,
                trend: "+2 this month",
              },
              {
                label: "Categories",
                value: categories.length - 1,
                color: "text-green-600",
                bg: "bg-green-50",
                icon: Building,
                trend: "All jurisdictions",
              },
              {
                label: "Total Downloads",
                value: templates.reduce((sum, t) => sum + t.downloads, 0).toLocaleString(),
                color: "text-purple-600",
                bg: "bg-purple-50",
                icon: Download,
                trend: "+15% this week",
              },
              {
                label: "Avg Rating",
                value: (templates.reduce((sum, t) => sum + t.rating, 0) / templates.length).toFixed(1),
                color: "text-orange-600",
                bg: "bg-orange-50",
                icon: Star,
                trend: "Excellent quality",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="border-slate-200 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                    <div className="text-sm text-slate-600 mb-1">{stat.label}</div>
                    <div className="text-xs text-green-600 font-medium">{stat.trend}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Card className="border-slate-200 mb-8 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Search templates by name, type, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-lg"
                  />
                </div>
                <div className="flex gap-3 flex-wrap">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={`transition-all duration-200 ${
                        selectedCategory === category ? "bg-blue-600 hover:bg-blue-700 shadow-lg" : "hover:bg-blue-50"
                      }`}
                    >
                      {category}
                    </Button>
                  ))}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-md text-sm bg-white hover:bg-slate-50 transition-colors"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="recent">Most Recent</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Templates Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {sortedTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <Card className="border-slate-200 hover:shadow-xl transition-all duration-300 h-full group">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-14 h-14 ${template.color} rounded-xl flex items-center justify-center border-2 group-hover:scale-110 transition-transform duration-200`}
                        >
                          <template.icon className="w-7 h-7" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-slate-700">{template.rating}</span>
                          </div>
                          <Badge className={complexityColors[template.complexity]}>{template.complexity}</Badge>
                        </div>
                      </div>
                      <CardTitle className="text-slate-800 text-xl mb-2 group-hover:text-blue-600 transition-colors">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="text-slate-600 mb-4 leading-relaxed text-sm">
                        {template.description}
                      </CardDescription>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {template.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs px-2 py-1">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-slate-600 mb-6">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Download className="w-4 h-4" />
                            <span>{template.downloads.toLocaleString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(template.lastUpdated).toLocaleDateString()}</span>
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            onClick={() => handlePreview(template)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                            onClick={() => handleUseTemplate(template)}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Use Template
                          </Button>
                        </div>
                        <div className="text-xs text-slate-500 text-center">
                          Jurisdiction: {template.jurisdiction} • {template.fields.length} fields to fill
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* No Results */}
        {sortedTemplates.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-3">No templates found</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Try adjusting your search criteria or browse all categories to find the perfect template.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* Template Editor Modal */}
      <AnimatePresence>
        {selectedTemplate && !showPreview && (
          <TemplateEditor template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
        )}
      </AnimatePresence>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {selectedTemplate && showPreview && (
          <TemplatePreview
            template={selectedTemplate}
            onClose={() => {
              setSelectedTemplate(null)
              setShowPreview(false)
            }}
            onUse={() => {
              setShowPreview(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Template Editor Component
function TemplateEditor({ template, onClose }) {
  const [formData, setFormData] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDocument, setGeneratedDocument] = useState(null)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const generateDocument = async () => {
    setIsGenerating(true)

    // Simulate document generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const document = generateTemplateDocument(template, formData)
    setGeneratedDocument(document)
    setIsGenerating(false)
  }

  const exportDocument = () => {
    if (generatedDocument) {
      const element = document.createElement("a")
      const file = new Blob([generatedDocument], { type: "text/html" })
      element.href = URL.createObjectURL(file)
      element.download = `${template.name.replace(/\s+/g, "_")}_${Date.now()}.html`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  const printDocument = () => {
    if (generatedDocument) {
      const printWindow = window.open("", "_blank")
      printWindow.document.write(generatedDocument)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex h-full">
          {/* Form Section */}
          <div className="w-1/2 p-6 border-r border-slate-200 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{template.name}</h2>
                <p className="text-slate-600">Fill in the required information</p>
              </div>
              <Button variant="outline" onClick={onClose}>
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              {getTemplateFields(template).map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                    />
                  ) : field.type === "select" ? (
                    <select
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="h-12"
                    />
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-8 space-y-3">
              <Button
                onClick={generateDocument}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Clock className="w-5 h-5 mr-2 animate-spin" />
                    Generating Document...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 mr-2" />
                    Generate Document
                  </>
                )}
              </Button>

              {generatedDocument && (
                <div className="flex space-x-2">
                  <Button onClick={exportDocument} variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button onClick={printDocument} variant="outline" className="flex-1">
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="w-1/2 p-6 bg-slate-50 overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Document Preview</h3>
            {generatedDocument ? (
              <div
                className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 min-h-[500px] text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: generatedDocument }}
              />
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 min-h-[500px] flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Fill in the form and click "Generate Document" to see the preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Template Preview Component
function TemplatePreview({ template, onClose, onUse }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{template.name} - Preview</h2>
              <p className="text-slate-600">Sample template with placeholder content</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={onUse} className="bg-blue-600 hover:bg-blue-700">
                <Edit3 className="w-4 h-4 mr-2" />
                Use This Template
              </Button>
              <Button variant="outline" onClick={onClose}>
                ✕
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
            <div dangerouslySetInnerHTML={{ __html: getTemplatePreview(template) }} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Helper functions for template generation
function getTemplateFields(template) {
  const fieldMappings = {
    1: [
      // NDA
      {
        name: "party1_name",
        label: "First Party Name",
        type: "text",
        required: true,
        placeholder: "Enter company/individual name",
      },
      {
        name: "party2_name",
        label: "Second Party Name",
        type: "text",
        required: true,
        placeholder: "Enter company/individual name",
      },
      { name: "effective_date", label: "Effective Date", type: "date", required: true },
      {
        name: "purpose",
        label: "Purpose of Disclosure",
        type: "textarea",
        required: true,
        placeholder: "Describe the purpose...",
      },
      {
        name: "duration",
        label: "Duration (Years)",
        type: "number",
        required: true,
        placeholder: "Enter duration in years",
      },
    ],
    4: [
      // Rental Agreement
      {
        name: "landlord_name",
        label: "Landlord Name",
        type: "text",
        required: true,
        placeholder: "Enter landlord's full name",
      },
      {
        name: "tenant_name",
        label: "Tenant Name",
        type: "text",
        required: true,
        placeholder: "Enter tenant's full name",
      },
      {
        name: "property_address",
        label: "Property Address",
        type: "textarea",
        required: true,
        placeholder: "Enter complete property address",
      },
      {
        name: "rent_amount",
        label: "Monthly Rent (₹)",
        type: "number",
        required: true,
        placeholder: "Enter monthly rent amount",
      },
      {
        name: "lease_duration",
        label: "Lease Duration",
        type: "select",
        required: true,
        options: ["11 Months", "1 Year", "2 Years", "3 Years"],
      },
      {
        name: "security_deposit",
        label: "Security Deposit (₹)",
        type: "number",
        required: true,
        placeholder: "Enter security deposit amount",
      },
    ],
    5: [
      // Offer Letter
      {
        name: "candidate_name",
        label: "Candidate Name",
        type: "text",
        required: true,
        placeholder: "Enter candidate's full name",
      },
      { name: "position", label: "Position", type: "text", required: true, placeholder: "Enter job position" },
      {
        name: "salary",
        label: "Annual Salary (₹)",
        type: "number",
        required: true,
        placeholder: "Enter annual salary",
      },
      { name: "joining_date", label: "Joining Date", type: "date", required: true },
      { name: "company_name", label: "Company Name", type: "text", required: true, placeholder: "Enter company name" },
      {
        name: "reporting_manager",
        label: "Reporting Manager",
        type: "text",
        required: true,
        placeholder: "Enter manager's name",
      },
    ],
  }

  return (
    fieldMappings[template.id] || [
      { name: "party_name", label: "Party Name", type: "text", required: true, placeholder: "Enter name" },
      { name: "date", label: "Date", type: "date", required: true },
    ]
  )
}

function generateTemplateDocument(template, formData) {
  const templates = {
    1: generateNDADocument,
    4: generateRentalAgreement,
    5: generateOfferLetter,
    6: generateResignationAcceptance,
    7: generateAffidavit,
  }

  const generator = templates[template.id] || generateGenericDocument
  return generator(formData)
}

function generateNDADocument(data) {
  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">NON-DISCLOSURE AGREEMENT</h1>
        <p style="font-size: 14px; color: #666;">Confidentiality Agreement</p>
      </div>

      <p style="margin-bottom: 20px;">This Non-Disclosure Agreement ("Agreement") is entered into on <strong>${data.effective_date || "[DATE]"}</strong> between:</p>

      <div style="margin: 30px 0;">
        <p><strong>FIRST PARTY:</strong> ${data.party1_name || "[FIRST PARTY NAME]"}</p>
        <p><strong>SECOND PARTY:</strong> ${data.party2_name || "[SECOND PARTY NAME]"}</p>
      </div>

      <h3 style="margin-top: 30px; margin-bottom: 15px;">RECITALS</h3>
      <p>WHEREAS, the parties wish to explore a business relationship relating to: <strong>${data.purpose || "[PURPOSE OF DISCLOSURE]"}</strong>;</p>

      <h3 style="margin-top: 30px; margin-bottom: 15px;">1. DEFINITION OF CONFIDENTIAL INFORMATION</h3>
      <p>For purposes of this Agreement, "Confidential Information" shall include all information or material that has or could have commercial value or other utility in the business in which Disclosing Party is engaged.</p>

      <h3 style="margin-top: 30px; margin-bottom: 15px;">2. NON-DISCLOSURE</h3>
      <p>Receiving Party agrees not to disclose, publish, or otherwise reveal any of the Confidential Information received from Disclosing Party to any other party whatsoever except with the specific written authorization of Disclosing Party.</p>

      <h3 style="margin-top: 30px; margin-bottom: 15px;">3. TERM</h3>
      <p>This Agreement shall remain in effect for a period of <strong>${data.duration || "[DURATION]"} years</strong> from the date first written above.</p>

      <h3 style="margin-top: 30px; margin-bottom: 15px;">4. GOVERNING LAW</h3>
      <p>This Agreement shall be governed by and construed in accordance with the laws of India.</p>

      <div style="margin-top: 60px;">
        <div style="display: flex; justify-content: space-between;">
          <div style="width: 45%;">
            <p>_________________________</p>
            <p><strong>${data.party1_name || "[FIRST PARTY NAME]"}</strong></p>
            <p>Date: _______________</p>
          </div>
          <div style="width: 45%;">
            <p>_________________________</p>
            <p><strong>${data.party2_name || "[SECOND PARTY NAME]"}</strong></p>
            <p>Date: _______________</p>
          </div>
        </div>
      </div>
    </div>
  `
}

function generateRentalAgreement(data) {
  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">RENTAL AGREEMENT</h1>
        <p style="font-size: 14px; color: #666;">Leave and License Agreement</p>
      </div>

      <p style="margin-bottom: 20px;">This Rental Agreement is made on <strong>${new Date().toLocaleDateString()}</strong> between:</p>

      <div style="margin: 30px 0; background: #f8f9fa; padding: 20px; border-left: 4px solid #007bff;">
        <p><strong>LANDLORD:</strong> ${data.landlord_name || "[LANDLORD NAME]"}</p>
        <p><strong>TENANT:</strong> ${data.tenant_name || "[TENANT NAME]"}</p>
      </div>

      <h3 style="margin-top: 30px; margin-bottom: 15px; color: #333;">PROPERTY DETAILS</h3>
      <p><strong>Property Address:</strong><br>${data.property_address || "[PROPERTY ADDRESS]"}</p>

      <h3 style="margin-top: 30px; margin-bottom: 15px; color: #333;">TERMS AND CONDITIONS</h3>
      
      <div style="margin: 20px 0;">
        <h4 style="color: #555;">1. RENT</h4>
        <p>The monthly rent for the said property is <strong>₹${data.rent_amount || "[RENT AMOUNT]"}</strong> payable in advance by the 5th of each month.</p>
      </div>

      <div style="margin: 20px 0;">
        <h4 style="color: #555;">2. SECURITY DEPOSIT</h4>
        <p>The Tenant has paid a security deposit of <strong>₹${data.security_deposit || "[SECURITY DEPOSIT]"}</strong> which shall be refunded at the time of vacating the premises, subject to deductions for any damages.</p>
      </div>

      <div style="margin: 20px 0;">
        <h4 style="color: #555;">3. DURATION</h4>
        <p>This agreement is valid for <strong>${data.lease_duration || "[LEASE DURATION]"}</strong> commencing from the date of this agreement.</p>
      </div>

      <div style="margin: 20px 0;">
        <h4 style="color: #555;">4. MAINTENANCE</h4>
        <p>The Tenant shall maintain the property in good condition and shall be responsible for minor repairs and maintenance.</p>
      </div>

      <div style="margin: 20px 0;">
        <h4 style="color: #555;">5. TERMINATION</h4>
        <p>Either party may terminate this agreement by giving one month's written notice to the other party.</p>
      </div>

      <h3 style="margin-top: 30px; margin-bottom: 15px; color: #333;">GOVERNING LAW</h3>
      <p>This agreement shall be governed by the laws of India and subject to the jurisdiction of local courts.</p>

      <div style="margin-top: 60px;">
        <div style="display: flex; justify-content: space-between;">
          <div style="width: 45%; text-align: center;">
            <p>_________________________</p>
            <p><strong>LANDLORD</strong></p>
            <p>${data.landlord_name || "[LANDLORD NAME]"}</p>
            <p>Date: _______________</p>
          </div>
          <div style="width: 45%; text-align: center;">
            <p>_________________________</p>
            <p><strong>TENANT</strong></p>
            <p>${data.tenant_name || "[TENANT NAME]"}</p>
            <p>Date: _______________</p>
          </div>
        </div>
      </div>

      <div style="margin-top: 40px; text-align: center;">
        <p>_________________________</p>
        <p><strong>WITNESS 1</strong></p>
        <br>
        <p>_________________________</p>
        <p><strong>WITNESS 2</strong></p>
      </div>
    </div>
  `
}

function generateOfferLetter(data) {
  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px;">
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #007bff; padding-bottom: 20px;">
        <h1 style="font-size: 28px; font-weight: bold; color: #007bff; margin-bottom: 10px;">${data.company_name || "[COMPANY NAME]"}</h1>
        <h2 style="font-size: 20px; color: #333; margin-bottom: 5px;">EMPLOYMENT OFFER LETTER</h2>
      </div>

      <div style="margin-bottom: 30px;">
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>To:</strong> ${data.candidate_name || "[CANDIDATE NAME]"}</p>
      </div>

      <p style="margin-bottom: 20px;">Dear ${data.candidate_name || "[CANDIDATE NAME]"},</p>

      <p style="margin-bottom: 20px;">We are pleased to offer you the position of <strong>${data.position || "[POSITION]"}</strong> with ${data.company_name || "[COMPANY NAME]"}. We believe that your skills and experience will be valuable additions to our team.</p>

      <div style="background: #f8f9fa; padding: 25px; margin: 30px 0; border-radius: 8px; border-left: 4px solid #28a745;">
        <h3 style="color: #333; margin-bottom: 15px;">EMPLOYMENT DETAILS</h3>
        <p><strong>Position:</strong> ${data.position || "[POSITION]"}</p>
        <p><strong>Reporting Manager:</strong> ${data.reporting_manager || "[REPORTING MANAGER]"}</p>
        <p><strong>Start Date:</strong> ${data.joining_date || "[JOINING DATE]"}</p>
        <p><strong>Annual Salary:</strong> ₹${data.salary || "[SALARY]"}</p>
      </div>

      <h3 style="margin-top: 30px; margin-bottom: 15px; color: #333;">TERMS AND CONDITIONS</h3>
      
      <div style="margin: 20px 0;">
        <h4 style="color: #555;">1. PROBATION PERIOD</h4>
        <p>Your employment will be subject to a probationary period of 6 months from your date of joining.</p>
      </div>

      <div style="margin: 20px 0;">
        <h4 style="color: #555;">2. WORKING HOURS</h4>
        <p>Your normal working hours will be 9:00 AM to 6:00 PM, Monday through Friday, with a one-hour lunch break.</p>
      </div>

      <div style="margin: 20px 0;">
        <h4 style="color: #555;">3. BENEFITS</h4>
        <p>You will be entitled to benefits as per company policy including health insurance, provident fund, and annual leave.</p>
      </div>

      <div style="margin: 20px 0;">
        <h4 style="color: #555;">4. CONFIDENTIALITY</h4>
        <p>You will be required to sign a confidentiality agreement to protect company information and trade secrets.</p>
      </div>

      <p style="margin: 30px 0;">Please confirm your acceptance of this offer by signing and returning this letter by [DATE]. We look forward to welcoming you to our team.</p>

      <div style="margin-top: 50px;">
        <p>Sincerely,</p>
        <br><br>
        <p>_________________________</p>
        <p><strong>HR Manager</strong></p>
        <p>${data.company_name || "[COMPANY NAME]"}</p>
      </div>

      <div style="margin-top: 50px; border-top: 2px solid #dee2e6; padding-top: 30px;">
        <h3 style="color: #333;">ACCEPTANCE</h3>
        <p>I, ${data.candidate_name || "[CANDIDATE NAME]"}, accept the terms and conditions of employment as outlined in this offer letter.</p>
        <br><br>
        <p>_________________________&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date: _______________</p>
        <p><strong>Candidate Signature</strong></p>
      </div>
    </div>
  `
}

function generateResignationAcceptance(data) {
  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">RESIGNATION ACCEPTANCE LETTER</h1>
      </div>

      <div style="margin-bottom: 30px;">
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>To:</strong> ${data.employee_name || "[EMPLOYEE NAME]"}</p>
        <p><strong>Position:</strong> ${data.position || "[POSITION]"}</p>
      </div>

      <p style="margin-bottom: 20px;">Dear ${data.employee_name || "[EMPLOYEE NAME]"},</p>

      <p style="margin-bottom: 20px;">This letter acknowledges receipt of your resignation letter dated <strong>${data.resignation_date || "[RESIGNATION DATE]"}</strong>.</p>

      <div style="background: #fff3cd; padding: 20px; margin: 30px 0; border-left: 4px solid #ffc107; border-radius: 4px;">
        <p><strong>Your resignation is hereby accepted, and your last working day will be ${data.last_working_day || "[LAST WORKING DAY]"}.</strong></p>
      </div>

      <h3 style="margin-top: 30px; margin-bottom: 15px;">EXIT FORMALITIES</h3>
      <ul style="margin-left: 20px;">
        <li>Please ensure all company property is returned before your last working day</li>
        <li>Complete the exit interview process with HR</li>
        <li>Hand over all ongoing projects and responsibilities</li>
        <li>Clear all pending dues and advances</li>
      </ul>

      <p style="margin: 30px 0;">We appreciate your contributions during your tenure with us and wish you success in your future endeavors.</p>

      <div style="margin-top: 50px;">
        <p>Best regards,</p>
        <br><br>
        <p>_________________________</p>
        <p><strong>${data.hr_manager || "[HR MANAGER NAME]"}</strong></p>
        <p>HR Manager</p>
      </div>
    </div>
  `
}

function generateAffidavit(data) {
  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">AFFIDAVIT</h1>
      </div>

      <p style="margin-bottom: 20px;">I, <strong>${data.deponent_name || "[DEPONENT NAME]"}</strong>, son/daughter of <strong>${data.father_name || "[FATHER NAME]"}</strong>, resident of ${data.address || "[ADDRESS]"}, do hereby solemnly affirm and declare as follows:</p>

      <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-left: 4px solid #dc3545;">
        <p><strong>STATEMENT:</strong></p>
        <p>${data.statement || "[STATEMENT/DECLARATION]"}</p>
      </div>

      <p style="margin: 30px 0;">I further state that the above statement is true and correct to the best of my knowledge and belief and nothing has been concealed therein.</p>

      <div style="margin-top: 50px;">
        <p><strong>Place:</strong> ${data.place || "[PLACE]"}</p>
        <p><strong>Date:</strong> ${data.date || new Date().toLocaleDateString()}</p>
      </div>

      <div style="margin-top: 50px; display: flex; justify-content: space-between;">
        <div>
          <p>_________________________</p>
          <p><strong>DEPONENT</strong></p>
          <p>${data.deponent_name || "[DEPONENT NAME]"}</p>
        </div>
      </div>

      <div style="margin-top: 50px; border-top: 1px solid #dee2e6; padding-top: 30px;">
        <p><strong>VERIFICATION</strong></p>
        <p>Verified at ${data.place || "[PLACE]"} on ${data.date || "[DATE]"} that the contents of the above affidavit are true and correct to the best of my knowledge and belief.</p>
        <br><br>
        <p>_________________________</p>
        <p><strong>DEPONENT</strong></p>
      </div>
    </div>
  `
}

function generateGenericDocument(data) {
  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">LEGAL DOCUMENT</h1>
      </div>
      <p>This is a generic legal document template. Please customize according to your specific requirements.</p>
      <div style="margin-top: 50px;">
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <br><br>
        <p>_________________________</p>
        <p><strong>Signature</strong></p>
      </div>
    </div>
  `
}

function getTemplatePreview(template) {
  const previews = {
    1: `
      <div style="font-family: 'Times New Roman', serif; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 24px; font-weight: bold;">NON-DISCLOSURE AGREEMENT</h1>
        </div>
        <p>This Non-Disclosure Agreement is entered into between [FIRST PARTY] and [SECOND PARTY] for the purpose of [PURPOSE]...</p>
        <h3>1. DEFINITION OF CONFIDENTIAL INFORMATION</h3>
        <p>Confidential Information shall include all information or material that has commercial value...</p>
        <h3>2. NON-DISCLOSURE</h3>
        <p>Receiving Party agrees not to disclose any Confidential Information...</p>
      </div>
    `,
    4: `
      <div style="font-family: 'Times New Roman', serif; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 24px; font-weight: bold;">RENTAL AGREEMENT</h1>
        </div>
        <p>This Rental Agreement is made between [LANDLORD] and [TENANT] for the property located at [ADDRESS]...</p>
        <h3>TERMS AND CONDITIONS</h3>
        <p><strong>Monthly Rent:</strong> ₹[AMOUNT]</p>
        <p><strong>Security Deposit:</strong> ₹[AMOUNT]</p>
        <p><strong>Duration:</strong> [DURATION]</p>
      </div>
    `,
    5: `
      <div style="font-family: 'Times New Roman', serif; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 24px; font-weight: bold;">[COMPANY NAME]</h1>
          <h2>EMPLOYMENT OFFER LETTER</h2>
        </div>
        <p>Dear [CANDIDATE NAME],</p>
        <p>We are pleased to offer you the position of [POSITION] with an annual salary of ₹[SALARY]...</p>
        <p><strong>Start Date:</strong> [DATE]</p>
        <p><strong>Reporting Manager:</strong> [MANAGER]</p>
      </div>
    `,
  }

  return (
    previews[template.id] ||
    `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.6;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 24px; font-weight: bold;">${template.name.toUpperCase()}</h1>
      </div>
      <p>This is a preview of the ${template.name} template. Use the template editor to fill in your specific details and generate the complete document.</p>
    </div>
  `
  )
}
