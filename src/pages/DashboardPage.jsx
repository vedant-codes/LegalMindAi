"use client"

import { useState,useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import {
  FileText,
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  AlertTriangle,
  Clock,
  TrendingUp,
  Calendar,
  Shield,
  HandMetal,
  Briefcase,
  Home,
  UserCheck,
  FileSignature,
  Scale,
  Edit3,
  Eye,
  Star,
  Download,
  Users,
  ArrowRight,
  GitCompare,
} from "lucide-react"
import { Link } from "react-router-dom"

// Mock data
// const mockDocuments = [
//   {
//     id: "1",
//     name: "Service Agreement - TechCorp.pdf",
//     type: "Service Agreement",
//     status: "analyzed",
//     riskScore: 72,
//     uploadDate: "2024-01-15",
//     size: "2.4 MB",
//   },
//   {
//     id: "2",
//     name: "NDA - StartupXYZ.docx",
//     type: "NDA",
//     status: "processing",
//     riskScore: null,
//     uploadDate: "2024-01-14",
//     size: "1.2 MB",
//   },
//   {
//     id: "3",
//     name: "Employment Contract - Jane Doe.pdf",
//     type: "Employment Contract",
//     status: "analyzed",
//     riskScore: 45,
//     uploadDate: "2024-01-13",
//     size: "3.1 MB",
//   },
//   {
//     id: "4",
//     name: "Licensing Agreement - SoftwareCo.pdf",
//     type: "Licensing Agreement",
//     status: "analyzed",
//     riskScore: 89,
//     uploadDate: "2024-01-12",
//     size: "4.7 MB",
//   },
// ]

const mockStats = {
  totalDocuments: 24,
  highRiskDocuments: 3,
  avgRiskScore: 62,
  documentsThisMonth: 8,
}

// Enhanced templates data for dashboard
const dashboardTemplates = [
  {
    id: "1",
    name: "Non-Disclosure Agreement",
    type: "NDA",
    description: "Standard confidentiality agreement for protecting sensitive information",
    category: "Confidentiality",
    downloads: 1250,
    rating: 4.8,
    icon: Shield,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    complexity: "Medium",
    fields: 5,
  },
  {
    id: "2",
    name: "Service Agreement",
    type: "Contract",
    description: "Professional services contract template for consultants and agencies",
    category: "Services",
    downloads: 980,
    rating: 4.9,
    icon: Briefcase,
    color: "bg-green-50 text-green-600 border-green-200",
    complexity: "High",
    fields: 5,
  },
  {
    id: "3",
    name: "Employment Contract",
    type: "Employment",
    description: "Comprehensive employment agreement with standard terms and conditions",
    category: "HR",
    downloads: 756,
    rating: 4.7,
    icon: Users,
    color: "bg-purple-50 text-purple-600 border-purple-200",
    complexity: "High",
    fields: 5,
  },
  {
    id: "4",
    name: "Rental/Lease Agreement",
    type: "Property",
    description: "Property rental agreements under Indian Tenancy laws",
    category: "Property",
    downloads: 892,
    rating: 4.9,
    icon: Home,
    color: "bg-orange-50 text-orange-600 border-orange-200",
    complexity: "Medium",
    fields: 6,
  },
  {
    id: "5",
    name: "Offer Letter",
    type: "Employment",
    description: "Formal employment offer by Indian companies",
    category: "HR",
    downloads: 634,
    rating: 4.8,
    icon: UserCheck,
    color: "bg-teal-50 text-teal-600 border-teal-200",
    complexity: "Low",
    fields: 6,
  },
  {
    id: "6",
    name: "Resignation Acceptance Letter",
    type: "HR",
    description: "For HR automation in Indian companies",
    category: "HR",
    downloads: 423,
    rating: 4.6,
    icon: FileSignature,
    color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    complexity: "Low",
    fields: 5,
  },
  {
    id: "7",
    name: "Affidavit Template",
    type: "Legal",
    description: "For self-declarations or statements in courts",
    category: "Legal",
    downloads: 567,
    rating: 4.7,
    icon: Scale,
    color: "bg-red-50 text-red-600 border-red-200",
    complexity: "Medium",
    fields: 6,
  },
  {
    id: "8",
    name: "Partnership Agreement",
    type: "Partnership",
    description: "Business partnership agreement for joint ventures and collaborations",
    category: "Business",
    downloads: 534,
    rating: 4.8,
    icon: HandMetal,
    color: "bg-pink-50 text-pink-600 border-pink-200",
    complexity: "High",
    fields: 5,
  },
]

const complexityColors = {
  Low: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-red-100 text-red-800",
}

export default function DashboardPage() {
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    const storedDocs = JSON.parse(localStorage.getItem("documents")) || []
    setDocuments(storedDocs)
    console.log(storedDocs)
  }, [])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const getStatusColor = (status) => {
    switch (status) {
      case "analyzed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getRiskColor = (score) => {
    if (!score) return "text-slate-400"
    if (score >= 80) return "text-red-600"
    if (score >= 60) return "text-yellow-600"
    return "text-green-600"
  }

 const filteredDocuments = documents.filter((doc) => {
  const name = doc.name || "";
  const type = doc.type || "";

  const matchesSearch =
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesFilter =
    filterType === "all" || type.toLowerCase().includes(filterType.toLowerCase());

  return matchesSearch && matchesFilter;
});


  const handleUseTemplate = (template) => {
    setSelectedTemplate(template)
  }

  const handlePreviewTemplate = (template) => {
    // For now, we'll use the same handler - you can differentiate later
    setSelectedTemplate(template)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">LegalMind.AI</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/upload">
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-600">Manage and analyze your legal documents with AI-powered insights.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Documents",
              value: mockStats.totalDocuments,
              icon: FileText,
              color: "text-blue-600",
            },
            {
              label: "High Risk",
              value: mockStats.highRiskDocuments,
              icon: AlertTriangle,
              color: "text-red-600",
            },
            {
              label: "Avg Risk Score",
              value: mockStats.avgRiskScore,
              icon: TrendingUp,
              color: "text-yellow-600",
            },
            {
              label: "This Month",
              value: mockStats.documentsThisMonth,
              icon: Calendar,
              color: "text-green-600",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-md text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="nda">NDA</option>
                      <option value="service">Service Agreement</option>
                      <option value="employment">Employment</option>
                      <option value="licensing">Licensing</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>Your uploaded and analyzed legal documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDocuments.map((file,index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-800">{file.name}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {file.type}
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(file.status)}`}>{file.status}</Badge>
                            <span className="text-xs text-slate-500">
                              {file.size} • {new Date(file.uploadDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {file.riskScore && (
                          <div className="text-right">
                            <div className={`text-sm font-medium ${getRiskColor(file.riskScore)}`}>
                              Risk: {file.riskScore}/100
                            </div>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          {file.status === "completed" ? (
                            <>
                              <Link
                      to={`/analysis/${file.id}`}
                      state={{ file }}
                    >
                      <Button size="sm">View Analysis</Button>
                    </Link>
                              <Link to={`/compare?original=${file.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                                >
                                  <GitCompare className="w-4 h-4 mr-2" />
                                  Compare
                                </Button>
                              </Link>
                            </>
                          ) : (
                            <Button size="sm" variant="outline" disabled>
                              <Clock className="w-4 h-4 mr-2" />
                              Processing
                            </Button>
                          )}
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Legal Document Templates</CardTitle>
                      <CardDescription>
                        Professional, legally-compliant templates for Indian jurisdiction
                      </CardDescription>
                    </div>
                    <Link to="/templates">
                      <Button variant="outline">
                        View All Templates
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {dashboardTemplates.map((template, index) => (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <Card className="border-slate-200 hover:shadow-lg transition-all duration-300 h-full group cursor-pointer">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between mb-3">
                              <div
                                className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center border group-hover:scale-110 transition-transform duration-200`}
                              >
                                <template.icon className="w-6 h-6" />
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span className="text-xs font-medium text-slate-700">{template.rating}</span>
                                </div>
                                <Badge className={`text-xs ${complexityColors[template.complexity]}`}>
                                  {template.complexity}
                                </Badge>
                              </div>
                            </div>
                            <CardTitle className="text-slate-800 text-sm mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {template.name}
                            </CardTitle>
                            <CardDescription className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                              {template.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between text-xs text-slate-600 mb-4">
                              <span className="flex items-center space-x-1">
                                <Download className="w-3 h-3" />
                                <span>{template.downloads.toLocaleString()}</span>
                              </span>
                              <span>{template.fields} fields</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                  onClick={() => handlePreviewTemplate(template)}
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  Preview
                                </Button>
                                <Button
                                  size="sm"
                                  className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 transition-colors"
                                  onClick={() => handleUseTemplate(template)}
                                >
                                  <Edit3 className="w-3 h-3 mr-1" />
                                  Use
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                  <CardDescription>Risk levels across your documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Low Risk (0-40)</span>
                      <span className="text-sm font-medium">8 documents</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Medium Risk (41-70)</span>
                      <span className="text-sm font-medium">13 documents</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">High Risk (71-100)</span>
                      <span className="text-sm font-medium">3 documents</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Document Types</CardTitle>
                  <CardDescription>Breakdown by document category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Service Agreements</span>
                      <span className="text-sm font-medium">9</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">NDAs</span>
                      <span className="text-sm font-medium">7</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Employment Contracts</span>
                      <span className="text-sm font-medium">5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Licensing Agreements</span>
                      <span className="text-sm font-medium">3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your LegalMind.AI preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-800 mb-2">Notification Preferences</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm text-slate-600">
                        Email notifications for document analysis completion
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm text-slate-600">High-risk document alerts</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-slate-600">Weekly summary reports</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-800 mb-2">Default Analysis Settings</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm text-slate-600">Auto-generate risk assessment</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm text-slate-600">Extract key entities automatically</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-slate-600">Generate negotiation suggestions</span>
                    </label>
                  </div>
                </div>

                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Template Editor Modal - Import from TemplatesPage */}
      {selectedTemplate && (
        <TemplateEditorModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
      )}
    </div>
  )
}

// Template Editor Modal Component with fixed scrolling
function TemplateEditorModal({ template, onClose }) {
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
                      <FileText className="w-4 h-4 mr-2" />
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

// Helper functions with updated professional formatting
function getTemplateFields(template) {
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
    4: generateRentalAgreement,
    8: generatePartnershipAgreement,
  }

  const generator = templates[template.id] || generateGenericDocument
  return generator(formData)
}

// Updated document generators with professional formatting
function generateNDADocument(data) {
  const currentDate = new Date().toLocaleDateString("en-GB")

  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px; color: #000;">
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #000; padding-bottom: 20px;">
        <h1 style="font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px;">NON-DISCLOSURE AGREEMENT</h1>
      </div>

      <p style="margin-bottom: 25px; text-align: justify;">
        This Agreement is made on <strong>${currentDate}</strong> between:
      </p>

      <div style="margin: 30px 0; padding: 20px; background: #f9f9f9; border-left: 4px solid #333;">
        <p style="margin: 10px 0;"><strong>Disclosing Party:</strong> ${data.disclosing_party || "[Name]"}, ${data.disclosing_address || "[Address]"}</p>
        <p style="margin: 10px 0;"><strong>Receiving Party:</strong> ${data.receiving_party || "[Name]"}, ${data.receiving_address || "[Address]"}</p>
      </div>

      <div style="margin: 30px 0;">
        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">1. Purpose:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The Disclosing Party agrees to share certain confidential information with the Receiving Party solely for the purpose of <strong>${data.purpose || "[Project/Purpose]"}</strong>.
        </p>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">2. Confidential Information:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          Includes, but is not limited to: business plans, financial data, customer lists, trade secrets, etc.
        </p>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">3. Obligation:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The Receiving Party shall not disclose, reproduce, or use any confidential information for any purpose other than the one stated above.
        </p>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">4. Term:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          This Agreement remains in effect for a period of <strong>${data.duration || "[X]"} Years</strong> from the date of execution.
        </p>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">5. Return or Destruction:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          Upon termination, all confidential materials must be returned or destroyed.
        </p>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">6. Governing Law:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          This agreement is governed by the laws of India.
        </p>
      </div>

      <div style="margin-top: 60px; text-align: center;">
        <p style="font-weight: bold; margin-bottom: 40px;">IN WITNESS WHEREOF, the parties have executed this agreement.</p>
        
        <div style="display: flex; justify-content: space-between; margin-top: 50px;">
          <div style="width: 45%; text-align: center;">
            <div style="border-bottom: 1px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="margin: 5px 0; font-weight: bold;">(Disclosing Party)</p>
          </div>
          <div style="width: 45%; text-align: center;">
            <div style="border-bottom: 1px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="margin: 5px 0; font-weight: bold;">(Receiving Party)</p>
          </div>
        </div>
      </div>
    </div>
  `
}

function generateServiceAgreement(data) {
  const currentDate = new Date().toLocaleDateString("en-GB")

  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px; color: #000;">
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #000; padding-bottom: 20px;">
        <h1 style="font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px;">SERVICE AGREEMENT</h1>
      </div>

      <p style="margin-bottom: 25px; text-align: justify;">
        This Agreement is made on <strong>${currentDate}</strong> between:
      </p>

      <div style="margin: 30px 0; padding: 20px; background: #f9f9f9; border-left: 4px solid #333;">
        <p style="margin: 10px 0;"><strong>Client:</strong> ${data.client_name || "[Client Name]"}, ${data.client_address || "[Client Address]"}</p>
        <p style="margin: 10px 0;"><strong>Service Provider:</strong> ${data.service_provider || "[Service Provider Name]"}, ${data.provider_address || "[Address]"}</p>
      </div>

      <div style="margin: 30px 0;">
        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">1. Scope of Services:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The Service Provider agrees to provide the following services: <strong>${data.services_description || "[Describe Services]"}</strong>.
        </p>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">2. Duration:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The agreement is valid from <strong>${data.start_date || "[Start Date]"}</strong> to <strong>${data.end_date || "[End Date]"}</strong>.
        </p>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">3. Payment Terms:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The Client shall pay INR <strong>${data.payment_amount || "[Amount]"}</strong> for the services, payable <strong>${data.payment_terms || "[Monthly/One-time]"}</strong> upon invoice.
        </p>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">4. Confidentiality:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The Service Provider shall keep all client information confidential.
        </p>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">5. Termination:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          Either party may terminate this agreement with 30 days written notice.
        </p>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">6. Governing Law:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          This Agreement shall be governed by the laws of India.
        </p>
      </div>

      <div style="margin-top: 60px; text-align: center;">
        <p style="font-weight: bold; margin-bottom: 40px;">Signed:</p>
        
        <div style="display: flex; justify-content: space-between; margin-top: 50px;">
          <div style="width: 45%; text-align: center;">
            <div style="border-bottom: 1px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="margin: 5px 0; font-weight: bold;">(Client)</p>
          </div>
          <div style="width: 45%; text-align: center;">
            <div style="border-bottom: 1px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="margin: 5px 0; font-weight: bold;">(Service Provider)</p>
          </div>
        </div>
      </div>
    </div>
  `
}

function generateRentalAgreement(data) {
  const currentDate = new Date().toLocaleDateString("en-GB")
  const endDate = data.start_date
    ? new Date(
        new Date(data.start_date).getTime() + Number.parseInt(data.lease_duration || 12) * 30 * 24 * 60 * 60 * 1000,
      ).toLocaleDateString("en-GB")
    : "[End Date]"

  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px; color: #000;">
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #000; padding-bottom: 20px;">
        <h1 style="font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px;">RESIDENTIAL LEASE AGREEMENT</h1>
      </div>

      <p style="margin-bottom: 25px; text-align: justify;">
        This Agreement is made on <strong>${currentDate}</strong> at <strong>${data.city || "[City]"}, State</strong> between:
      </p>

      <div style="margin: 30px 0; padding: 20px; background: #f9f9f9; border-left: 4px solid #333;">
        <p style="margin: 10px 0;"><strong>Lessor:</strong> ${data.landlord_name || "[Landlord Name]"}, residing at ${data.landlord_address || "[Landlord Address]"}</p>
        <p style="margin: 10px 0;"><strong>AND</strong></p>
        <p style="margin: 10px 0;"><strong>Lessee:</strong> ${data.tenant_name || "[Tenant Name]"}, residing at ${data.tenant_address || "[Tenant Address]"}</p>
      </div>

      <div style="margin: 30px 0;">
        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">1. Premises & Term:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The lessor agrees to lease the property at <strong>${data.property_address || "[Property Address]"}</strong> to the lessee for a period of <strong>${data.lease_duration || "[Lease Duration]"} months</strong>, starting from <strong>${data.start_date || "[Start Date]"}</strong> to <strong>${endDate}</strong>.
        </p>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">2. Rent & Security Deposit:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The monthly rent shall be INR <strong>${data.rent_amount || "[Rent Amount]"}</strong>, payable on or before the 5th of each month. A refundable security deposit of INR <strong>${data.security_deposit || "[Deposit Amount]"}</strong> shall be paid at the time of agreement signing.
        </p>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">3. Maintenance & Utilities:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The tenant shall bear all charges for electricity, water, and other utilities. Minor repairs shall be carried out by the tenant. Major repairs due to natural wear and tear shall be handled by the landlord.
        </p>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">4. Use of Premises:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The premises shall be used only for residential purposes. No sub-letting is allowed without the written consent of the landlord.
        </p>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">5. Entry & Inspection:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The landlord reserves the right to inspect the premises with a 24-hour prior written notice.
        </p>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">6. Termination:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          Either party may terminate this agreement with one month's written notice. Early termination by tenant will result in forfeiture of the deposit.
        </p>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">7. Governing Law:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          This agreement is governed under the Indian Contract Act, 1872 and the Model Tenancy Act, 2019.
        </p>
      </div>

      <div style="margin-top: 60px; text-align: center;">
        <p style="font-weight: bold; margin-bottom: 40px;">IN WITNESS WHEREOF, both parties have signed this agreement on the date mentioned above.</p>
        
        <div style="display: flex; justify-content: space-between; margin-top: 50px;">
          <div style="width: 45%; text-align: center;">
            <div style="border-bottom: 1px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="margin: 5px 0; font-weight: bold;">(Landlord Signature)</p>
          </div>
          <div style="width: 45%; text-align: center;">
            <div style="border-bottom: 1px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="margin: 5px 0; font-weight: bold;">(Tenant Signature)</p>
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

function generatePartnershipAgreement(data) {
  const currentDate = new Date().toLocaleDateString("en-GB")

  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px; color: #000;">
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #000; padding-bottom: 20px;">
        <h1 style="font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px;">PARTNERSHIP AGREEMENT</h1>
      </div>

      <p style="margin-bottom: 25px; text-align: justify;">
        This Agreement is made on <strong>${currentDate}</strong> between:
      </p>

      <div style="margin: 30px 0; padding: 20px; background: #f9f9f9; border-left: 4px solid #333;">
        <p style="margin: 10px 0;"><strong>Partner A:</strong> ${data.partner_a_name || "[Name]"}, ${data.partner_a_address || "[Address]"}</p>
        <p style="margin: 10px 0;"><strong>Partner B:</strong> ${data.partner_b_name || "[Name]"}, ${data.partner_b_address || "[Address]"}</p>
      </div>

      <div style="margin: 30px 0;">
        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">1. Name & Purpose:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The partnership shall operate under the name <strong>${data.firm_name || "[Firm Name]"}</strong> for the purpose of <strong>${data.business_nature || "[Nature of Business]"}</strong>.
        </p>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">2. Capital Contribution:</h3>
        <div style="margin-left: 20px;">
          <p>Partner A - INR <strong>${data.capital_a || "[Amount]"}</strong></p>
          <p>Partner B - INR <strong>${data.capital_b || "[Amount]"}</strong></p>
        </div>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">3. Profit Sharing:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          Profits and losses will be shared equally unless agreed otherwise.
        </p>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">4. Duties & Roles:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          Each partner shall have equal rights in the management and shall work towards business growth.
        </p>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">5. Termination:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          The partnership may be dissolved by mutual consent or due to withdrawal, death, or insolvency.
        </p>

        <h3 style="font-size: 16px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">6. Jurisdiction:</h3>
        <p style="text-align: justify; margin-left: 20px;">
          This agreement is governed under the Indian Partnership Act, 1932.
        </p>
      </div>

      <div style="margin-top: 80px;">
        <div style="display: flex; justify-content: space-between;">
          <div style="width: 45%; text-align: center;">
            <div style="border-bottom: 1px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="margin: 5px 0; font-weight: bold;">(Partner A)</p>
          </div>
          <div style="width: 45%; text-align: center;">
            <div style="border-bottom: 1px solid #000; width: 200px; margin: 0 auto 10px;"></div>
            <p style="margin: 5px 0; font-weight: bold;">(Partner B)</p>
          </div>
        </div>
      </div>
    </div>
  `
}

function generateGenericDocument(data) {
  const currentDate = new Date().toLocaleDateString("en-GB")

  return `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px; color: #000;">
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #000; padding-bottom: 20px;">
        <h1 style="font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px;">LEGAL DOCUMENT</h1>
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
