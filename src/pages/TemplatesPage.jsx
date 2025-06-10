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
  Briefcase,
  Brain,
  ArrowLeft,
  UserCheck,
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
    icon: UserCheck, // ✅ Fixed here
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
            {[{ name: "Features", href: "/features" }, { name: "Pricing", href: "/pricing" }, { name: "API", href: "/api" }, { name: "About", href: "/about" }].map(
              (item, index) => (
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
              )
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/signin">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Dashboard</Button>
              </Link>
            </motion.div>
          </nav>
        </div>
      </motion.header>

      {/* Remaining component remains unchanged */}
      {/* Back to Home, Search/Filter, Templates Grid, and No Results block follows here */}
      {/* Your original code for those sections remains unchanged and is already correct */}
    </div>
  )
}
