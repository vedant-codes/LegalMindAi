"use client"

import { useState } from "react"
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
  Brain,
  ArrowLeft,
  GitCompare,
} from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

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

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

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

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || doc.type.toLowerCase().includes(filterType.toLowerCase())
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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

          <div className="flex items-center space-x-4">
            <Link to="/upload">
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </Link>
          </div>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-600">Manage and analyze your legal documents with AI-powered insights.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Documents</p>
                  <p className="text-2xl font-bold text-slate-800">{mockStats.totalDocuments}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">High Risk</p>
                  <p className="text-2xl font-bold text-red-600">{mockStats.highRiskDocuments}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg Risk Score</p>
                  <p className="text-2xl font-bold text-yellow-600">{mockStats.avgRiskScore}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">This Month</p>
                  <p className="text-2xl font-bold text-green-600">{mockStats.documentsThisMonth}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
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
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-800">{doc.name}</h3>
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
                                <Button size="sm">View Analysis</Button>
                              </Link>
                              <Link to={`/compare?original=${doc.id}`}>
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
            <Card>
              <CardHeader>
                <CardTitle>Legal Templates</CardTitle>
                <CardDescription>Pre-built templates for common legal documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      name: "Non-Disclosure Agreement",
                      type: "NDA",
                      description: "Standard confidentiality agreement",
                    },
                    { name: "Service Agreement", type: "Contract", description: "Professional services contract" },
                    { name: "Employment Contract", type: "Employment", description: "Standard employment terms" },
                    { name: "Licensing Agreement", type: "License", description: "Software licensing terms" },
                    { name: "Partnership Agreement", type: "Partnership", description: "Business partnership terms" },
                    { name: "Consulting Agreement", type: "Consulting", description: "Independent contractor terms" },
                  ].map((template, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <h3 className="font-medium text-slate-800 mb-2">{template.name}</h3>
                        <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                        <Badge variant="secondary" className="text-xs">
                          {template.type}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
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
    </div>
  )
}
