"use client"

import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import {
  Brain,
  Shield,
  MessageSquare,
  Globe,
  Mic,
  Calendar,
  FileText,
  Zap,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"
import { Link } from "react-router-dom"

const features = [
  {
    icon: Brain,
    title: "Smart Document Analysis",
    description: "Advanced AI models analyze legal documents with human-level comprehension",
    details: [
      "Automatic document classification (NDA, Service Agreement, etc.)",
      "Key clause identification and extraction",
      "Intelligent summarization of complex legal language",
      "Entity recognition for parties, dates, and amounts",
    ],
    category: "Core AI",
  },
  {
    icon: Shield,
    title: "Risk Assessment Engine",
    description: "Multi-dimensional risk analysis with predictive modeling",
    details: [
      "Color-coded risk heatmaps for quick visual assessment",
      "Document-wide risk scoring (0-100 scale)",
      "Clause-specific risk identification",
      "Recommendations for risk mitigation",
    ],
    category: "Risk Management",
  },
  {
    icon: MessageSquare,
    title: "Negotiation Assistant",
    description: "AI-powered negotiation strategies and communication tools",
    details: [
      "Clause improvement suggestions in multiple tones",
      "Professional email draft generation",
      "Counterparty response simulation",
      "Negotiation strategy recommendations",
    ],
    category: "Negotiation",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Global legal document understanding and translation",
    details: [
      "Real-time translation of legal clauses",
      "Cultural context awareness",
      "Jurisdiction-specific legal interpretations",
      "Support for 15+ languages",
    ],
    category: "Global",
  },
  {
    icon: Mic,
    title: "Voice Q&A Assistant",
    description: "Natural language processing with voice interaction",
    details: [
      "Voice-to-text question input",
      "Context-aware answer generation",
      "Emotional intelligence and tone analysis",
      "Quick question suggestions",
    ],
    category: "Interaction",
  },
  {
    icon: Calendar,
    title: "Obligation Tracking",
    description: "Comprehensive deadline and obligation management",
    details: [
      "Automatic deadline extraction",
      "Calendar integration (Google, Outlook)",
      "Obligation dependency mapping",
      "Automated reminder system",
    ],
    category: "Management",
  },
]

const additionalFeatures = [
  {
    icon: FileText,
    title: "Document Comparison",
    description: "Side-by-side analysis of document versions with semantic difference detection",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share analyses, add comments, and collaborate on document reviews",
  },
  {
    icon: Zap,
    title: "API Integration",
    description: "Integrate LegalMind.AI into your existing workflow with our REST API",
  },
  {
    icon: Clock,
    title: "Real-time Processing",
    description: "Get instant results with our optimized AI processing pipeline",
  },
]

export default function FeaturesPage() {
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

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100 px-4 py-2">
              <Brain className="w-4 h-4 mr-2" />
              Advanced AI Features
            </Badge>
            <h1 className="text-5xl font-bold text-slate-800 mb-6">
              Powerful Features for <span className="text-blue-600">Legal Intelligence</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Discover how our AI-powered platform transforms complex legal documents into clear, actionable insights
              with unprecedented accuracy and speed.
            </p>
            <Link to="/signin">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Try Features Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Core AI Capabilities</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Each feature is designed to address specific challenges in legal document analysis and management.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-slate-200 hover:shadow-lg transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-slate-800 text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-slate-600 mb-4">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-600 text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Additional Capabilities</h2>
            <p className="text-xl text-slate-600">Extended features that enhance your legal document workflow</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-slate-200 hover:shadow-md transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-slate-800 text-lg">{feature.title}</CardTitle>
                        <CardDescription className="text-slate-600">{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-slate-800">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Experience the Power of AI</h2>
            <p className="text-xl text-slate-300 mb-8">
              Ready to transform how you handle legal documents? Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signin">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-slate-800"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
