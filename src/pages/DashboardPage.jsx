"use client"


import { useState, useEffect } from "react";

import { Printer } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
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
  Briefcase,
  Home,
  Edit3,
  Eye,
  Star,
  Download,
  Users,
  ArrowRight,
  GitCompare,
  Trash2,
  Edit,
  Share2,
  Archive,
  Copy,
  StarIcon,
  X,
  AlertCircle,
  FileX,
} from "lucide-react"
import { Link } from "react-router-dom"

// Mock data
const mockDocuments = [
  {
    id: "1",
    name: "Service Agreement - TechCorp.pdf",
    type: "Service Agreement",
    status: "analyzed",
    riskScore: 72,
    uploadDate: "2024-01-15",
    size: "2.4 MB",
  },
  {
    id: "2",
    name: "NDA - StartupXYZ.docx",
    type: "NDA",
    status: "processing",
    riskScore: null,
    uploadDate: "2024-01-14",
    size: "1.2 MB",
  },
  {
    id: "3",
    name: "Employment Contract - Jane Doe.pdf",
    type: "Employment Contract",
    status: "analyzed",
    riskScore: 45,
    uploadDate: "2024-01-13",
    size: "3.1 MB",
  },
  {
    id: "4",
    name: "Licensing Agreement - SoftwareCo.pdf",
    type: "Licensing Agreement",
    status: "analyzed",
    riskScore: 89,
    uploadDate: "2024-01-12",
    size: "4.7 MB",
  },
]

const mockStats = {
  totalDocuments: 24,
  highRiskDocuments: 3,
  avgRiskScore: 62,
  documentsThisMonth: 8,
}

// Enhanced templates data for dashboard - Keep only 4 main templates
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
    fields: 6,
    needsGovernmentSeal: true,
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
    fields: 9,
    needsGovernmentSeal: true,
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
    fields: 8,
    needsGovernmentSeal: true,
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
    fields: 10,
    needsGovernmentSeal: true,
  },
]

const complexityColors = {
  Low: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-red-100 text-red-800",
}

export default function DashboardPage() {

  const [documents, setDocuments] = useState([])
  const [stats, setStats] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showRatingDialog, setShowRatingDialog] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [ratingComment, setRatingComment] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState(null)
  const [riskDistribution, setRiskDistribution] = useState({
    low: 0,
    medium: 0,
    high: 0,
  });

  const [typeCounts, setTypeCounts] = useState({});


  useEffect(() => {
    const storedDocs = JSON.parse(localStorage.getItem("documents")) || [];
    setDocuments(storedDocs);



    // Compute stats here
    const totalDocuments = storedDocs.length;
    const highRiskDocuments = storedDocs.filter(doc => doc.riskScore >= 70).length;

    const avgRiskScore =
      storedDocs.reduce((acc, doc) => acc + doc.riskScore, 0) /
      (storedDocs.length || 1);

    const documentsThisMonth = storedDocs.filter(doc => {
      const completedDate = new Date(doc.uploadDate);
      const now = new Date();
      return (
        completedDate.getFullYear() === now.getFullYear() &&
        completedDate.getMonth() === now.getMonth()
      );
    }).length;
    const risk = {
      low: storedDocs.filter((doc) => doc.riskScore <= 40).length,
      medium: storedDocs.filter((doc) => doc.riskScore > 40 && doc.riskScore <= 70).length,
      high: storedDocs.filter((doc) => doc.riskScore > 70).length,
    };
    setRiskDistribution(risk);

    // Compute document type counts
    const types = storedDocs.reduce((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1;
      return acc;
    }, {});
    setTypeCounts(types);

    setStats({
      totalDocuments,
      highRiskDocuments,
      avgRiskScore: Math.round(avgRiskScore),
      documentsThisMonth,
    });

  }, []);



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
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || doc.type.toLowerCase().includes(filterType.toLowerCase())

    const matchesStatus = statusFilter === "all" || doc.status === statusFilter

    const matchesRisk =
      riskFilter === "all" ||
      (riskFilter === "low" && doc.riskScore && doc.riskScore < 40) ||
      (riskFilter === "medium" && doc.riskScore && doc.riskScore >= 40 && doc.riskScore < 70) ||
      (riskFilter === "high" && doc.riskScore && doc.riskScore >= 70)

    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && new Date(doc.uploadDate).toDateString() === new Date().toDateString()) ||
      (dateFilter === "week" && new Date(doc.uploadDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "month" && new Date(doc.uploadDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))

    return matchesSearch && matchesType && matchesStatus && matchesRisk && matchesDate
  })

  const handleUseTemplate = (template) => {
    setSelectedTemplate(template)
    setShowPreview(false)
  }

  const handlePreviewTemplate = (template) => {
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

  const handleDeleteDocument = (docId) => {
    setDocuments(documents.filter((doc) => doc.id !== docId))
    setShowDeleteDialog(false)
    setDocumentToDelete(null)
  }

  const handleModifyDocument = (docId) => {
    console.log("Modifying document:", docId)
    // Implement modify functionality
  }

  const handleShareDocument = (docId) => {
    console.log("Sharing document:", docId)
    // Implement share functionality
  }

  const handleArchiveDocument = (docId) => {
    console.log("Archiving document:", docId)
    // Implement archive functionality
  }

  const handleDuplicateDocument = (docId) => {
    const docToDuplicate = documents.find((doc) => doc.id === docId)
    if (docToDuplicate) {
      const newDoc = {
        ...docToDuplicate,
        id: Date.now().toString(),
        name: `Copy of ${docToDuplicate.name}`,
        uploadDate: new Date().toISOString().split("T")[0],
      }
      setDocuments([newDoc, ...documents])
    }
  }

  const clearFilters = () => {
    setFilterType("all")
    setStatusFilter("all")
    setRiskFilter("all")
    setDateFilter("all")
    setSearchTerm("")
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
              <Button className="h-10">
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
              value: stats.totalDocuments,
              icon: FileText,
              color: "text-blue-600",
            },
            {
              label: "High Risk",
              value: stats.highRiskDocuments,
              icon: AlertTriangle,
              color: "text-red-600",
            },
            {
              label: "Avg Risk Score",
              value: stats.avgRiskScore,
              icon: TrendingUp,
              color: "text-yellow-600",
            },
            {
              label: "This Month",
              value: stats.documentsThisMonth,
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
            {/* Enhanced Search and Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-12"
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="h-12 px-4"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                        {(filterType !== "all" ||
                          statusFilter !== "all" ||
                          riskFilter !== "all" ||
                          dateFilter !== "all") && (
                            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                              !
                            </Badge>
                          )}
                      </Button>
                      {(filterType !== "all" ||
                        statusFilter !== "all" ||
                        riskFilter !== "all" ||
                        dateFilter !== "all") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="h-12 px-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Clear
                          </Button>
                        )}
                    </div>
                  </div>

                  {/* Advanced Filters */}
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border"
                    >
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Document Type</label>
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm bg-white"
                        >
                          <option value="all">All Types</option>
                          <option value="nda">NDA</option>
                          <option value="service">Service Agreement</option>
                          <option value="employment">Employment</option>
                          <option value="licensing">Licensing</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm bg-white"
                        >
                          <option value="all">All Status</option>
                          <option value="analyzed">Analyzed</option>
                          <option value="processing">Processing</option>
                          <option value="error">Error</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Risk Level</label>
                        <select
                          value={riskFilter}
                          onChange={(e) => setRiskFilter(e.target.value)}
                          className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm bg-white"
                        >
                          <option value="all">All Risk Levels</option>
                          <option value="low">Low Risk (0-39)</option>
                          <option value="medium">Medium Risk (40-69)</option>
                          <option value="high">High Risk (70+)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Upload Date</label>
                        <select
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm bg-white"
                        >
                          <option value="all">All Dates</option>
                          <option value="today">Today</option>
                          <option value="week">This Week</option>
                          <option value="month">This Month</option>
                        </select>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Documents List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Documents</CardTitle>
                    <CardDescription>
                      Your uploaded and analyzed legal documents ({filteredDocuments.length} of {documents.length})
                    </CardDescription>
                  </div>
                  {filteredDocuments.length !== documents.length && (
                    <Badge variant="secondary">
                      Filtered: {filteredDocuments.length}/{documents.length}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-800 truncate">{doc.name}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {doc.type}
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(doc.status)}`}>{doc.status}</Badge>
                            <span className="text-xs text-slate-500">
                              {doc.size} • {new Date(doc.uploadDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {doc.riskScore && (
                          <div className="text-right">
                            <div className={`text-sm font-medium ${getRiskColor(doc.riskScore)}`}>
                              Risk: {doc.riskScore}/100
                            </div>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          {doc.status === "analyzed" ? (
                            <>
                              <Link to={`/analysis/${doc.id}`}>
                                <Button size="sm" className="h-8">
                                  View Analysis
                                </Button>
                              </Link>
                              <Link to={`/compare?original=${doc.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-purple-600 border-purple-200 hover:bg-purple-50"
                                >
                                  <GitCompare className="w-4 h-4 mr-2" />
                                  Compare
                                </Button>
                              </Link>
                            </>
                          ) : (
                            <Button size="sm" variant="outline" disabled className="h-8">
                              <Clock className="w-4 h-4 mr-2" />
                              Processing
                            </Button>
                          )}

                          {/* Enhanced 3-dots menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Document Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleModifyDocument(doc.id)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Modify
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicateDocument(doc.id)}>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShareDocument(doc.id)}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleArchiveDocument(doc.id)}>
                                <Archive className="w-4 h-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setDocumentToDelete(doc)
                                  setShowDeleteDialog(true)
                                }}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredDocuments.length === 0 && (
                    <div className="text-center py-12">
                      <FileX className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                      <h3 className="text-lg font-medium text-slate-800 mb-2">No documents found</h3>
                      <p className="text-slate-600 mb-4">
                        {documents.length === 0
                          ? "Upload your first document to get started"
                          : "Try adjusting your search or filter criteria"}
                      </p>
                      {documents.length > 0 && (
                        <Button onClick={clearFilters} variant="outline">
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  )}
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
                      <Button variant="outline" className="h-10">
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
                        <Card className="border-slate-200 hover:shadow-lg transition-all duration-300 h-full group">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between mb-2">
                              <div
                                className={`w-12 h-12 ${template.color} rounded-xl flex items-center justify-center border-2 group-hover:scale-110 transition-transform duration-200`}
                              >
                                <template.icon className="w-6 h-6" />
                              </div>
                              <Badge className={complexityColors[template.complexity]}>{template.complexity}</Badge>
                            </div>
                            <CardTitle className="text-slate-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                              {template.name}
                            </CardTitle>
                            <CardDescription className="text-slate-600 line-clamp-2 text-sm">
                              {template.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between text-xs text-slate-600 mb-4">
                              <div className="flex items-center space-x-2">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span>{template.rating}</span>
                              </div>
                              <span className="flex items-center space-x-1">
                                <Download className="w-3 h-3" />
                                <span>{template.downloads.toLocaleString()}</span>
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 h-8 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                onClick={() => handlePreviewTemplate(template)}
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Preview
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1 h-8 bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleUseTemplate(template)}
                              >
                                <Edit3 className="w-3 h-3 mr-1" />
                                Use
                              </Button>
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

          <TabsContent value="analytics">
  <Card>
    <CardHeader>
      <CardTitle>Analytics Overview</CardTitle>
      <CardDescription>Risk distribution and document type breakdown</CardDescription>
    </CardHeader>

    <CardContent>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="space-y-4">
          <h4 className="text-slate-700 font-medium">Risk Distribution</h4>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Low Risk (0-40)</span>
            <span className="text-sm font-medium">{riskDistribution.low} documents</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Medium Risk (41-70)</span>
            <span className="text-sm font-medium">{riskDistribution.medium} documents</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">High Risk (71-100)</span>
            <span className="text-sm font-medium">{riskDistribution.high} documents</span>
          </div>
        </div>

        {/* Document Types */}
        <div className="space-y-4">
          <h4 className="text-slate-700 font-medium">Document Types</h4>
          {Object.entries(typeCounts).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{type}</span>
              <span className="text-sm font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
</TabsContent>


          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your account and preferences.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <p className="text-slate-600">Settings features coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Template Preview Modal */}
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

      {/* Template Editor Modal */}
      {selectedTemplate && !showPreview && (
        <TemplateEditor
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onDocumentGenerated={handleDocumentGenerated}
        />
      )}

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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 border rounded-lg bg-slate-50">
            <p className="font-medium text-slate-800">{documentToDelete?.name}</p>
            <p className="text-sm text-slate-500 mt-1">
              {documentToDelete?.type} • {documentToDelete?.size} • Uploaded on{" "}
              {new Date(documentToDelete?.uploadDate || "").toLocaleDateString()}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => documentToDelete && handleDeleteDocument(documentToDelete.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Template Preview Component
function TemplatePreview({ template, onClose, onUse }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
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
      </div>
    </div>
  )
}

// Template Editor Component
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
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
                  <div key={field.name}>
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
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  </div>
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
      </div>
    </div>
  )
}

// Helper functions
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
  }

  return (
    fieldMappings[template.id] || [
      { name: "party_name", label: "Party Name", type: "text", required: true, placeholder: "Enter name" },
      { name: "date", label: "Date", type: "date", required: true },
    ]
  )
}

function generateTemplateDocument(template, formData) {
  // This is a simplified version for the dashboard
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
        This document was generated on <strong>${currentDate}</strong>.
      </p>
      
      <div style="margin: 30px 0;">
        ${Object.entries(formData)
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

  // Simplified preview for dashboard
  return `
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
      
      <div style="${sectionStyle}">
        <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline;">DOCUMENT DETAILS:</h3>
        <p style="margin-left: 20px;">
          <strong>Type:</strong> ${template.type}<br>
          <strong>Complexity:</strong> ${template.complexity}<br>
          <strong>Fields to fill:</strong> ${template.fields}<br>
          <strong>Official Seal Required:</strong> ${template.needsGovernmentSeal ? "Yes" : "No"}
        </p>
      </div>
      
      <div style="${signatureStyle}">
        <div style="text-align: center; width: 45%;">
          <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
          <p style="font-weight: bold;">(PARTY A)</p>
        </div>
        <div style="text-align: center; width: 45%;">
          <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px;"></div>
          <p style="font-weight: bold;">(PARTY B)</p>
        </div>
      </div>
    </div>
  `
}
