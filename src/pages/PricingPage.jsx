"use client"

import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { CheckCircle, X, Zap, Crown, Building, Brain, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

const plans = [
  {
    name: "Starter",
    price: 29,
    period: "month",
    description: "Perfect for freelancers and small projects",
    icon: Zap,
    color: "border-slate-200",
    buttonStyle: "bg-slate-600 hover:bg-slate-700",
    features: [
      { name: "5 documents per month", included: true },
      { name: "Basic AI analysis", included: true },
      { name: "Risk assessment", included: true },
      { name: "Email support", included: true },
      { name: "Document templates", included: false },
      { name: "API access", included: false },
      { name: "Team collaboration", included: false },
      { name: "Priority support", included: false },
    ],
  },
  {
    name: "Professional",
    price: 79,
    period: "month",
    description: "Ideal for growing businesses and startups",
    icon: Crown,
    color: "border-blue-500 ring-2 ring-blue-500 ring-opacity-20",
    buttonStyle: "bg-blue-600 hover:bg-blue-700",
    popular: true,
    features: [
      { name: "50 documents per month", included: true },
      { name: "Advanced AI analysis", included: true },
      { name: "Risk assessment", included: true },
      { name: "Priority email support", included: true },
      { name: "Document templates", included: true },
      { name: "Basic API access", included: true },
      { name: "Team collaboration (5 users)", included: true },
      { name: "Phone support", included: false },
    ],
  },
  {
    name: "Enterprise",
    price: 199,
    period: "month",
    description: "For large organizations with complex needs",
    icon: Building,
    color: "border-slate-200",
    buttonStyle: "bg-slate-600 hover:bg-slate-700",
    features: [
      { name: "Unlimited documents", included: true },
      { name: "Advanced AI analysis", included: true },
      { name: "Risk assessment", included: true },
      { name: "24/7 priority support", included: true },
      { name: "Custom templates", included: true },
      { name: "Full API access", included: true },
      { name: "Unlimited team collaboration", included: true },
      { name: "Dedicated account manager", included: true },
    ],
  },
]

const faqs = [
  {
    question: "Can I change my plan at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "What happens if I exceed my document limit?",
    answer:
      "You'll be notified when you're approaching your limit. You can either upgrade your plan or purchase additional documents.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, all plans come with a 14-day free trial. No credit card required to start.",
  },
  {
    question: "Do you offer custom enterprise solutions?",
    answer: "Contact our sales team to discuss custom pricing and features for large organizations.",
  },
]

export default function PricingPage() {
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
              <Crown className="w-4 h-4 mr-2" />
              Simple, Transparent Pricing
            </Badge>
            <h1 className="text-5xl font-bold text-slate-800 mb-6">
              Choose the Perfect Plan for <span className="text-blue-600">Your Needs</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Start with our free trial and scale as you grow. All plans include our core AI features with no hidden
              fees.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <Card className={`${plan.color} hover:shadow-lg transition-all duration-300 h-full`}>
                  <CardHeader className="text-center pb-8">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <plan.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800">{plan.name}</CardTitle>
                    <CardDescription className="text-slate-600 mb-4">{plan.description}</CardDescription>
                    <div className="text-center">
                      <span className="text-4xl font-bold text-slate-800">${plan.price}</span>
                      <span className="text-slate-600">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          {feature.included ? (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-slate-400 flex-shrink-0" />
                          )}
                          <span className={feature.included ? "text-slate-700" : "text-slate-400"}>{feature.name}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full ${plan.buttonStyle} text-white`}>Start Free Trial</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Compare All Features</h2>
            <p className="text-xl text-slate-600">See exactly what's included in each plan</p>
          </motion.div>

          <motion.div
            className="overflow-x-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-6 font-semibold text-slate-800">Features</th>
                  {plans.map((plan) => (
                    <th key={plan.name} className="text-center py-4 px-6 font-semibold text-slate-800">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans[0].features.map((feature, index) => (
                  <tr key={index} className="border-b hover:bg-slate-50">
                    <td className="py-4 px-6 text-slate-700">{feature.name}</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="text-center py-4 px-6">
                        {plan.features[index].included ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-slate-400 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-600">Everything you need to know about our pricing</p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-800">{faq.question}</CardTitle>
                    <CardDescription className="text-slate-600 leading-relaxed">{faq.answer}</CardDescription>
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
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-slate-300 mb-8">
              Join thousands of professionals who trust LegalMind.AI with their legal documents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-slate-800"
              >
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
