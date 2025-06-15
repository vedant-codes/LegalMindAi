"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import {
  Upload,
  FileText,
  ArrowLeft,
  Brain,
  GitCompare,
  AlertTriangle,
  Plus,
  Minus,
  Edit3,
  Download,
  Share,
  CheckCircle,
  Loader2,
  TrendingUp,
  Shield,
} from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  extractTextFromPDF,
  compareTexts,
  extractKeyChanges,
  generateInsights,
  generateComparisonReport,
  createSideBySideComparison,
} from "../lib/comparison"

// Mock document data (same as dashboard)
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

export default function ComparisonPage() {
  const [searchParams] = useSearchParams()
  const [files, setFiles] = useState({ original: null, revised: null })
  const [isProcessing, setIsProcessing] = useState(false)
  const [comparisonResult, setComparisonResult] = useState(null)
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState("")
  const [error, setError] = useState(null)
  const [sideBySideData, setSideBySideData] = useState(null)

  // Pre-populate original document if coming from dashboard
  useEffect(() => {
    const originalId = searchParams.get("original")
    if (originalId) {
      const preSelectedDoc = mockDocuments.find((doc) => doc.id === originalId)
      if (preSelectedDoc) {
        setFiles((prev) => ({
          ...prev,
          original: {
            file: new File([], preSelectedDoc.name, { type: "application/pdf" }),
            name: preSelectedDoc.name,
            size: Number.parseFloat(preSelectedDoc.size) * 1024 * 1024,
            status: "uploaded",
            id: preSelectedDoc.id,
          },
        }))
      }
    }
  }, [searchParams])

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e, fileType) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      const file = droppedFiles[0]
      if (file.type === "application/pdf") {
        setFiles((prev) => ({
          ...prev,
          [fileType]: {
            file,
            name: file.name,
            size: file.size,
            status: "uploaded",
          },
        }))
      } else {
        setError("Please upload PDF files only")
      }
    }
  }

  const handleFileUpload = (event, fileType) => {
    const file = event.target.files[0]
    if (file && file.type === "application/pdf") {
      setFiles((prev) => ({
        ...prev,
        [fileType]: {
          file,
          name: file.name,
          size: file.size,
          status: "uploaded",
        },
      }))
      setError(null)
    } else {
      setError("Please upload PDF files only")
    }
  }

  const compareDocuments = async () => {
    if (!files.original || !files.revised) return

    setIsProcessing(true)
    setProgress(0)
    setError(null)

    try {
      // Step 1: Extract text from original document
      setProgressMessage("Extracting text from original document...")
      setProgress(10)

      const originalData = await extractTextFromPDF(files.original.file)
      setProgress(30)

      // Step 2: Extract text from revised document
      setProgressMessage("Extracting text from revised document...")
      const revisedData = await extractTextFromPDF(files.revised.file)
      setProgress(50)

      // Step 3: Compare documents
      setProgressMessage("Analyzing differences...")
      const comparisonData = compareTexts(originalData.fullText, revisedData.fullText)
      setProgress(70)

      // Step 4: Extract key changes
      setProgressMessage("Categorizing changes...")
      const keyChanges = extractKeyChanges(comparisonData.changes)
      setProgress(80)

      // Step 5: Create side-by-side comparison
      setProgressMessage("Creating side-by-side comparison...")
      const sideBySide = createSideBySideComparison(originalData.fullText, revisedData.fullText, comparisonData.changes)
      setSideBySideData(sideBySide)
      setProgress(90)

      // Step 6: Generate insights
      setProgressMessage("Generating insights...")
      const insights = generateInsights(originalData.fullText, revisedData.fullText, comparisonData.changes, keyChanges)
      setProgress(95)

      setProgressMessage("Finalizing results...")
      setComparisonResult({
        originalText: originalData.fullText,
        revisedText: revisedData.fullText,
        originalData,
        revisedData,
        changes: comparisonData.changes,
        keyChanges,
        summary: comparisonData.summary,
        insights,
        sideBySideData: sideBySide,
        metadata: {
          originalFile: files.original.name,
          revisedFile: files.revised.name,
          comparisonDate: new Date().toISOString(),
          processingTime: Date.now(),
        },
      })

      setProgress(100)
      setProgressMessage("Comparison complete!")
    } catch (error) {
      console.error("Comparison failed:", error)
      setError(`Comparison failed: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const exportReport = async () => {
    if (!comparisonResult) return

    try {
      setProgressMessage("Generating PDF report...")
      const pdf = await generateComparisonReport(comparisonResult, files.original.name, files.revised.name)

      const fileName = `comparison-report-${new Date().toISOString().split("T")[0]}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error("Report generation failed:", error)
      setError(`Failed to generate report: ${error.message}`)
    }
  }

  const getChangeIcon = (type) => {
    switch (type) {
      case "added":
        return <Plus className="w-4 h-4 text-green-600" />
      case "removed":
        return <Minus className="w-4 h-4 text-red-600" />
      case "modified":
        return <Edit3 className="w-4 h-4 text-blue-600" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getChangeColor = (type) => {
    switch (type) {
      case "added":
        return "bg-green-50 border-green-200 text-green-800"
      case "removed":
        return "bg-red-50 border-red-200 text-red-800"
      case "modified":
        return "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  const getImportanceColor = (importance) => {
    switch (importance) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRiskLevelColor = (level) => {
    switch (level) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
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
            <Link to="/upload">
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-4">
        <motion.div whileHover={{ x: -5 }}>
          <Link to="/dashboard" className="flex items-center text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <GitCompare className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-slate-800">Contract Version Comparison</h1>
          </div>
          <p className="text-slate-600">
            Upload two versions of your contract to see what changed between versions with AI-powered analysis.
          </p>
          {searchParams.get("original") && (
            <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-700">
                <strong>Original document pre-selected:</strong> {files.original?.name}
              </p>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {!comparisonResult ? (
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original Document */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>Original Version</span>
                  </CardTitle>
                  <CardDescription>Upload the original contract version</CardDescription>
                </CardHeader>
                <CardContent>
                  {!files.original ? (
                    <div
                      className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-slate-50 transition-colors"
                      onClick={() => document.getElementById("original-upload").click()}
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, "original")}
                    >
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600 mb-2">Click to upload original PDF</p>
                      <p className="text-sm text-slate-500">or drag and drop here</p>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload(e, "original")}
                        className="hidden"
                        id="original-upload"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{files.original.name}</p>
                        <p className="text-sm text-slate-600">{formatFileSize(files.original.size)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFiles((prev) => ({ ...prev, original: null }))}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Revised Document */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    <span>Revised Version</span>
                  </CardTitle>
                  <CardDescription>Upload the revised contract version</CardDescription>
                </CardHeader>
                <CardContent>
                  {!files.revised ? (
                    <div
                      className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-slate-50 transition-colors"
                      onClick={() => document.getElementById("revised-upload").click()}
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, "revised")}
                    >
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600 mb-2">Click to upload revised PDF</p>
                      <p className="text-sm text-slate-500">or drag and drop here</p>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload(e, "revised")}
                        className="hidden"
                        id="revised-upload"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{files.revised.name}</p>
                        <p className="text-sm text-slate-600">{formatFileSize(files.revised.size)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFiles((prev) => ({ ...prev, revised: null }))}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Compare Button */}
            <div className="text-center">
              <Button
                onClick={compareDocuments}
                disabled={!files.original || !files.revised || isProcessing}
                size="lg"
                className="px-8 bg-purple-600 hover:bg-purple-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Comparing Documents...
                  </>
                ) : (
                  <>
                    <GitCompare className="w-5 h-5 mr-2" />
                    Compare Documents
                  </>
                )}
              </Button>
            </div>

            {/* Processing Progress */}
            {isProcessing && (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Analyzing Documents</h3>
                    <p className="text-slate-600">{progressMessage}</p>
                  </div>
                  <Progress value={progress} className="mb-2" />
                  <p className="text-sm text-slate-500 text-center">{progress}% complete</p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Comparison Results */
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-slate-800">{comparisonResult.summary.totalChanges}</div>
                  <div className="text-sm text-slate-600">Total Changes</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{comparisonResult.summary.added}</div>
                  <div className="text-sm text-slate-600">Added</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{comparisonResult.summary.removed}</div>
                  <div className="text-sm text-slate-600">Removed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{comparisonResult.summary.modified}</div>
                  <div className="text-sm text-slate-600">Modified</div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                  <span>Risk Assessment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold ${getRiskLevelColor(comparisonResult.insights.riskAssessment.level)}`}
                    >
                      {comparisonResult.insights.riskAssessment.level.toUpperCase()}
                    </div>
                    <div className="text-sm text-slate-600">Risk Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800">
                      {comparisonResult.insights.riskAssessment.score}/100
                    </div>
                    <div className="text-sm text-slate-600">Risk Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {comparisonResult.insights.impactAnalysis.primaryConcern}
                    </div>
                    <div className="text-sm text-slate-600">Primary Concern</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => {
                  setComparisonResult(null)
                  setFiles({ original: null, revised: null })
                  setSideBySideData(null)
                  setProgress(0)
                  setProgressMessage("")
                }}
              >
                Compare New Documents
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={exportReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Detailed Comparison */}
            <Tabs defaultValue="key-changes" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="key-changes">Key Changes</TabsTrigger>
                <TabsTrigger value="all-changes">All Changes</TabsTrigger>
                <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="key-changes" className="space-y-4">
                {Object.entries(comparisonResult.keyChanges).map(
                  ([category, changes]) =>
                    changes.length > 0 && (
                      <Card key={category}>
                        <CardHeader>
                          <CardTitle className="capitalize flex items-center space-x-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                            <span>{category.replace(/_/g, " ")} Changes</span>
                            <Badge variant="secondary">{changes.length}</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {changes.slice(0, 20).map((change, index) => (
                              <div
                                key={change.id || index}
                                className={`p-4 rounded-lg border-l-4 ${
                                  change.type === "added"
                                    ? "bg-green-50 border-l-green-500 border border-green-200"
                                    : change.type === "removed"
                                      ? "bg-red-50 border-l-red-500 border border-red-200"
                                      : change.type === "modified"
                                        ? "bg-blue-50 border-l-blue-500 border border-blue-200"
                                        : "bg-gray-50 border-l-gray-500 border border-gray-200"
                                }`}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center space-x-3">
                                    {getChangeIcon(change.type)}
                                    <div className="flex items-center space-x-2">
                                      <Badge variant="outline" className="text-xs font-mono">
                                        #{change.id || index + 1}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        Line {change.lineNumber}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs capitalize">
                                        {change.type}
                                      </Badge>
                                      {change.importance && (
                                        <Badge className={`text-xs ${getImportanceColor(change.importance)}`}>
                                          {change.importance} priority
                                        </Badge>
                                      )}
                                      {change.confidence && (
                                        <Badge variant="secondary" className="text-xs">
                                          {Math.round(change.confidence * 100)}% confidence
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  {change.type === "modified" ? (
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                          <Minus className="w-4 h-4 text-red-600" />
                                          <span className="text-sm font-semibold text-red-700">Original</span>
                                        </div>
                                        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm leading-relaxed">
                                          {change.oldContent}
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                          <Plus className="w-4 h-4 text-green-600" />
                                          <span className="text-sm font-semibold text-green-700">Revised</span>
                                        </div>
                                        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm leading-relaxed">
                                          {change.newContent}
                                        </div>
                                      </div>
                                      {change.similarity && (
                                        <div className="md:col-span-2 text-xs text-slate-500">
                                          Similarity: {Math.round(change.similarity * 100)}%
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2">
                                        {change.type === "added" ? (
                                          <>
                                            <Plus className="w-4 h-4 text-green-600" />
                                            <span className="text-sm font-semibold text-green-700">Added Content</span>
                                          </>
                                        ) : (
                                          <>
                                            <Minus className="w-4 h-4 text-red-600" />
                                            <span className="text-sm font-semibold text-red-700">Removed Content</span>
                                          </>
                                        )}
                                      </div>
                                      <div className="p-3 bg-white border rounded text-sm leading-relaxed">
                                        {change.content}
                                      </div>
                                    </div>
                                  )}

                                  {change.context && (
                                    <details className="mt-3">
                                      <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-700">
                                        Show context
                                      </summary>
                                      <div className="mt-2 p-2 bg-slate-50 border rounded text-xs text-slate-600">
                                        ...{change.context}...
                                      </div>
                                    </details>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          {changes.length > 20 && (
                            <div className="mt-4 text-center">
                              <p className="text-sm text-slate-500">
                                Showing 20 of {changes.length} changes. Download the full report for complete details.
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ),
                )}
              </TabsContent>

              <TabsContent value="all-changes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>All Document Changes</CardTitle>
                    <CardDescription>Complete list of changes between versions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {comparisonResult.changes.slice(0, 50).map((change, index) => (
                        <div
                          key={change.id || index}
                          className={`p-4 rounded-lg border-l-4 ${
                            change.type === "added"
                              ? "bg-green-50 border-l-green-500 border border-green-200"
                              : change.type === "removed"
                                ? "bg-red-50 border-l-red-500 border border-red-200"
                                : change.type === "modified"
                                  ? "bg-blue-50 border-l-blue-500 border border-blue-200"
                                  : "bg-gray-50 border-l-gray-500 border border-gray-200"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              {getChangeIcon(change.type)}
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs font-mono">
                                  #{change.id || index + 1}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Line {change.lineNumber}
                                </Badge>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {change.type}
                                </Badge>
                                {change.confidence && (
                                  <Badge variant="secondary" className="text-xs">
                                    {Math.round(change.confidence * 100)}% confidence
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {change.type === "modified" ? (
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Minus className="w-4 h-4 text-red-600" />
                                    <span className="text-sm font-semibold text-red-700">Original</span>
                                  </div>
                                  <div className="p-3 bg-red-50 border border-red-200 rounded text-sm leading-relaxed">
                                    {change.oldContent}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Plus className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-semibold text-green-700">Revised</span>
                                  </div>
                                  <div className="p-3 bg-green-50 border border-green-200 rounded text-sm leading-relaxed">
                                    {change.newContent}
                                  </div>
                                </div>
                                {change.similarity && (
                                  <div className="md:col-span-2 text-xs text-slate-500">
                                    Similarity: {Math.round(change.similarity * 100)}%
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  {change.type === "added" ? (
                                    <>
                                      <Plus className="w-4 h-4 text-green-600" />
                                      <span className="text-sm font-semibold text-green-700">Added Content</span>
                                    </>
                                  ) : (
                                    <>
                                      <Minus className="w-4 h-4 text-red-600" />
                                      <span className="text-sm font-semibold text-red-700">Removed Content</span>
                                    </>
                                  )}
                                </div>
                                <div className="p-3 bg-white border rounded text-sm leading-relaxed">
                                  {change.content}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {comparisonResult.changes.length > 50 && (
                      <div className="mt-4 text-center">
                        <p className="text-sm text-slate-500">
                          Showing 50 of {comparisonResult.changes.length} changes. Download the full report for complete
                          details.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="side-by-side" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Point-by-Point Comparison</CardTitle>
                    <CardDescription>Side-by-side comparison of document content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-slate-300">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="border border-slate-300 px-4 py-2 text-left text-sm font-medium text-slate-700">
                              Point #
                            </th>
                            <th className="border border-slate-300 px-4 py-2 text-left text-sm font-medium text-slate-700">
                              Original Version
                            </th>
                            <th className="border border-slate-300 px-4 py-2 text-left text-sm font-medium text-slate-700">
                              Revised Version
                            </th>
                            <th className="border border-slate-300 px-4 py-2 text-left text-sm font-medium text-slate-700">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {comparisonResult.sideBySideData?.slice(0, 100).map((item, index) => (
                            <tr
                              key={index}
                              className={`
                  ${
                    item.status === "added"
                      ? "bg-green-50"
                      : item.status === "removed"
                        ? "bg-red-50"
                        : item.status === "modified"
                          ? "bg-blue-50"
                          : "bg-white"
                  }
                  hover:opacity-80
                `}
                            >
                              <td className="border border-slate-300 px-4 py-2 text-sm font-medium">{item.index}</td>
                              <td className="border border-slate-300 px-4 py-2 text-sm">
                                {item.original ? (
                                  <div className="max-w-md">{item.original.content}</div>
                                ) : (
                                  <span className="text-slate-400 italic">No content</span>
                                )}
                              </td>
                              <td className="border border-slate-300 px-4 py-2 text-sm">
                                {item.revised ? (
                                  <div className="max-w-md">{item.revised.content}</div>
                                ) : (
                                  <span className="text-slate-400 italic">No content</span>
                                )}
                              </td>
                              <td className="border border-slate-300 px-4 py-2">
                                <div className="flex items-center space-x-2">
                                  {getChangeIcon(item.status)}
                                  <span className="text-sm capitalize">{item.status}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {comparisonResult.sideBySideData && comparisonResult.sideBySideData.length > 100 && (
                      <div className="mt-4 text-center">
                        <p className="text-sm text-slate-500">
                          Showing 100 of {comparisonResult.sideBySideData.length} points. Download the full report for
                          complete details.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <span>Impact Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Financial Impact</span>
                        <span className="text-sm font-medium">
                          {comparisonResult.insights.impactAnalysis.scores.financial}/100
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Legal Impact</span>
                        <span className="text-sm font-medium">
                          {comparisonResult.insights.impactAnalysis.scores.legal}/100
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Operational Impact</span>
                        <span className="text-sm font-medium">
                          {comparisonResult.insights.impactAnalysis.scores.operational}/100
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Timeline Impact</span>
                        <span className="text-sm font-medium">
                          {comparisonResult.insights.impactAnalysis.scores.timeline}/100
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <span>Risk Factors</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {comparisonResult.insights.riskAssessment.factors.map((factor, index) => (
                          <div key={index} className="text-sm text-slate-700">
                            • {factor}
                          </div>
                        ))}
                        {comparisonResult.insights.riskAssessment.factors.length === 0 && (
                          <div className="text-sm text-slate-500">No significant risk factors identified</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                {comparisonResult.insights.recommendations.length > 0 ? (
                  comparisonResult.insights.recommendations.map((rec, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              rec.priority === "high"
                                ? "bg-red-500"
                                : rec.priority === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                          />
                          <span>{rec.category}</span>
                          <Badge variant={rec.priority === "high" ? "destructive" : "secondary"}>
                            {rec.priority} priority
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-700">{rec.recommendation}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">No Critical Issues Found</h3>
                      <p className="text-slate-600">
                        The document changes appear to be low-risk and don't require immediate attention.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
