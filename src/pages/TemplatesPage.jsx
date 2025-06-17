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
  StarIcon,
} from "lucide-react"

// Custom Dialog Component
function Dialog({ open, onOpenChange, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">{children}</div>
    </div>
  )
}

function DialogContent({ className, children, ...props }) {
  return (
    <div className={`p-6 ${className || ""}`} {...props}>
      {children}
    </div>
  )
}

function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>
}

function DialogTitle({ children }) {
  return <h2 className="text-lg font-semibold text-gray-900 mb-2">{children}</h2>
}

function DialogDescription({ children }) {
  return <p className="text-sm text-gray-600 mb-4">{children}</p>
}

function DialogFooter({ children }) {
  return <div className="flex justify-end space-x-2 mt-6">{children}</div>
}

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
    fields: 6,
    needsGovernmentSeal: true,
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
    fields: 9,
    needsGovernmentSeal: true,
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
    fields: 8,
    needsGovernmentSeal: true,
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
    fields: 10,
    needsGovernmentSeal: true,
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
    fields: 10,
    needsGovernmentSeal: false,
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
    fields: 6,
    needsGovernmentSeal: false,
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
    fields: 6,
    needsGovernmentSeal: true,
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
    fields: 8,
    needsGovernmentSeal: true,
  },
  {
    id: "9",
    name: "Consulting Agreement",
    type: "Contract",
    description: "Professional consulting services agreement template",
    category: "Services",
    downloads: 445,
    rating: 4.6,
    icon: Briefcase,
    color: "bg-cyan-50 text-cyan-600 border-cyan-200",
    tags: ["Consulting", "Services", "Professional"],
    lastUpdated: "2024-01-04",
    jurisdiction: "India",
    complexity: "Medium",
    fields: 7,
    needsGovernmentSeal: true,
  },
  {
    id: "10",
    name: "Licensing Agreement",
    type: "License",
    description: "Software and product licensing agreement template",
    category: "Business",
    downloads: 378,
    rating: 4.5,
    icon: FileText,
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    tags: ["License", "Software", "Business"],
    lastUpdated: "2024-01-03",
    jurisdiction: "India",
    complexity: "High",
    fields: 6,
    needsGovernmentSeal: true,
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
  const [showRatingDialog, setShowRatingDialog] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [ratingComment, setRatingComment] = useState("")

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

  const handleDocumentGenerated = () => {
    setShowRatingDialog(true)
  }

  const submitRating = () => {
    console.log("Rating submitted:", { rating: userRating, comment: ratingComment })
    setShowRatingDialog(false)
    setUserRating(0)
    setRatingComment("")
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
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Search templates by name, type, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-lg"
                  />
                </div>
                <div className="flex gap-3 flex-wrap items-center">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={`h-12 px-4 transition-all duration-200 ${
                        selectedCategory === category ? "bg-blue-600 hover:bg-blue-700 shadow-lg" : "hover:bg-blue-50"
                      }`}
                    >
                      {category}
                    </Button>
                  ))}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-12 px-4 border border-slate-300 rounded-md text-sm bg-white hover:bg-slate-50 transition-colors"
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
                            className="flex-1 h-10 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            onClick={() => handlePreview(template)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                            onClick={() => handleUseTemplate(template)}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Use Template
                          </Button>
                        </div>
                        <div className="text-xs text-slate-500 text-center">
                          Jurisdiction: {template.jurisdiction} • {template.fields} fields to fill
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
          <TemplateEditor
            template={selectedTemplate}
            onClose={() => setSelectedTemplate(null)}
            onDocumentGenerated={handleDocumentGenerated}
          />
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

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
            <DialogDescription>
              How was your experience with this template? Your feedback helps us improve.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setUserRating(star)} className="transition-colors">
                  <StarIcon
                    className={`w-8 h-8 ${star <= userRating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                </button>
              ))}
            </div>
            <textarea
              placeholder="Share your thoughts (optional)"
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg resize-none"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRatingDialog(false)}>
              Skip
            </Button>
            <Button onClick={submitRating} disabled={userRating === 0}>
              Submit Rating
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Template Editor Component with enhanced form fields
function TemplateEditor({ template, onClose, onDocumentGenerated }) {
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
    onDocumentGenerated()
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
        className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{template.name}</h2>
            <p className="text-slate-600">Fill in the required information</p>
          </div>
          <Button variant="outline" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-1 min-h-0">
          {/* Form Section */}
          <div className="w-1/2 border-r border-slate-200 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
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
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
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
                        {field.options?.map((option) => (
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
            </div>

            {/* Form Actions - Fixed at bottom */}
            <div className="p-6 border-t border-slate-200 bg-white flex-shrink-0">
              <div className="space-y-3">
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
          </div>

          {/* Preview Section */}
          <div className="w-1/2 bg-slate-50 flex flex-col">
            <div className="p-6 border-b border-slate-200 bg-white flex-shrink-0">
              <h3 className="text-lg font-semibold text-slate-800">Document Preview</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {generatedDocument ? (
                <div
                  className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: generatedDocument }}
                />
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-full flex items-center justify-center">
                  <div className="text-center text-slate-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Fill in the form and click "Generate Document" to see the preview</p>
                  </div>
                </div>
              )}
            </div>
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

// Helper functions (keeping existing implementations)
function getTemplateFields(template) {
  // ... existing implementation
  const fieldMappings = {
    1: [
      // NDA
      {
        name: "disclosing_party",
        label: "Disclosing Party Name",
        type: "text",
        required: true,
        placeholder: "Enter disclosing party name",
      },
      {
        name: "disclosing_address",
        label: "Disclosing Party Address",
        type: "textarea",
        required: true,
        placeholder: "Enter complete address",
      },
      {
        name: "receiving_party",
        label: "Receiving Party Name",
        type: "text",
        required: true,
        placeholder: "Enter receiving party name",
      },
      {
        name: "receiving_address",
        label: "Receiving Party Address",
        type: "textarea",
        required: true,
        placeholder: "Enter complete address",
      },
      {
        name: "purpose",
        label: "Purpose/Project",
        type: "textarea",
        required: true,
        placeholder: "Describe the purpose or project",
      },
      {
        name: "duration",
        label: "Duration (Years)",
        type: "number",
        required: true,
        placeholder: "Enter duration in years",
      },
    ],
    2: [
      // Service Agreement
      {
        name: "client_name",
        label: "Client Name",
        type: "text",
        required: true,
        placeholder: "Enter client name",
      },
      {
        name: "client_address",
        label: "Client Address",
        type: "textarea",
        required: true,
        placeholder: "Enter client address",
      },
      {
        name: "service_provider",
        label: "Service Provider Name",
        type: "text",
        required: true,
        placeholder: "Enter service provider name",
      },
      {
        name: "provider_address",
        label: "Service Provider Address",
        type: "textarea",
        required: true,
        placeholder: "Enter service provider address",
      },
      {
        name: "services_description",
        label: "Services Description",
        type: "textarea",
        required: true,
        placeholder: "Describe the services to be provided",
      },
      {
        name: "payment_amount",
        label: "Payment Amount (INR)",
        type: "number",
        required: true,
        placeholder: "Enter payment amount",
      },
      {
        name: "payment_terms",
        label: "Payment Terms",
        type: "select",
        required: true,
        options: ["Monthly", "One-time", "Quarterly", "Upon completion"],
      },
      {
        name: "start_date",
        label: "Start Date",
        type: "date",
        required: true,
      },
      {
        name: "end_date",
        label: "End Date",
        type: "date",
        required: true,
      },
    ],
    3: [
      // Employment Contract
      {
        name: "company_name",
        label: "Company Name",
        type: "text",
        required: true,
        placeholder: "Enter company name",
      },
      {
        name: "company_address",
        label: "Company Address",
        type: "textarea",
        required: true,
        placeholder: "Enter company address",
      },
      {
        name: "employee_name",
        label: "Employee Name",
        type: "text",
        required: true,
        placeholder: "Enter employee name",
      },
      {
        name: "employee_address",
        label: "Employee Address",
        type: "textarea",
        required: true,
        placeholder: "Enter employee address",
      },
      {
        name: "job_title",
        label: "Job Title",
        type: "text",
        required: true,
        placeholder: "Enter job title",
      },
      {
        name: "start_date",
        label: "Start Date",
        type: "date",
        required: true,
      },
      {
        name: "annual_ctc",
        label: "Annual CTC (INR)",
        type: "number",
        required: true,
        placeholder: "Enter annual CTC",
      },
      {
        name: "notice_period",
        label: "Notice Period (Days)",
        type: "number",
        required: true,
        placeholder: "Enter notice period in days",
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
        name: "landlord_address",
        label: "Landlord Address",
        type: "textarea",
        required: true,
        placeholder: "Enter landlord's address",
      },
      {
        name: "tenant_name",
        label: "Tenant Name",
        type: "text",
        required: true,
        placeholder: "Enter tenant's full name",
      },
      {
        name: "tenant_address",
        label: "Tenant Address",
        type: "textarea",
        required: true,
        placeholder: "Enter tenant's address",
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
        name: "security_deposit",
        label: "Security Deposit (₹)",
        type: "number",
        required: true,
        placeholder: "Enter security deposit amount",
      },
      {
        name: "lease_duration",
        label: "Lease Duration (Months)",
        type: "number",
        required: true,
        placeholder: "Enter lease duration in months",
      },
      {
        name: "start_date",
        label: "Lease Start Date",
        type: "date",
        required: true,
      },
      {
        name: "city",
        label: "City",
        type: "text",
        required: true,
        placeholder: "Enter city name",
      },
    ],
    5: [
      // Offer Letter
      {
        name: "company_name",
        label: "Company Name",
        type: "text",
        required: true,
        placeholder: "Enter company name",
      },
      {
        name: "company_address",
        label: "Company Address",
        type: "textarea",
        required: true,
        placeholder: "Enter company address",
      },
      {
        name: "company_phone",
        label: "Company Phone/Email",
        type: "text",
        required: true,
        placeholder: "Enter phone/email",
      },
      {
        name: "candidate_name",
        label: "Candidate Name",
        type: "text",
        required: true,
        placeholder: "Enter candidate name",
      },
      {
        name: "candidate_address",
        label: "Candidate Address",
        type: "textarea",
        required: true,
        placeholder: "Enter candidate address",
      },
      {
        name: "job_title",
        label: "Job Title",
        type: "text",
        required: true,
        placeholder: "Enter job title",
      },
      {
        name: "start_date",
        label: "Start Date",
        type: "date",
        required: true,
      },
      {
        name: "manager_name",
        label: "Reporting Manager",
        type: "text",
        required: true,
        placeholder: "Enter manager name",
      },
      {
        name: "office_location",
        label: "Office Location",
        type: "text",
        required: true,
        placeholder: "Enter office location",
      },
      {
        name: "annual_ctc",
        label: "Annual CTC (INR)",
        type: "number",
        required: true,
        placeholder: "Enter annual CTC",
      },
    ],
    6: [
      // Resignation Acceptance
      {
        name: "company_name",
        label: "Company Name",
        type: "text",
        required: true,
        placeholder: "Enter company name",
      },
      {
        name: "company_address",
        label: "Company Address",
        type: "textarea",
        required: true,
        placeholder: "Enter company address",
      },
      {
        name: "employee_name",
        label: "Employee Name",
        type: "text",
        required: true,
        placeholder: "Enter employee name",
      },
      {
        name: "employee_address",
        label: "Employee Address",
        type: "textarea",
        required: true,
        placeholder: "Enter employee address",
      },
      {
        name: "resignation_date",
        label: "Resignation Date",
        type: "date",
        required: true,
      },
      {
        name: "last_working_date",
        label: "Last Working Date",
        type: "date",
        required: true,
      },
    ],
    7: [
      // Affidavit
      {
        name: "full_name",
        label: "Full Name",
        type: "text",
        required: true,
        placeholder: "Enter full name",
      },
      {
        name: "age",
        label: "Age",
        type: "number",
        required: true,
        placeholder: "Enter age",
      },
      {
        name: "parent_name",
        label: "Parent's Name",
        type: "text",
        required: true,
        placeholder: "Enter parent's name",
      },
      {
        name: "full_address",
        label: "Full Address",
        type: "textarea",
        required: true,
        placeholder: "Enter complete address",
      },
      {
        name: "purpose",
        label: "Purpose",
        type: "textarea",
        required: true,
        placeholder: "State the purpose (e.g., name correction, address proof, etc.)",
      },
      {
        name: "city",
        label: "City",
        type: "text",
        required: true,
        placeholder: "Enter city name",
      },
    ],
    8: [
      // Partnership Agreement
      {
        name: "partner_a_name",
        label: "Partner A Name",
        type: "text",
        required: true,
        placeholder: "Enter Partner A name",
      },
      {
        name: "partner_a_address",
        label: "Partner A Address",
        type: "textarea",
        required: true,
        placeholder: "Enter Partner A address",
      },
      {
        name: "partner_b_name",
        label: "Partner B Name",
        type: "text",
        required: true,
        placeholder: "Enter Partner B name",
      },
      {
        name: "partner_b_address",
        label: "Partner B Address",
        type: "textarea",
        required: true,
        placeholder: "Enter Partner B address",
      },
      {
        name: "firm_name",
        label: "Firm Name",
        type: "text",
        required: true,
        placeholder: "Enter partnership firm name",
      },
      {
        name: "business_nature",
        label: "Nature of Business",
        type: "textarea",
        required: true,
        placeholder: "Describe the nature of business",
      },
      {
        name: "capital_a",
        label: "Partner A Capital (INR)",
        type: "number",
        required: true,
        placeholder: "Enter Partner A capital contribution",
      },
      {
        name: "capital_b",
        label: "Partner B Capital (INR)",
        type: "number",
        required: true,
        placeholder: "Enter Partner B capital contribution",
      },
    ],
    9: [
      // Consulting Agreement
      {
        name: "client_name",
        label: "Client Name",
        type: "text",
        required: true,
        placeholder: "Enter client name",
      },
      {
        name: "client_address",
        label: "Client Address",
        type: "textarea",
        required: true,
        placeholder: "Enter client address",
      },
      {
        name: "consultant_name",
        label: "Consultant Name",
        type: "text",
        required: true,
        placeholder: "Enter consultant name",
      },
      {
        name: "consultant_address",
        label: "Consultant Address",
        type: "textarea",
        required: true,
        placeholder: "Enter consultant address",
      },
      {
        name: "services_description",
        label: "Description of Services",
        type: "textarea",
        required: true,
        placeholder: "Describe the consulting services",
      },
      {
        name: "start_date",
        label: "Start Date",
        type: "date",
        required: true,
      },
      {
        name: "end_date",
        label: "End Date",
        type: "date",
        required: true,
      },
    ],
    10: [
      // Licensing Agreement
      {
        name: "licensor_name",
        label: "Licensor Name",
        type: "text",
        required: true,
        placeholder: "Enter licensor name",
      },
      {
        name: "licensor_address",
        label: "Licensor Address",
        type: "textarea",
        required: true,
        placeholder: "Enter licensor address",
      },
      {
        name: "licensee_name",
        label: "Licensee Name",
        type: "text",
        required: true,
        placeholder: "Enter licensee name",
      },
      {
        name: "licensee_address",
        label: "Licensee Address",
        type: "textarea",
        required: true,
        placeholder: "Enter licensee address",
      },
      {
        name: "product_name",
        label: "Software/Product Name",
        type: "text",
        required: true,
        placeholder: "Enter software/product name",
      },
      {
        name: "license_fee",
        label: "License Fee (INR)",
        type: "number",
        required: true,
        placeholder: "Enter license fee",
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
    2: generateServiceAgreement,
    3: generateEmploymentContract,
    4: generateRentalAgreement,
    5: generateOfferLetter,
    6: generateResignationAcceptance,
    7: generateAffidavit,
    8: generatePartnershipAgreement,
    9: generateConsultingAgreement,
    10: generateLicensingAgreement,
  }

  const generator = templates[template.id] || generateGenericDocument
  return generator(formData, template)
}

function getTemplatePreview(template) {
  const governmentStyle = `
    font-family: 'Times New Roman', serif; 
    line-height: 1.8; 
    color: #000; 
    background: #fff;
    border: 3px solid #000;
    padding: 40px;
    margin: 20px;
    position: relative;
  `

  const headerStyle = `
    text-align: center; 
    margin-bottom: 30px; 
    border-bottom: 3px double #000; 
    padding-bottom: 20px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    margin: -40px -40px 30px -40px;
    padding: 30px 40px 20px 40px;
  `

  const sectionStyle = `
    margin: 20px 0; 
    padding: 15px 0; 
    border-bottom: 1px solid #ccc;
  `

  const signatureStyle = `
    margin-top: 60px; 
    display: flex; 
    justify-content: space-between; 
    align-items: center;
  `

  const getOfficialSeal = (needsSeal) => {
    if (!needsSeal) return ""
    return `
      <div style="position: absolute; top: 20px; right: 20px; width: 100px; height: 100px;">
        <img src="/images/government-seal.png" alt="Government Seal" style="width: 100%; height: 100%; object-fit: contain;" />
      </div>
    `
  }

  const data = {
    company_name: "[COMPANY NAME]",
    company_address: "[COMPANY ADDRESS]",
    company_phone: "[PHONE/EMAIL]",
    candidate_name: "[CANDIDATE NAME]",
    candidate_address: "[CANDIDATE ADDRESS]",
    job_title: "[JOB TITLE]",
    start_date: "[START DATE]",
    manager_name: "[MANAGER NAME]",
    office_location: "[OFFICE LOCATION]",
    annual_ctc: "[CTC AMOUNT]",
  }

  const currentDate = new Date().toLocaleDateString("en-GB")

  const previews = {
    1: `
      <div style="${governmentStyle}">
        ${getOfficialSeal(template.needsGovernmentSeal)}
        <div style="${headerStyle}">
          <h1 style="font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
            🇮🇳 NON-DISCLOSURE AGREEMENT 🇮🇳
          </h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; font-style: italic;">
            Under the Indian Contract Act, 1872
          </p>
        </div>

        <p style="text-align: justify; margin-bottom: 25px; font-weight: 500;">
          This Agreement is made on <strong>[DATE]</strong> between:
        </p>

        <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border: 2px solid #000; border-left: 6px solid #000;">
          <p style="margin: 10px 0; font-weight: bold;">
            <u>Disclosing Party:</u> [NAME], [ADDRESS]
          </p>
          <p style="margin: 10px 0; font-weight: bold;">
            <u>Receiving Party:</u> [NAME], [ADDRESS]
          </p>
        </div>

        <div style="${sectionStyle}">
          <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">1. PURPOSE:</h3>
          <p style="text-align: justify; margin-left: 20px;">
            The Disclosing Party agrees to share certain confidential information with the Receiving Party solely for the purpose of <strong>[PROJECT/PURPOSE]</strong>.
          </p>
        </div>

        <div style="${sectionStyle}">
          <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">2. CONFIDENTIAL INFORMATION:</h3>
          <p style="text-align: justify; margin-left: 20px;">
            Includes, but is not limited to: business plans, financial data, customer lists, trade secrets, etc.
          </p>
        </div>

        <div style="${signatureStyle}">
          <div style="text-align: center; width: 45%;">
            <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="font-weight: bold;">(DISCLOSING PARTY)</p>
          </div>
          <div style="text-align: center; width: 45%;">
            <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="font-weight: bold;">(RECEIVING PARTY)</p>
          </div>
        </div>
      </div>
    `,
    2: `
      <div style="${governmentStyle}">
        ${getOfficialSeal(template.needsGovernmentSeal)}
        <div style="${headerStyle}">
          <h1 style="font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
            🇮🇳 SERVICE AGREEMENT 🇮🇳
          </h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; font-style: italic;">
            Under the Indian Contract Act, 1872
          </p>
        </div>

        <p style="text-align: justify; margin-bottom: 25px; font-weight: 500;">
          This Agreement is made on <strong>[DATE]</strong> between:
        </p>

        <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border: 2px solid #000; border-left: 6px solid #000;">
          <p style="margin: 10px 0; font-weight: bold;">
            <u>Client:</u> [CLIENT NAME], [CLIENT ADDRESS]
          </p>
          <p style="margin: 10px 0; font-weight: bold;">
            <u>Service Provider:</u> [SERVICE PROVIDER NAME], [ADDRESS]
          </p>
        </div>

        <div style="${sectionStyle}">
          <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">1. SCOPE OF SERVICES:</h3>
          <p style="text-align: justify; margin-left: 20px;">
            The Service Provider agrees to provide the following services: <strong>[DESCRIBE SERVICES]</strong>.
          </p>
        </div>

        <div style="${signatureStyle}">
          <div style="text-align: center; width: 45%;">
            <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="font-weight: bold;">(CLIENT)</p>
          </div>
          <div style="text-align: center; width: 45%;">
            <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="font-weight: bold;">(SERVICE PROVIDER)</p>
          </div>
        </div>
      </div>
    `,
    3: `
      <div style="${governmentStyle}">
        ${getOfficialSeal(template.needsGovernmentSeal)}
        <div style="${headerStyle}">
          <h1 style="font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
            🇮🇳 EMPLOYMENT CONTRACT 🇮🇳
          </h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; font-style: italic;">
            Under Indian Labor Laws
          </p>
        </div>

        <p style="text-align: justify; margin-bottom: 25px; font-weight: 500;">
          This Employment Agreement is made on <strong>[DATE]</strong> between:
        </p>

        <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border: 2px solid #000; border-left: 6px solid #000;">
          <p style="margin: 10px 0; font-weight: bold;">
            <u>Employer:</u> [COMPANY NAME], [ADDRESS]
          </p>
          <p style="margin: 10px 0; font-weight: bold;">
            <u>Employee:</u> [EMPLOYEE NAME], [ADDRESS]
          </p>
        </div>

        <div style="${sectionStyle}">
          <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">1. POSITION:</h3>
          <p style="text-align: justify; margin-left: 20px;">
            The Employee is hired as <strong>[JOB TITLE]</strong>, starting from <strong>[START DATE]</strong>.
          </p>
        </div>

        <div style="${signatureStyle}">
          <div style="text-align: center; width: 45%;">
            <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="font-weight: bold;">(EMPLOYER)</p>
          </div>
          <div style="text-align: center; width: 45%;">
            <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="font-weight: bold;">(EMPLOYEE)</p>
          </div>
        </div>
      </div>
    `,
    4: `
      <div style="${governmentStyle}">
        ${getOfficialSeal(template.needsGovernmentSeal)}
        <div style="${headerStyle}">
          <h1 style="font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
            🇮🇳 RESIDENTIAL LEASE AGREEMENT 🇮🇳
          </h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; font-style: italic;">
            Under the Model Tenancy Act, 2019
          </p>
        </div>

        <p style="text-align: justify; margin-bottom: 25px; font-weight: 500;">
          This Agreement is made on <strong>[DATE]</strong> at <strong>[CITY, STATE]</strong> between:
        </p>

        <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border: 2px solid #000; border-left: 6px solid #000;">
          <p style="margin: 10px 0; font-weight: bold;">
            <u>Lessor:</u> [LANDLORD NAME], residing at [LANDLORD ADDRESS]
          </p>
          <p style="margin: 10px 0; font-weight: bold; text-align: center;">AND</p>
          <p style="margin: 10px 0; font-weight: bold;">
            <u>Lessee:</u> [TENANT NAME], residing at [TENANT ADDRESS]
          </p>
        </div>

        <div style="${sectionStyle}">
          <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">1. PREMISES & TERM:</h3>
          <p style="text-align: justify; margin-left: 20px;">
            The lessor agrees to lease the property at <strong>[PROPERTY ADDRESS]</strong> to the lessee for a period of <strong>[LEASE DURATION]</strong> months.
          </p>
        </div>

        <div style="${signatureStyle}">
          <div style="text-align: center; width: 45%;">
            <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="font-weight: bold;">(LANDLORD SIGNATURE)</p>
          </div>
          <div style="text-align: center; width: 45%;">
            <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="font-weight: bold;">(TENANT SIGNATURE)</p>
          </div>
        </div>
      </div>
    `,
    5: `
      <div style="${governmentStyle}">
        <div style="${headerStyle}">
          <div style="text-align: left; margin-bottom: 20px;">
            <h2 style="font-size: 20px; font-weight: bold; margin: 0; color: #000;">
              [COMPANY NAME]
            </h2>
            <p style="margin: 5px 0; font-size: 14px;">[COMPANY ADDRESS]</p>
            <p style="margin: 5px 0; font-size: 14px;">[PHONE/EMAIL]</p>
          </div>
          <p style="text-align: right; margin: 0; font-weight: bold;">Date: [OFFER DATE]</p>
        </div>

        <div style="margin: 30px 0;">
          <p style="margin: 10px 0;">To,</p>
          <p style="margin: 10px 0; font-weight: bold;">[CANDIDATE NAME]</p>
          <p style="margin: 10px 0;">[CANDIDATE ADDRESS]</p>
        </div>

        <div style="margin: 30px 0; text-align: center;">
          <p style="font-weight: bold; text-decoration: underline; font-size: 16px;">
            Subject: Employment Offer for the Position of [JOB TITLE]
          </p>
        </div>

        <p style="margin: 20px 0;">Dear <strong>[CANDIDATE NAME]</strong>,</p>

        <p style="text-align: justify; margin: 20px 0;">
          We are pleased to offer you the position of <strong>[JOB TITLE]</strong> at <strong>[COMPANY NAME]</strong> with the following terms:
        </p>

        <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border: 2px solid #000;">
          <p style="margin: 10px 0;"><strong>1. Date of Joining:</strong> [START DATE]</p>
          <p style="margin: 10px 0;"><strong>2. Reporting Manager:</strong> [MANAGER NAME]</p>
          <p style="margin: 10px 0;"><strong>3. Location:</strong> [OFFICE LOCATION]</p>
          <p style="margin: 10px 0;"><strong>4. Annual CTC:</strong> INR [CTC AMOUNT]</p>
          <p style="margin: 10px 0;"><strong>5. Work Schedule:</strong> Monday to Friday, 9:00 AM to 6:00 PM</p>
          <p style="margin: 10px 0;"><strong>6. Benefits:</strong> Provident Fund, ESIC, Health Insurance, Annual Leaves</p>
        </div>

        <div style="margin-top: 50px; text-align: right;">
          <p style="margin: 10px 0;">Accepted By:</p>
          <div style="border-bottom: 2px solid #000; width: 200px; margin: 20px 0 10px auto;"></div>
          <p style="margin: 10px 0; font-weight: bold;">[CANDIDATE SIGNATURE]</p>
        </div>
      </div>
    `,
    6: `
      <div style="${governmentStyle}">
        <div style="${headerStyle}">
          <div style="text-align: left; margin-bottom: 20px;">
            <h2 style="font-size: 20px; font-weight: bold; margin: 0; color: #000;">
              [COMPANY LETTERHEAD]
            </h2>
            <p style="margin: 5px 0; font-size: 14px;">[COMPANY ADDRESS]</p>
          </div>
          <p style="text-align: right; margin: 0; font-weight: bold;">Date: [CURRENT DATE]</p>
        </div>

        <div style="margin: 30px 0;">
          <p style="margin: 10px 0;">To,</p>
          <p style="margin: 10px 0; font-weight: bold;">${data.employee_name || "[EMPLOYEE NAME]"}</p>
          <p style="margin: 10px 0;">${data.employee_address || "[EMPLOYEE ADDRESS]"}</p>
        </div>

        <div style="margin: 30px 0; text-align: center;">
          <p style="font-weight: bold; text-decoration: underline; font-size: 16px;">
            Subject: Resignation Acceptance – [EMPLOYEE ID / DESIGNATION]
          </p>
        </div>

        <p style="margin: 20px 0;">Dear <strong>${data.employee_name || "[EMPLOYEE NAME]"}</strong>,</p>

        <p style="text-align: justify; margin: 20px 0;">
          This letter is to formally acknowledge the receipt of your resignation dated <strong>${data.resignation_date || "[RESIGNATION DATE]"}</strong>. Your last working day with <strong>${data.company_name || "[COMPANY NAME]"}</strong> will be <strong>${data.last_working_date || "[LAST WORKING DATE]"}</strong>.
        </p>

        <p style="text-align: justify; margin: 20px 0;">
          You are requested to ensure a complete handover of your responsibilities to [REPORTING MANAGER/TEAM MEMBER] and return all company assets by your last working day.
        </p>

        <p style="text-align: justify; margin: 20px 0;">
          Your final settlement, including salary dues and leave encashments (if any), will be processed on or before [SETTLEMENT DATE].
        </p>

        <p style="text-align: justify; margin: 20px 0;">
          We appreciate your contributions and wish you all the very best in your future endeavors.
        </p>

        <div style="margin-top: 50px;">
          <p style="margin: 10px 0;">Sincerely,</p>
          <p style="margin: 10px 0; font-weight: bold;">[HR NAME]</p>
          <p style="margin: 10px 0;">[DESIGNATION]</p>
          <p style="margin: 10px 0;">${data.company_name || "[COMPANY NAME]"}</p>
        </div>
      </div>
    `,
    7: `
      <div style="${governmentStyle}">
        ${getOfficialSeal(template.needsGovernmentSeal)}
        <div style="${headerStyle}">
          <h1 style="font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
            🇮🇳 AFFIDAVIT 🇮🇳
          </h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; font-style: italic;">
            Under the Indian Evidence Act, 1872
          </p>
        </div>

        <p style="text-align: justify; margin-bottom: 25px; font-weight: 500;">
          I, <strong>${data.full_name || "[FULL NAME]"}</strong>, aged <strong>${data.age || "[AGE]"}</strong>, son/daughter of <strong>${data.parent_name || "[PARENT'S NAME]"}</strong>, residing at <strong>${data.full_address || "[FULL ADDRESS]"}</strong>, do hereby solemnly affirm and declare as under:
        </p>

        <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border: 2px solid #000; border-left: 6px solid #000;">
          <p style="margin: 15px 0; text-align: justify;">
            <strong>1.</strong> That I am a citizen of India and residing at the above-mentioned address.
          </p>
          <p style="margin: 15px 0; text-align: justify;">
            <strong>2.</strong> That I am making this declaration for the purpose of <strong>${data.purpose || "[STATE THE PURPOSE, e.g., applying for name correction, address proof, etc.]"}</strong>.
          </p>
          <p style="margin: 15px 0; text-align: justify;">
            <strong>3.</strong> That all the facts stated above are true to the best of my knowledge and belief.
          </p>
        </div>

        <div style="margin: 40px 0; padding: 20px; border: 2px solid #000;">
          <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline; text-align: center;">VERIFICATION</h3>
          <p style="text-align: justify; margin: 15px 0;">
            I, the above-named deponent, do hereby verify that the contents of this affidavit are true and correct to the best of my knowledge and belief. No part of it is false and nothing material has been concealed therein.
          </p>
        </div>

        <div style="margin-top: 50px; display: flex; justify-content: space-between;">
          <div>
            <p style="margin: 10px 0;"><strong>Place:</strong> ${data.city || "[CITY]"}</p>
            <p style="margin: 10px 0;"><strong>Date:</strong> ${currentDate}</p>
          </div>
          <div style="text-align: center;">
            <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="margin: 5px 0; font-weight: bold;">Deponent's Signature</p>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${data.full_name || "[FULL NAME]"}</p>
            <p style="margin: 5px 0;"><strong>AADHAR No./PAN No.:</strong> [ID NUMBER]</p>
          </div>
        </div>

        <div style="margin-top: 40px; text-align: center; border: 2px solid #000; padding: 20px;">
          <p style="font-weight: bold; font-size: 16px;">(Should be Notarized)</p>
        </div>
      </div>
    `,
    8: `
      <div style="${governmentStyle}">
        ${getOfficialSeal(template.needsGovernmentSeal)}
        <div style="${headerStyle}">
          <h1 style="font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
            🇮🇳 PARTNERSHIP AGREEMENT 🇮🇳
          </h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; font-style: italic;">
            Under the Indian Partnership Act, 1932
          </p>
        </div>

        <p style="text-align: justify; margin-bottom: 25px; font-weight: 500;">
          This Agreement is made on <strong>[DATE]</strong> between:
        </p>

        <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border: 2px solid #000; border-left: 6px solid #000;">
          <p style="margin: 10px 0; font-weight: bold;">
            <u>Partner A:</u> ${data.partner_a_name || "[Name]"}, ${data.partner_a_address || "[Address]"}
          </p>
          <p style="margin: 10px 0; font-weight: bold;">
            <u>Partner B:</u> ${data.partner_b_name || "[Name]"}, ${data.partner_b_address || "[Address]"}
          </p>
        </div>

        <div style="${sectionStyle}">
          <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">1. NAME & PURPOSE:</h3>
          <p style="text-align: justify; margin-left: 20px;">
            The partnership shall operate under the name <strong>${data.firm_name || "[Firm Name]"}</strong> for the purpose of <strong>${data.business_nature || "[Nature of Business]"}</strong>.
          </p>
        </div>

        <div style="${signatureStyle}">
          <div style="text-align: center; width: 45%;">
            <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="font-weight: bold;">(PARTNER A)</p>
          </div>
          <div style="text-align: center; width: 45%;">
            <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="font-weight: bold;">(PARTNER B)</p>
          </div>
        </div>
      </div>
    `,
    9: `
      <div style="${governmentStyle}">
        ${getOfficialSeal(template.needsGovernmentSeal)}
        <div style="${headerStyle}">
          <h1 style="font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
            🇮🇳 CONSULTING AGREEMENT 🇮🇳
          </h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; font-style: italic;">
            Under the Indian Contract Act, 1872
          </p>
        </div>

        <p style="text-align: justify; margin-bottom: 25px; font-weight: 500;">
          This Agreement is made on <strong>[DATE]</strong> between:
        </p>

        <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border: 2px solid #000; border-left: 6px solid #000;">
          <p style="margin: 10px 0; font-weight: bold;">
            <u>Client:</u> ${data.client_name || "[CLIENT NAME]"}, ${data.client_address || "[ADDRESS]"}
          </p>
          <p style="margin: 10px 0; font-weight: bold;">
            <u>Consultant:</u> ${data.consultant_name || "[CONSULTANT NAME]"}, ${data.consultant_address || "[ADDRESS]"}
          </p>
        </div>

        <div style="${sectionStyle}">
          <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">1. SERVICES:</h3>
          <p style="text-align: justify; margin-left: 20px;">
            Consultant agrees to provide <strong>${data.services_description || "[DESCRIPTION OF SERVICES]"}</strong> from <strong>${data.start_date || "[START DATE]"}</strong> to <strong>${data.end_date || "[END DATE]"}</strong>.
          </p>
        </div>

        <div style="${signatureStyle}">
          <div style="text-align: center; width: 45%;">
            <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="font-weight: bold;">(CLIENT)</p>
          </div>
          <div style="text-align: center; width: 45%;">
            <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="font-weight: bold;">(CONSULTANT)</p>
          </div>
        </div>
      </div>
    `,
    10: `
      <div style="${governmentStyle}">
        ${getOfficialSeal(template.needsGovernmentSeal)}
        <div style="${headerStyle}">
          <h1 style="font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
            🇮🇳 LICENSING AGREEMENT 🇮🇳
          </h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; font-style: italic;">
            Under Indian Jurisdiction
          </p>
        </div>

        <p style="text-align: justify; margin-bottom: 25px; font-weight: 500;">
          This Agreement is made on <strong>[DATE]</strong> between:
        </p>

        <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border: 2px solid #000; border-left: 6px solid #000;">
          <p style="margin: 10px 0; font-weight: bold;">
            <u>Licensor:</u> ${data.licensor_name || "[COMPANY/INDIVIDUAL NAME]"}, ${data.licensor_address || "[ADDRESS]"}
          </p>
          <p style="margin: 10px 0; font-weight: bold;">
            <u>Licensee:</u> ${data.licensee_name || "[LICENSEE NAME]"}, ${data.licensee_address || "[ADDRESS]"}
          </p>
        </div>

        <div style="${sectionStyle}">
          <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">1. GRANT OF LICENSE:</h3>
          <p style="text-align: justify; margin-left: 20px;">
            The Licensor grants the Licensee a non-exclusive, non-transferable license to use <strong>${data.product_name || "[SOFTWARE/PRODUCT NAME]"}</strong> in India.
          </p>
        </div>

        <div style="${signatureStyle}">
          <div style="text-align: center; width: 45%;">
            <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="font-weight: bold;">(LICENSOR)</p>
          </div>
          <div style="text-align: center; width: 45%;">
            <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="font-weight: bold;">(LICENSEE)</p>
          </div>
        </div>
      </div>
    `,
  }

  
  return (
    previews[template.id] ||
    `
    <div style="${governmentStyle}">
      ${getOfficialSeal(template.needsGovernmentSeal)}
      <div style="${headerStyle}">
        <h1 style="font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
          🇮🇳 ${template.name.toUpperCase()} 🇮🇳
        </h1>
        <p style="margin: 10px 0 0 0; font-size: 14px; font-style: italic;">
          Government of India
        </p>
      </div>
      <p style="text-align: justify; margin: 20px 0;">
        This is a preview of the ${template.name} template. Use the template editor to fill in your specific details and generate the complete document.
      </p>
    </div>
  `
  )
}

// Updated document generators with government styling and real seal
function generateNDADocument(data, template) {
  const currentDate = new Date().toLocaleDateString("en-GB")
  const governmentSeal = template.needsGovernmentSeal
    ? `
    <div style="position: absolute; top: 20px; right: 20px; width: 100px; height: 100px;">
      <img src="/images/government-seal.png" alt="Government Seal" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  `
    : ""

  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.8; color: #000; background: #fff; border: 3px solid #000; padding: 40px; margin: 20px; position: relative;">
      ${governmentSeal}
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px double #000; padding-bottom: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); margin: -40px -40px 30px -40px; padding: 30px 40px 20px 40px;">
        <h1 style="font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
          🇮🇳 NON-DISCLOSURE AGREEMENT 🇮🇳
        </h1>
        <p style="margin: 10px 0 0 0; font-size: 14px; font-style: italic;">
          Under the Indian Contract Act, 1872
        </p>
      </div>

      <p style="text-align: justify; margin-bottom: 25px; font-weight: 500;">
        This Agreement is made on <strong>${currentDate}</strong> between:
      </p>

      <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border: 2px solid #000; border-left: 6px solid #000;">
        <p style="margin: 10px 0; font-weight: bold;">
          <u>Disclosing Party:</u> ${data.disclosing_party || "[Name]"}, ${data.disclosing_address || "[Address]"}
        </p>
        <p style="margin: 10px 0; font-weight: bold;">
          <u>Receiving Party:</u> ${data.receiving_party || "[Name]"}, ${data.receiving_address || "[Address]"}
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">1. PURPOSE:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The Disclosing Party agrees to share certain confidential information with the Receiving Party solely for the purpose of <strong>${data.purpose || "[Project/Purpose]"}</strong>.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">2. CONFIDENTIAL INFORMATION:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          Includes, but is not limited to: business plans, financial data, customer lists, trade secrets, etc.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">3. OBLIGATION:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The Receiving Party shall not disclose, reproduce, or use any confidential information for any purpose other than the one stated above.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">4. TERM:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          This Agreement remains in effect for a period of <strong>${data.duration || "[X]"} Years</strong> from the date of execution.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">5. GOVERNING LAW:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          This agreement is governed by the laws of India.
        </p>
      </div>

      <div style="margin-top: 60px; display: flex; justify-content: space-between; align-items: center;">
        <div style="text-align: center; width: 45%;">
          <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
          <p style="font-weight: bold;">(DISCLOSING PARTY)</p>
        </div>
        <div style="text-align: center; width: 45%;">
          <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
          <p style="font-weight: bold;">(RECEIVING PARTY)</p>
        </div>
      </div>
    </div>
  `
}

function generateServiceAgreement(data, template) {
  const currentDate = new Date().toLocaleDateString("en-GB")
  const governmentSeal = template.needsGovernmentSeal
    ? `
    <div style="position: absolute; top: 20px; right: 20px; width: 100px; height: 100px;">
      <img src="/images/government-seal.png" alt="Government Seal" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  `
    : ""

  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.8; color: #000; background: #fff; border: 3px solid #000; padding: 40px; margin: 20px; position: relative;">
      ${governmentSeal}
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px double #000; padding-bottom: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); margin: -40px -40px 30px -40px; padding: 30px 40px 20px 40px;">
        <h1 style="font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
          🇮🇳 SERVICE AGREEMENT 🇮🇳
        </h1>
        <p style="margin: 10px 0 0 0; font-size: 14px; font-style: italic;">
          Under the Indian Contract Act, 1872
        </p>
      </div>

      <p style="text-align: justify; margin-bottom: 25px; font-weight: 500;">
        This Agreement is made on <strong>${currentDate}</strong> between:
      </p>

      <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border: 2px solid #000; border-left: 6px solid #000;">
        <p style="margin: 10px 0; font-weight: bold;">
          <u>Client:</u> ${data.client_name || "[Client Name]"}, ${data.client_address || "[Client Address]"}
        </p>
        <p style="margin: 10px 0; font-weight: bold;">
          <u>Service Provider:</u> ${data.service_provider || "[Service Provider Name]"}, ${data.provider_address || "[Address]"}
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">1. SCOPE OF SERVICES:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The Service Provider agrees to provide the following services: <strong>${data.services_description || "[Describe Services]"}</strong>.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">2. DURATION:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The agreement is valid from <strong>${data.start_date || "[Start Date]"}</strong> to <strong>${data.end_date || "[End Date]"}</strong>.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">3. PAYMENT TERMS:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The Client shall pay INR <strong>${data.payment_amount || "[Amount]"}</strong> for the services, payable <strong>${data.payment_terms || "[Monthly/One-time]"}</strong> upon invoice.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">4. GOVERNING LAW:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          This Agreement shall be governed by the laws of India.
        </p>
      </div>

      <div style="margin-top: 60px; display: flex; justify-content: space-between; align-items: center;">
        <div style="text-align: center; width: 45%;">
          <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
          <p style="font-weight: bold;">(CLIENT)</p>
        </div>
        <div style="text-align: center; width: 45%;">
          <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
          <p style="font-weight: bold;">(SERVICE PROVIDER)</p>
        </div>
      </div>
    </div>
  `
}

function generateEmploymentContract(data, template) {
  const currentDate = new Date().toLocaleDateString("en-GB")
  const governmentSeal = template.needsGovernmentSeal
    ? `
    <div style="position: absolute; top: 20px; right: 20px; width: 100px; height: 100px;">
      <img src="/images/government-seal.png" alt="Government Seal" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  `
    : ""

  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.8; color: #000; background: #fff; border: 3px solid #000; padding: 40px; margin: 20px; position: relative;">
      ${governmentSeal}
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px double #000; padding-bottom: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); margin: -40px -40px 30px -40px; padding: 30px 40px 20px 40px;">
        <h1 style="font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
          🇮🇳 EMPLOYMENT CONTRACT 🇮🇳
        </h1>
        <p style="margin: 10px 0 0 0; font-size: 14px; font-style: italic;">
          Under Indian Labor Laws
        </p>
      </div>

      <p style="text-align: justify; margin-bottom: 25px; font-weight: 500;">
        This Employment Agreement is made on <strong>${currentDate}</strong> between:
      </p>

      <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border: 2px solid #000; border-left: 6px solid #000;">
        <p style="margin: 10px 0; font-weight: bold;">
          <u>Employer:</u> ${data.company_name || "[Company Name]"}, ${data.company_address || "[Address]"}
        </p>
        <p style="margin: 10px 0; font-weight: bold;">
          <u>Employee:</u> ${data.employee_name || "[Employee Name]"}, ${data.employee_address || "[Address]"}
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">1. POSITION:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The Employee is hired as <strong>${data.job_title || "[Job Title]"}</strong>, starting from <strong>${data.start_date || "[Start Date]"}</strong>.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">2. SALARY:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The Employee will receive an annual CTC of INR <strong>${data.annual_ctc || "[Amount]"}</strong>, payable monthly.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">3. WORK HOURS:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          Monday to Friday, 9:00 AM to 6:00 PM or as per company norms.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">4. TERMINATION:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          Either party may terminate this agreement with <strong>${data.notice_period || "[30]"} days</strong> notice.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">5. GOVERNING LAW:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          This agreement is governed under Indian labor laws.
        </p>
      </div>

      <div style="margin-top: 60px; display: flex; justify-content: space-between; align-items: center;">
        <div style="text-align: center; width: 45%;">
          <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
          <p style="font-weight: bold;">(EMPLOYER)</p>
        </div>
        <div style="text-align: center; width: 45%;">
          <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
          <p style="font-weight: bold;">(EMPLOYEE)</p>
        </div>
      </div>
    </div>
  `
}

function generateRentalAgreement(data, template) {
  const currentDate = new Date().toLocaleDateString("en-GB")
  const endDate = data.start_date
    ? new Date(
        new Date(data.start_date).getTime() + Number.parseInt(data.lease_duration || 12) * 30 * 24 * 60 * 60 * 1000,
      ).toLocaleDateString("en-GB")
    : "[End Date]"

  const governmentSeal = template.needsGovernmentSeal
    ? `
    <div style="position: absolute; top: 20px; right: 20px; width: 100px; height: 100px;">
      <img src="/images/government-seal.png" alt="Government Seal" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  `
    : ""

  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.8; color: #000; background: #fff; border: 3px solid #000; padding: 40px; margin: 20px; position: relative;">
      ${governmentSeal}
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px double #000; padding-bottom: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); margin: -40px -40px 30px -40px; padding: 30px 40px 20px 40px;">
        <h1 style="font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
          🇮🇳 RESIDENTIAL LEASE AGREEMENT 🇮🇳
        </h1>
        <p style="margin: 10px 0 0 0; font-size: 14px; font-style: italic;">
          Under the Model Tenancy Act, 2019
        </p>
      </div>

      <p style="text-align: justify; margin-bottom: 25px; font-weight: 500;">
        This Agreement is made on <strong>${currentDate}</strong> at <strong>${data.city || "[City]"}, State</strong> between:
      </p>

      <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border: 2px solid #000; border-left: 6px solid #000;">
        <p style="margin: 10px 0; font-weight: bold;">
          <u>Lessor:</u> ${data.landlord_name || "[Landlord Name]"}, residing at ${data.landlord_address || "[Landlord Address]"}
        </p>
        <p style="margin: 10px 0; font-weight: bold; text-align: center;">AND</p>
        <p style="margin: 10px 0; font-weight: bold;">
          <u>Lessee:</u> ${data.tenant_name || "[Tenant Name]"}, residing at ${data.tenant_address || "[Tenant Address]"}
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">1. PREMISES & TERM:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The lessor agrees to lease the property at <strong>${data.property_address || "[Property Address]"}</strong> to the lessee for a period of <strong>${data.lease_duration || "[Lease Duration]"} months</strong>, starting from <strong>${data.start_date || "[Start Date]"}</strong> to <strong>${endDate}</strong>.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">2. RENT & SECURITY DEPOSIT:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The monthly rent shall be INR <strong>${data.rent_amount || "[Rent Amount]"}</strong>, payable on or before the 5th of each month. A refundable security deposit of INR <strong>${data.security_deposit || "[Deposit Amount]"}</strong> shall be paid at the time of agreement signing.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">3. GOVERNING LAW:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          This agreement is governed under the Indian Contract Act, 1872 and the Model Tenancy Act, 2019.
        </p>
      </div>

      <div style="margin-top: 60px; text-align: center;">
        <p style="font-weight: bold; margin-bottom: 40px;">IN WITNESS WHEREOF, both parties have signed this agreement on the date mentioned above.</p>
        
        <div style="display: flex; justify-content: space-between; margin-top: 50px;">
          <div style="width: 45%; text-align: center;">
            <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="margin: 5px 0; font-weight: bold;">(LANDLORD SIGNATURE)</p>
          </div>
          <div style="width: 45%; text-align: center;">
            <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="margin: 5px 0; font-weight: bold;">(TENANT SIGNATURE)</p>
          </div>
        </div>

        <div style="margin-top: 40px;">
          <p style="font-weight: bold; margin-bottom: 20px;">Witnesses:</p>
          <div style="display: flex; justify-content: space-between;">
            <div style="width: 45%; text-align: center;">
              <div style="border-bottom: 1px solid #000; width: 200px; margin: 0 auto 10px;"></div>
              <p style="margin: 5px 0;">1. ________________________</p>
            </div>
            <div style="width: 45%; text-align: center;">
              <div style="border-bottom: 1px solid #000; width: 200px; margin: 0 auto 10px;"></div>
              <p style="margin: 5px 0;">2. ________________________</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

function generateOfferLetter(data, template) {
  const currentDate = new Date().toLocaleDateString("en-GB")

  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.8; color: #000; background: #fff; border: 3px solid #000; padding: 40px; margin: 20px; position: relative;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px double #000; padding-bottom: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); margin: -40px -40px 30px -40px; padding: 30px 40px 20px 40px;">
        <div style="text-align: left; margin-bottom: 20px;">
          <h2 style="font-size: 20px; font-weight: bold; margin: 0; color: #000;">
            ${data.company_name || "[COMPANY NAME]"}
          </h2>
          <p style="margin: 5px 0; font-size: 14px;">${data.company_address || "[COMPANY ADDRESS]"}</p>
          <p style="margin: 5px 0; font-size: 14px;">${data.company_phone || "[PHONE/EMAIL]"}</p>
        </div>
        <p style="text-align: right; margin: 0; font-weight: bold;">Date: ${currentDate}</p>
      </div>

      <div style="margin: 30px 0;">
        <p style="margin: 10px 0;">To,</p>
        <p style="margin: 10px 0; font-weight: bold;">${data.candidate_name || "[CANDIDATE NAME]"}</p>
        <p style="margin: 10px 0;">${data.candidate_address || "[CANDIDATE ADDRESS]"}</p>
      </div>

      <div style="margin: 30px 0; text-align: center;">
        <p style="font-weight: bold; text-decoration: underline; font-size: 16px;">
          Subject: Employment Offer for the Position of ${data.job_title || "[JOB TITLE]"}
        </p>
      </div>

      <p style="margin: 20px 0;">Dear <strong>${data.candidate_name || "[CANDIDATE NAME]"}</strong>,</p>

      <p style="text-align: justify; margin: 20px 0;">
        We are pleased to offer you the position of <strong>${data.job_title || "[JOB TITLE]"}</strong> at <strong>${data.company_name || "[COMPANY NAME]"}</strong> with the following terms:
      </p>

      <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border: 2px solid #000;">
        <p style="margin: 10px 0;"><strong>1. Date of Joining:</strong> ${data.start_date || "[START DATE]"}</p>
        <p style="margin: 10px 0;"><strong>2. Reporting Manager:</strong> ${data.manager_name || "[MANAGER NAME]"}</p>
        <p style="margin: 10px 0;"><strong>3. Location:</strong> ${data.office_location || "[OFFICE LOCATION]"}</p>
        <p style="margin: 10px 0;"><strong>4. Annual CTC:</strong> INR ${data.annual_ctc || "[CTC AMOUNT]"}</p>
        <p style="margin: 10px 0;"><strong>5. Work Schedule:</strong> Monday to Friday, 9:00 AM to 6:00 PM</p>
        <p style="margin: 10px 0;"><strong>6. Benefits:</strong> Provident Fund, ESIC, Health Insurance, Annual Leaves</p>
      </div>

      <p style="text-align: justify; margin: 20px 0;">
        Please sign and return this letter by <strong>[ACCEPT BY DATE]</strong> to confirm your acceptance.
      </p>

      <div style="margin-top: 50px;">
        <p style="margin: 10px 0;">Sincerely,</p>
        <p style="margin: 10px 0; font-weight: bold;">[HR NAME]</p>
        <p style="margin: 10px 0;">[HR DESIGNATION]</p>
        <p style="margin: 10px 0;">${data.company_name || "[COMPANY NAME]"}</p>
      </div>

      <div style="margin-top: 50px; text-align: right;">
        <p style="margin: 10px 0;">Accepted By:</p>
        <div style="border-bottom: 2px solid #000; width: 200px; margin: 20px 0 10px auto;"></div>
        <p style="margin: 10px 0; font-weight: bold;">[CANDIDATE SIGNATURE]</p>
      </div>
    </div>
  `
}

function generateResignationAcceptance(data, template) {
  const currentDate = new Date().toLocaleDateString("en-GB")

  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.8; color: #000; background: #fff; border: 3px solid #000; padding: 40px; margin: 20px; position: relative;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px double #000; padding-bottom: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); margin: -40px -40px 30px -40px; padding: 30px 40px 20px 40px;">
        <div style="text-align: left; margin-bottom: 20px;">
          <h2 style="font-size: 20px; font-weight: bold; margin: 0; color: #000;">
            ${data.company_name || "[COMPANY LETTERHEAD]"}
          </h2>
          <p style="margin: 5px 0; font-size: 14px;">${data.company_address || "[COMPANY ADDRESS]"}</p>
        </div>
        <p style="text-align: right; margin: 0; font-weight: bold;">Date: ${currentDate}</p>
      </div>

      <div style="margin: 30px 0;">
        <p style="margin: 10px 0;">To,</p>
        <p style="margin: 10px 0; font-weight: bold;">${data.employee_name || "[EMPLOYEE NAME]"}</p>
        <p style="margin: 10px 0;">${data.employee_address || "[EMPLOYEE ADDRESS]"}</p>
      </div>

      <div style="margin: 30px 0; text-align: center;">
        <p style="font-weight: bold; text-decoration: underline; font-size: 16px;">
          Subject: Resignation Acceptance – [EMPLOYEE ID / DESIGNATION]
        </p>
      </div>

      <p style="margin: 20px 0;">Dear <strong>${data.employee_name || "[EMPLOYEE NAME]"}</strong>,</p>

      <p style="text-align: justify; margin: 20px 0;">
        This letter is to formally acknowledge the receipt of your resignation dated <strong>${data.resignation_date || "[RESIGNATION DATE]"}</strong>. Your last working day with <strong>${data.company_name || "[COMPANY NAME]"}</strong> will be <strong>${data.last_working_date || "[LAST WORKING DATE]"}</strong>.
      </p>

      <p style="text-align: justify; margin: 20px 0;">
        You are requested to ensure a complete handover of your responsibilities to [REPORTING MANAGER/TEAM MEMBER] and return all company assets by your last working day.
      </p>

      <p style="text-align: justify; margin: 20px 0;">
        Your final settlement, including salary dues and leave encashments (if any), will be processed on or before [SETTLEMENT DATE].
      </p>

      <p style="text-align: justify; margin: 20px 0;">
        We appreciate your contributions and wish you all the very best in your future endeavors.
      </p>

      <div style="margin-top: 50px;">
        <p style="margin: 10px 0;">Sincerely,</p>
        <p style="margin: 10px 0; font-weight: bold;">[HR NAME]</p>
        <p style="margin: 10px 0;">[DESIGNATION]</p>
        <p style="margin: 10px 0;">${data.company_name || "[COMPANY NAME]"}</p>
      </div>
    </div>
  `
}

function generateAffidavit(data, template) {
  const currentDate = new Date().toLocaleDateString("en-GB")
  const governmentSeal = template.needsGovernmentSeal
    ? `
    <div style="position: absolute; top: 20px; right: 20px; width: 100px; height: 100px;">
      <img src="/images/government-seal.png" alt="Government Seal" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  `
    : ""

  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.8; color: #000; background: #fff; border: 3px solid #000; padding: 40px; margin: 20px; position: relative;">
      ${governmentSeal}
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px double #000; padding-bottom: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); margin: -40px -40px 30px -40px; padding: 30px 40px 20px 40px;">
        <h1 style="font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
          🇮🇳 AFFIDAVIT 🇮🇳
        </h1>
        <p style="margin: 10px 0 0 0; font-size: 14px; font-style: italic;">
          Under the Indian Evidence Act, 1872
        </p>
      </div>

      <p style="text-align: justify; margin-bottom: 25px; font-weight: 500;">
        I, <strong>${data.full_name || "[FULL NAME]"}</strong>, aged <strong>${data.age || "[AGE]"}</strong>, son/daughter of <strong>${data.parent_name || "[PARENT'S NAME]"}</strong>, residing at <strong>${data.full_address || "[FULL ADDRESS]"}</strong>, do hereby solemnly affirm and declare as under:
      </p>

      <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border: 2px solid #000; border-left: 6px solid #000;">
        <p style="margin: 15px 0; text-align: justify;">
          <strong>1.</strong> That I am a citizen of India and residing at the above-mentioned address.
        </p>
        <p style="margin: 15px 0; text-align: justify;">
          <strong>2.</strong> That I am making this declaration for the purpose of <strong>${data.purpose || "[STATE THE PURPOSE, e.g., applying for name correction, address proof, etc.]"}</strong>.
        </p>
        <p style="margin: 15px 0; text-align: justify;">
          <strong>3.</strong> That all the facts stated above are true to the best of my knowledge and belief.
        </p>
      </div>

      <div style="margin: 40px 0; padding: 20px; border: 2px solid #000;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline; text-align: center;">VERIFICATION</h3>
        <p style="text-align: justify; margin: 15px 0;">
          I, the above-named deponent, do hereby verify that the contents of this affidavit are true and correct to the best of my knowledge and belief. No part of it is false and nothing material has been concealed therein.
        </p>
      </div>

      <div style="margin-top: 50px; display: flex; justify-content: space-between;">
        <div>
          <p style="margin: 10px 0;"><strong>Place:</strong> ${data.city || "[CITY]"}</p>
          <p style="margin: 10px 0;"><strong>Date:</strong> ${currentDate}</p>
        </div>
        <div style="text-align: center;">
          <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
          <p style="margin: 5px 0; font-weight: bold;">Deponent's Signature</p>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${data.full_name || "[FULL NAME]"}</p>
          <p style="margin: 5px 0;"><strong>AADHAR No./PAN No.:</strong> [ID NUMBER]</p>
        </div>
      </div>

      <div style="margin-top: 40px; text-align: center; border: 2px solid #000; padding: 20px;">
        <p style="font-weight: bold; font-size: 16px;">(Should be Notarized)</p>
      </div>
    </div>
  `
}

function generatePartnershipAgreement(data, template) {
  const currentDate = new Date().toLocaleDateString("en-GB")
  const governmentSeal = template.needsGovernmentSeal
    ? `
    <div style="position: absolute; top: 20px; right: 20px; width: 100px; height: 100px;">
      <img src="/images/government-seal.png" alt="Government Seal" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  `
    : ""

  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.8; color: #000; background: #fff; border: 3px solid #000; padding: 40px; margin: 20px; position: relative;">
      ${governmentSeal}
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px double #000; padding-bottom: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); margin: -40px -40px 30px -40px; padding: 30px 40px 20px 40px;">
        <h1 style="font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
          🇮🇳 PARTNERSHIP AGREEMENT 🇮🇳
        </h1>
        <p style="margin: 10px 0 0 0; font-size: 14px; font-style: italic;">
          Under the Indian Partnership Act, 1932
        </p>
      </div>

      <p style="text-align: justify; margin-bottom: 25px; font-weight: 500;">
        This Agreement is made on <strong>${currentDate}</strong> between:
      </p>

      <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border: 2px solid #000; border-left: 6px solid #000;">
        <p style="margin: 10px 0; font-weight: bold;">
          <u>Partner A:</u> ${data.partner_a_name || "[Name]"}, ${data.partner_a_address || "[Address]"}
        </p>
        <p style="margin: 10px 0; font-weight: bold;">
          <u>Partner B:</u> ${data.partner_b_name || "[Name]"}, ${data.partner_b_address || "[Address]"}
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">1. NAME & PURPOSE:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The partnership shall operate under the name <strong>${data.firm_name || "[Firm Name]"}</strong> for the purpose of <strong>${data.business_nature || "[Nature of Business]"}</strong>.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">2. CAPITAL CONTRIBUTION:</h3>
        <div style="margin-left: 20px;">
          <p>Partner A - INR <strong>${data.capital_a || "[Amount]"}</strong></p>
          <p>Partner B - INR <strong>${data.capital_b || "[Amount]"}</strong></p>
        </div>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">3. PROFIT SHARING:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          Profits and losses will be shared equally unless agreed otherwise.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">4. DUTIES & ROLES:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          Each partner shall have equal rights in the management and shall work towards business growth.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">5. JURISDICTION:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          This agreement is governed under the Indian Partnership Act, 1932.
        </p>
      </div>

      <div style="margin-top: 60px; display: flex; justify-content: space-between;">
        <div style="text-align: center; width: 45%;">
          <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
          <p style="font-weight: bold;">(PARTNER A)</p>
        </div>
        <div style="text-align: center; width: 45%;">
          <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
          <p style="font-weight: bold;">(PARTNER B)</p>
        </div>
      </div>
    </div>
  `
}

function generateConsultingAgreement(data, template) {
  const currentDate = new Date().toLocaleDateString("en-GB")
  const governmentSeal = template.needsGovernmentSeal
    ? `
    <div style="position: absolute; top: 20px; right: 20px; width: 100px; height: 100px;">
      <img src="/images/government-seal.png" alt="Government Seal" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  `
    : ""

  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.8; color: #000; background: #fff; border: 3px solid #000; padding: 40px; margin: 20px; position: relative;">
      ${governmentSeal}
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px double #000; padding-bottom: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); margin: -40px -40px 30px -40px; padding: 30px 40px 20px 40px;">
        <h1 style="font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
          🇮🇳 CONSULTING AGREEMENT 🇮🇳
        </h1>
        <p style="margin: 10px 0 0 0; font-size: 14px; font-style: italic;">
          Under the Indian Contract Act, 1872
        </p>
      </div>

      <p style="text-align: justify; margin-bottom: 25px; font-weight: 500;">
        This Agreement is made on <strong>${currentDate}</strong> between:
      </p>

      <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border: 2px solid #000; border-left: 6px solid #000;">
        <p style="margin: 10px 0; font-weight: bold;">
          <u>Client:</u> ${data.client_name || "[CLIENT NAME]"}, ${data.client_address || "[ADDRESS]"}
        </p>
        <p style="margin: 10px 0; font-weight: bold;">
          <u>Consultant:</u> ${data.consultant_name || "[CONSULTANT NAME]"}, ${data.consultant_address || "[ADDRESS]"}
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">1. SERVICES:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          Consultant agrees to provide <strong>${data.services_description || "[DESCRIPTION OF SERVICES]"}</strong> from <strong>${data.start_date || "[START DATE]"}</strong> to <strong>${data.end_date || "[END DATE]"}</strong>.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">2. CONFIDENTIALITY:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The Consultant shall not disclose any business information.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">3. INDEPENDENT CONTRACTOR:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          Nothing in this agreement creates an employer-employee relationship.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">4. GOVERNING LAW:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          This agreement is governed by the laws of India.
        </p>
      </div>

      <div style="margin-top: 60px; display: flex; justify-content: space-between; align-items: center;">
        <div style="text-align: center; width: 45%;">
          <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
          <p style="font-weight: bold;">(CLIENT)</p>
        </div>
        <div style="text-align: center; width: 45%;">
          <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
          <p style="font-weight: bold;">(CONSULTANT)</p>
        </div>
      </div>
    </div>
  `
}

function generateLicensingAgreement(data, template) {
  const currentDate = new Date().toLocaleDateString("en-GB")
  const governmentSeal = template.needsGovernmentSeal
    ? `
    <div style="position: absolute; top: 20px; right: 20px; width: 100px; height: 100px;">
      <img src="/images/government-seal.png" alt="Government Seal" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  `
    : ""

  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.8; color: #000; background: #fff; border: 3px solid #000; padding: 40px; margin: 20px; position: relative;">
      ${governmentSeal}
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px double #000; padding-bottom: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); margin: -40px -40px 30px -40px; padding: 30px 40px 20px 40px;">
        <h1 style="font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
          🇮🇳 LICENSING AGREEMENT 🇮🇳
        </h1>
        <p style="margin: 10px 0 0 0; font-size: 14px; font-style: italic;">
          Under Indian Jurisdiction
        </p>
      </div>

      <p style="text-align: justify; margin-bottom: 25px; font-weight: 500;">
        This Agreement is made on <strong>${currentDate}</strong> between:
      </p>

      <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border: 2px solid #000; border-left: 6px solid #000;">
        <p style="margin: 10px 0; font-weight: bold;">
          <u>Licensor:</u> ${data.licensor_name || "[COMPANY/INDIVIDUAL NAME]"}, ${data.licensor_address || "[ADDRESS]"}
        </p>
        <p style="margin: 10px 0; font-weight: bold;">
          <u>Licensee:</u> ${data.licensee_name || "[LICENSEE NAME]"}, ${data.licensee_address || "[ADDRESS]"}
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">1. GRANT OF LICENSE:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The Licensor grants the Licensee a non-exclusive, non-transferable license to use <strong>${data.product_name || "[SOFTWARE/PRODUCT NAME]"}</strong> in India.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">2. LICENSE FEE:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The Licensee agrees to pay INR <strong>${data.license_fee || "[AMOUNT]"}</strong> as licensing fee.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">3. RESTRICTIONS:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          Licensee shall not distribute, copy, modify, or reverse engineer the product.
        </p>
      </div>

      <div style="margin: 20px 0; padding: 15px 0; border-bottom: 1px solid #ccc;">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">4. JURISDICTION:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          Disputes shall be settled under Indian jurisdiction.
        </p>
      </div>

      <div style="margin-top: 60px; display: flex; justify-content: space-between; align-items: center;">
        <div style="text-align: center; width: 45%;">
          <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
          <p style="font-weight: bold;">(LICENSOR)</p>
        </div>
        <div style="text-align: center; width: 45%;">
          <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
          <p style="font-weight: bold;">(LICENSEE)</p>
        </div>
      </div>
    </div>
  `
}

function generateGenericDocument(data, template) {
  const currentDate = new Date().toLocaleDateString("en-GB")
  const governmentSeal = template.needsGovernmentSeal
    ? `
    <div style="position: absolute; top: 20px; right: 20px; width: 100px; height: 100px;">
      <img src="/images/government-seal.png" alt="Government Seal" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  `
    : ""

  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.8; color: #000; background: #fff; border: 3px solid #000; padding: 40px; margin: 20px; position: relative;">
      ${governmentSeal}
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px double #000; padding-bottom: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); margin: -40px -40px 30px -40px; padding: 30px 40px 20px 40px;">
        <h1 style="font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
          🇮🇳 ${template.name.toUpperCase()} 🇮🇳
        </h1>
        <p style="margin: 10px 0 0 0; font-size: 14px; font-style: italic;">
          Government of India
        </p>
      </div>
      
      <p style="margin-bottom: 25px; text-align: justify;">
        This is a professional legal document template. Please customize according to your specific requirements.
      </p>
      
      <div style="margin: 30px 0;">
        ${Object.entries(data)
          .map(
            ([key, value]) =>
              `<p style="margin: 10px 0;"><strong>${key.replace(/_/g, " ").toUpperCase()}:</strong> ${value}</p>`,
          )
          .join("")}
      </div>
      
      <div style="margin-top: 60px; text-align: center;">
        <p style="margin-bottom: 20px;">Date: <strong>${currentDate}</strong></p>
        <div style="margin-top: 50px;">
          <div style="border-bottom: 1px solid #000; width: 200px; margin: 0 auto 10px;"></div>
          <p style="margin: 5px 0; font-weight: bold;">Signature</p>
        </div>
      </div>
    </div>
  `
}
