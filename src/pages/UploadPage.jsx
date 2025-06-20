"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import { Badge } from "../components/ui/badge"
import { Upload, FileText, X, CheckCircle, AlertCircle, Brain, ArrowLeft } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import { ErrorPopup } from "../components/error-popup"
import { useGlobalAlarm } from "../hooks/use-global-alarm"


export default function UploadPage() {
  const [files, setFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const { checkUrgentDocuments } = useGlobalAlarm()

  const uploadAndAnalyzeFile = async (file, fileId) => {
    const formData = new FormData()
    formData.append("document", file)

    try {
      const response = await axios.post("https://legalmindai-backend-production.up.railway.app/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      const serverFileId = response.data.fileId
      pollFileStatus(serverFileId, fileId)
    } catch (error) {
      console.error("Upload failed", error)
      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "error", progress: 0 } : f)))

      // Set error message based on error type
      if (error.response?.status === 413) {
        setError("File is too large. Please upload files smaller than 10MB.")
      } else if (error.response?.status === 415) {
        setError("Unsupported file type. Please upload PDF, DOC, or DOCX files only.")
      } else if (error.code === "NETWORK_ERROR") {
        setError("Network error. Please check your internet connection and try again.")
      } else {
        setError("Upload failed. Please try again or contact support if the problem persists.")
      }
    }
  }

  const pollFileStatus = (fileServerId, fileId) => {
    const interval = setInterval(async () => {
      try {
        const statusResponse = await axios.get(
          `https://legalmindai-backend-production.up.railway.app/api/status/${fileServerId}`,
        )
        const status = statusResponse.data.status
        const progress = statusResponse.data.progress

        if (status === "completed") {
          clearInterval(interval)

          const docResponse = await axios.get(
            `https://legalmindai-backend-production.up.railway.app/api/document/${fileServerId}`,
          )
          const extractedText = docResponse.data.extractedText

          const summaryResponse = await axios.post(
            "https://legalmindai-backend-production.up.railway.app/api/generate-summary",
            {
              prompt: extractedText,
            },
          )

          const type = summaryResponse.data.result.type

          const completedFile = {
            id: fileId,
            name: files.find((f) => f.id === fileId)?.name,
            type: type,
            status: "completed",
            progress: 100,
            analysis: summaryResponse.data.result,
            riskScore: summaryResponse.data.result.riskScore,
            uploadDate: Date.now(),
            deadline: summaryResponse.data.result.deadline || null,
          }

          setFiles((prev) => prev.map((f) => (f.id === fileId ? completedFile : f)))

          // Check for urgent documents after completion
          if (completedFile.deadline) {
            checkUrgentDocuments([completedFile])
          }
        } else if (status === "processing") {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? {
                    ...f,
                    progress: Number(progress),
                    status: "processing",
                  }
                : f,
            ),
          )
        } else if (status === "error") {
          clearInterval(interval)
          setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "error", progress: 0 } : f)))
          setError("Document processing failed. Please try uploading again.")
        }
      } catch (err) {
        console.error("Polling failed", err)
        clearInterval(interval)
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "error", progress: 0 } : f)))
        setError("Connection lost during processing. Please refresh and try again.")
      }
    }, 1000)
  }

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors.some((e) => e.code === "file-too-large")) {
        setError("File is too large. Please upload files smaller than 10MB.")
      } else if (rejection.errors.some((e) => e.code === "file-invalid-type")) {
        setError("Unsupported file type. Please upload PDF, DOC, or DOCX files only.")
      } else {
        setError("File upload failed. Please try again.")
      }
      return
    }

    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      status: "uploading",
      progress: 0,
      file,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    newFiles.forEach((file) => {
      uploadAndAnalyzeFile(file.file, file.id)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const removeFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const completedFiles = files.filter((f) => f.status === "completed")

  useEffect(() => {
    const filesToSave = files.filter((f) => (f.status === "completed" || f.status === "processing") && !f.savedToLocal)

    if (filesToSave.length > 0) {
      const existingDocs = JSON.parse(localStorage.getItem("documents")) || []
      const updatedDocs = [...existingDocs, ...filesToSave.map((f) => ({ ...f, savedToLocal: true }))]

      localStorage.setItem("documents", JSON.stringify(updatedDocs))

      setFiles((prev) => prev.map((f) => (filesToSave.find((c) => c.id === f.id) ? { ...f, savedToLocal: true } : f)))
    }
  }, [files])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Error Popup */}
      <ErrorPopup error={error} onClose={() => setError("")} duration={6000} />

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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Upload Legal Documents</h1>
          <p className="text-slate-600 text-sm md:text-base">
            Upload your legal documents to get AI-powered analysis, risk assessment, and negotiation insights.
          </p>
        </div>

        {/* Upload Area */}
        <Card className="mb-8">
          <CardContent className="p-6 md:p-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 md:p-12 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-10 h-10 md:w-12 md:h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-2">
                {isDragActive ? "Drop files here" : "Drag & drop files here"}
              </h3>
              <p className="text-slate-600 mb-4 text-sm md:text-base">or click to browse your computer</p>
              <p className="text-xs md:text-sm text-slate-500">Supports PDF, DOC, DOCX files up to 10MB</p>
            </div>
          </CardContent>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Processing Files</CardTitle>
              <CardDescription className="text-sm">Your documents are being analyzed by our AI system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {file.status === "completed" ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : file.status === "error" ? (
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      ) : (
                        <FileText className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                        <div className="flex items-center space-x-2">
                          {file.type && (
                            <Badge variant="secondary" className="text-xs">
                              {file.type}
                            </Badge>
                          )}
                          <button onClick={() => removeFile(file.id)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={file.progress} className="flex-1" />
                        <span className="text-xs text-slate-500">{file.progress}%</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {file.size} • {file.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {completedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Analysis Complete</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Your documents have been processed and are ready for review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-slate-800 text-sm md:text-base">{file.name}</p>
                        <p className="text-xs md:text-sm text-slate-600">
                          {file.type} • {file.size}
                        </p>
                      </div>
                    </div>
                    <Link to={`/analysis/${file.id}`} state={{ file }}>
                      <Button size="sm" className="text-xs md:text-sm">
                        View Analysis
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
