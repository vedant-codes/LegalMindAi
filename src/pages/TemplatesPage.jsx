"use client"

import { useState } from "react"
import { motion } from "framer-motion"
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
  Handshake,
  Briefcase,
  Brain,
  ArrowLeft,
} from "lucide-react"
import { Link } from "react-router-dom"

const templates = [
  {
    id: "1",
    name: "Non-Disclosure Agreement",
    type: "NDA",
    description: "Standard confidentiality agreement for protecting sensitive information",
    category: "Confidentiality",
    downloads: 1250,
    rating: 4.8,
    icon: Shield,
    color: "bg-blue-50 text-blue-600",
    tags: ["Confidentiality", "Business", "Standard"],
    lastUpdated: "2024-01-10",
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
    color: "bg-green-50 text-green-600",
    tags: ["Services", "Professional", "Consulting"],
    lastUpdated: "2024-01-08",
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
    color: "bg-purple-50 text-purple-600",
    tags: ["Employment", "HR", "Legal"],
    lastUpdated: "2024-01-05",
  },
  {
    id: "4",
    name: "Licensing Agreement",
    type: "License",
    description: "Software and intellectual property licensing template",
    category: "IP",
    downloads: 642,
    rating: 4.6,
    icon: FileText,
    color: "bg-orange-50 text-orange-600",
    tags: ["IP", "Software", "Licensing"],
    lastUpdated: "2024-01-03",
  },
  {
    id: "5",
    name: "Partnership Agreement",
    type: "Partnership",
    description: "Business partnership agreement for joint ventures and collaborations",
    category: "Business",
    downloads: 534,
    rating: 4.8,
    icon: Handshake,
    color: "bg-teal-50 text-teal-600",
    tags: ["Partnership", "Business", "Collaboration"],
    lastUpdated: "2023-12-28",
  },
  {
    id: "6",
    name: "Consulting Agreement",
    type: "Consulting",
    description: "Independent contractor agreement for consulting services",
    category: "Services",
    downloads: 423,
    rating: 4.5,
    icon: Building,
    color: "bg-indigo-50 text-indigo-600",
    tags: ["Consulting", "Independent", "Services"],
    lastUpdated: "2023-12-25",
  },
]

const categories = ["All", "Confidentiality", "Services", "HR", "IP", "Business"]

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("popular")

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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Legal Document Templates</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Professional, legally-reviewed templates to jumpstart your document creation. Customize and download
              instantly.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Templates", value: templates.length, color: "text-blue-600" },
              { label: "Categories", value: categories.length - 1, color: "text-green-600" },
              {
                label: "Total Downloads",
                value: templates.reduce((sum, t) => sum + t.downloads, 0).toLocaleString(),
                color: "text-purple-600",
              },
              {
                label: "Avg Rating",
                value: (templates.reduce((sum, t) => sum + t.rating, 0) / templates.length).toFixed(1),
                color: "text-orange-600",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="border-slate-200 text-center">
                  <CardContent className="p-4">
                    <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
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
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className={selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : ""}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm"
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

        {/* Templates Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-slate-200 hover:shadow-lg transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center`}>
                        <template.icon className="w-6 h-6" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-slate-700">{template.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-slate-800 text-lg mb-2">{template.name}</CardTitle>
                    <CardDescription className="text-slate-600 mb-4 leading-relaxed">
                      {template.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{template.downloads.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Updated {new Date(template.lastUpdated).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* No Results */}
        {sortedTemplates.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No templates found</h3>
            <p className="text-slate-600 mb-4">Try adjusting your search criteria or browse all categories.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
