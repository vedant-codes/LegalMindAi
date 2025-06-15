import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import FeaturesPage from "./pages/FeaturesPage"
import PricingPage from "./pages/PricingPage"
import DocumentsPage from "./pages/DocumentsPage"
import TemplatesPage from "./pages/TemplatesPage"
import UploadPage from "./pages/UploadPage"
import AnalysisPage from "./pages/AnalysisPage"
import DashboardPage from "./pages/DashboardPage"
import ComparisonPage from "./pages/ComparisonPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/documents" element={<DocumentsPage />} />
      <Route path="/templates" element={<TemplatesPage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/analysis/:id" element={<AnalysisPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/compare" element={<ComparisonPage />} />
    </Routes>
  )
}

export default App
