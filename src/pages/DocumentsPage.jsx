"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import {
  FileText,
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  AlertTriangle,
  Clock,
  CheckCircle,
  Download,
  Share,
  Trash2,
  Eye,
  Brain,
  ArrowLeft,
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
    lastModified: "2 hours ago",
  },
  {
    id: "2",
    name: "NDA - StartupXYZ.docx",
    type: "NDA",
    status: "processing",
    riskScore: null,
    uploadDate: "2024-01-14",
    size: "1.2 MB",
    lastModified: "1 day ago",
  },
  {
    id: "3",
    name: "Employment Contract - Jane Doe.pdf",
    type: "Employment Contract",
    status: "analyzed",
    riskScore: 45,
    uploadDate: "2024-01-13",
    size: "3.1 MB",
    lastModified: "2 days ago",
  },
  {
    id: "4",
    name: "Licensing Agreement - SoftwareCo.pdf",
    type: "Licensing Agreement",
    status: "analyzed",
    riskScore: 89,
    uploadDate: "2024-01-12",
    size: "4.7 MB",
    lastModified: "3 days ago",
  },
  {
    id: "5",
    name: "Partnership Agreement - ABC Corp.pdf",
    type: "Partnership Agreement",
    status: "analyzed",
    riskScore: 56,
    uploadDate: "2024-01-11",
    size: "2.8 MB",
    lastModified: "4 days ago",
  },
  {
    id: "6",
    name: "Consulting Agreement - FreelancePro.pdf",
    type: "Consulting Agreement",
    status: "error",
    riskScore: null,
    uploadDate: "2024-01-10",
    size: "1.9 MB",
    lastModified: "5 days ago",
  },
]

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "analyzed":
        return <CheckCircle className="w-4 h-4" />
      case "processing":
        return <Clock className="w-4 h-4" />
      case "error":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getRiskColor = (score) => {
    if (!score) return "text-slate-400"
    if (score >= 80) return "text-red-600"
    if (score >= 60) return "text-yellow-600"
    return "text-green-600"
  }

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || doc.type.toLowerCase().includes(filterType.toLowerCase())
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <motion.div whileHover={{ scale: 1.02 }}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            <span className="text-2xl font-bold text-slate-800">LegalMind.AI</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {[
              { name: "Features", href: "/features" },
              { name: "Pricing", href: "/pricing" },
              { name: "API", href: "/api" },
              { name: "About", href: "/about" },
            ].map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.href}
                  className="text-slate-600 hover:text-blue-600 transition-colors relative group font-medium"
                >
                  {item.name}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600"
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/signin">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Dashboard</Button>
              </Link>
            </motion.div>
          </nav>
        </div>
      </motion.header>

      {/* Back to Home */}
      <div className="container mx-auto px-4 py-4">
        <motion.div whileHover={{ x: -5 }}>
          <Link to="/" className="flex items-center text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">Documents</h1>
              <p className="text-slate-600">Manage and analyze your legal documents with AI-powered insights.</p>
            </div>
            <Link to="/upload">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: "Total Documents", value: mockDocuments.length, color: "text-blue-600" },
              {
                label: "Analyzed",
                value: mockDocuments.filter((d) => d.status === "analyzed").length,
                color: "text-green-600",
              },
              {
                label: "Processing",
                value: mockDocuments.filter((d) => d.status === "processing").length,
                color: "text-yellow-600",
              },
              {
                label: "High Risk",
                value: mockDocuments.filter((d) => d.riskScore && d.riskScore >= 80).length,
                color: "text-red-600",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                      <div className="text-sm text-slate-600">{stat.label}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="border-slate-200 mb-8">
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
                    <option value="partnership">Partnership</option>
                    <option value="consulting">Consulting</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="name">Name A-Z</option>
                    <option value="risk">Risk Score</option>
                    <option value="type">Document Type</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Documents List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Your Documents</CardTitle>
              <CardDescription>
                {filteredDocuments.length} of {mockDocuments.length} documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDocuments.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    whileHover={{ y: -2 }}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-800 mb-1">{doc.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <Badge variant="secondary" className="text-xs">
                            {doc.type}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
                            {getStatusIcon(doc.status)}
                            <span className="ml-1 capitalize">{doc.status}</span>
                          </Badge>
                          <span>{doc.size}</span>
                          <span>Modified {doc.lastModified}</span>
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
                          <Link to={`/analysis/${doc.id}`}>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        ) : doc.status === "processing" ? (
                          <Button size="sm" variant="outline" disabled>
                            <Clock className="w-4 h-4 mr-1" />
                            Processing
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Error
                          </Button>
                        )}

                        <div className="flex items-center space-x-1">
                          <Button size="sm" variant="ghost" className="p-2">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="p-2">
                            <Share className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="p-2 text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="p-2">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
