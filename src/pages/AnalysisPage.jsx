"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Progress } from "../components/ui/progress"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import {
  FileText,
  Shield,
  MessageSquare,
  Download,
  Share,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  DollarSign,
  Calendar,
  Mic,
  Send,
  Brain,
  ArrowLeft,
} from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { motion } from "framer-motion"

// Mock data for demonstration
const mockAnalysis = {
  id: "doc_123",
  name: "Service Agreement - TechCorp.pdf",
  type: "Service Agreement",
  riskScore: 72,
  summary:
    "This is a comprehensive service agreement between TechCorp and the client covering software development services, payment terms, intellectual property rights, and termination clauses. The agreement includes standard confidentiality provisions and liability limitations.",
  entities: {
    parties: ["TechCorp LLC", "Client Company Inc."],
    dates: ["2024-01-15", "2024-12-31"],
    amounts: ["$50,000", "$5,000"],
    obligations: ["Deliver software within 90 days", "Monthly progress reports", "24/7 support"],
  },
  riskAreas: [
    {
      clause: "Indemnification",
      risk: "high",
      description: "Broad indemnification clause may expose you to significant liability",
    },
    {
      clause: "Termination",
      risk: "medium",
      description: "30-day notice period may be insufficient for project completion",
    },
    { clause: "Payment Terms", risk: "low", description: "Standard NET-30 payment terms" },
  ],
}

export default function AnalysisPage() {
  const { id } = useParams()
  const [question, setQuestion] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [negotiationTone, setNegotiationTone] = useState("balanced")

  const getRiskColor = (risk) => {
    switch (risk) {
      case "high":
        return "text-red-600 bg-red-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "low":
        return "text-green-600 bg-green-100"
      default:
        return "text-slate-600 bg-slate-100"
    }
  }

  const getRiskIcon = (risk) => {
    switch (risk) {
      case "high":
        return <AlertTriangle className="w-4 h-4" />
      case "medium":
        return <Clock className="w-4 h-4" />
      case "low":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

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
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Link to="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Back to Dashboard */}
      <div className="container mx-auto px-4 py-4">
        <motion.div whileHover={{ x: -5 }}>
          <Link to="/dashboard" className="flex items-center text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Document Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">{mockAnalysis.name}</h1>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary">{mockAnalysis.type}</Badge>
                <span className="text-slate-600">Analyzed 2 minutes ago</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-800 mb-1">Risk Score: {mockAnalysis.riskScore}/100</div>
              <Progress value={mockAnalysis.riskScore} className="w-32" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
                <TabsTrigger value="entities">Key Details</TabsTrigger>
                <TabsTrigger value="negotiate">Negotiate</TabsTrigger>
                <TabsTrigger value="compare">Compare</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Document Summary</CardTitle>
                    <CardDescription>AI-generated overview of your legal document</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 leading-relaxed">{mockAnalysis.summary}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-slate-800">Parties Involved</p>
                          <p className="text-sm text-slate-600">{mockAnalysis.entities.parties.length} parties</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-slate-800">Financial Terms</p>
                          <p className="text-sm text-slate-600">
                            {mockAnalysis.entities.amounts.length} amounts identified
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium text-slate-800">Important Dates</p>
                          <p className="text-sm text-slate-600">{mockAnalysis.entities.dates.length} dates found</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                        <Shield className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="font-medium text-slate-800">Obligations</p>
                          <p className="text-sm text-slate-600">
                            {mockAnalysis.entities.obligations.length} key obligations
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risks" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Assessment</CardTitle>
                    <CardDescription>Identified risk areas in your document</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAnalysis.riskAreas.map((risk, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge className={getRiskColor(risk.risk)}>
                                {getRiskIcon(risk.risk)}
                                <span className="ml-1 capitalize">{risk.risk} Risk</span>
                              </Badge>
                              <h3 className="font-semibold text-slate-800">{risk.clause}</h3>
                            </div>
                          </div>
                          <p className="text-slate-600">{risk.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="entities" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Parties</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {mockAnalysis.entities.parties.map((party, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span>{party}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Terms</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {mockAnalysis.entities.amounts.map((amount, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span>{amount}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Important Dates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {mockAnalysis.entities.dates.map((date, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <span>{new Date(date).toLocaleDateString()}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Key Obligations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {mockAnalysis.entities.obligations.map((obligation, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Shield className="w-4 h-4 text-orange-600 mt-0.5" />
                            <span className="text-sm">{obligation}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="negotiate" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Negotiation Assistant</CardTitle>
                    <CardDescription>Get AI-powered suggestions for better terms</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Negotiation Tone</label>
                      <Select value={negotiationTone} onValueChange={setNegotiationTone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friendly">Friendly (Freelancer)</SelectItem>
                          <SelectItem value="balanced">Balanced</SelectItem>
                          <SelectItem value="formal">Formal (Corporate)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-medium text-slate-800 mb-2">Suggested Improvements</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                          <span>
                            Consider adding a force majeure clause to protect against unforeseen circumstances
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                          <span>Request a 60-day termination notice instead of 30 days</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                          <span>Negotiate a liability cap to limit your exposure</span>
                        </li>
                      </ul>
                    </div>

                    <Button className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Generate Negotiation Email
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compare" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Document Comparison</CardTitle>
                    <CardDescription>Compare this document with another version</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                      <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-800 mb-2">Upload Comparison Document</h3>
                      <p className="text-slate-600 mb-4">Upload another version to see what changed</p>
                      <Button variant="outline">Choose File</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Q&A Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Ask Questions</span>
                </CardTitle>
                <CardDescription>Get instant answers about your document</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Ask a question about this document..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsListening(!isListening)}
                      className={isListening ? "bg-red-50 border-red-200" : ""}
                    >
                      <Mic className={`w-4 h-4 ${isListening ? "text-red-600" : ""}`} />
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Send className="w-4 h-4 mr-2" />
                      Ask
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Quick Questions:</p>
                  <div className="space-y-1">
                    {[
                      "Can I terminate early?",
                      "What are the payment terms?",
                      "Who owns the IP rights?",
                      "Are there penalty clauses?",
                    ].map((q, index) => (
                      <button
                        key={index}
                        onClick={() => setQuestion(q)}
                        className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Document Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Summary
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Export Deadlines
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share className="w-4 h-4 mr-2" />
                  Share Analysis
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
