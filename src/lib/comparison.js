import * as pdfjsLib from "pdfjs-dist"
import { diffLines, diffWords, diffSentences } from "diff"
import jsPDF from "jspdf"

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

// Real PDF text extraction using PDF.js
export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    let fullText = ""
    const pages = []

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()

      let pageText = ""
      textContent.items.forEach((item) => {
        pageText += item.str + " "
      })

      pages.push({
        pageNumber: pageNum,
        text: pageText.trim(),
      })

      fullText += pageText + "\n"
    }

    return {
      fullText: fullText.trim(),
      pages,
      metadata: {
        numPages: pdf.numPages,
        title: await getMetadata(pdf, "Title"),
        author: await getMetadata(pdf, "Author"),
        subject: await getMetadata(pdf, "Subject"),
      },
    }
  } catch (error) {
    console.error("Error extracting PDF text:", error)
    throw new Error(`Failed to extract text from PDF: ${error.message}`)
  }
}

async function getMetadata(pdf, key) {
  try {
    const metadata = await pdf.getMetadata()
    return metadata.info[key] || ""
  } catch {
    return ""
  }
}

// Improved text preprocessing for better comparison
function preprocessText(text) {
  return text
    .replace(/\s+/g, " ") // Normalize whitespace
    .replace(/[^\w\s.,;:!?()-]/g, "") // Remove special characters except basic punctuation
    .trim()
}

// Enhanced text comparison with multiple algorithms
export function compareTexts(text1, text2) {
  // Preprocess texts
  const cleanText1 = preprocessText(text1)
  const cleanText2 = preprocessText(text2)

  // Split into sentences for better granular comparison
  const sentences1 = cleanText1.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const sentences2 = cleanText2.split(/[.!?]+/).filter((s) => s.trim().length > 0)

  // Use multiple diff algorithms for comprehensive analysis
  const lineDiff = diffLines(cleanText1, cleanText2)
  const sentenceDiff = diffSentences(cleanText1, cleanText2)
  const wordDiff = diffWords(cleanText1, cleanText2)

  const changes = []
  let changeId = 1

  // Process sentence-level differences for more accurate detection
  sentenceDiff.forEach((part, index) => {
    if (part.added || part.removed) {
      const sentences = part.value.split(/[.!?]+/).filter((s) => s.trim().length > 0)

      sentences.forEach((sentence) => {
        if (sentence.trim().length > 0) {
          changes.push({
            id: changeId++,
            type: part.added ? "added" : "removed",
            content: sentence.trim(),
            lineNumber: estimateLineNumber(sentence, part.added ? cleanText2 : cleanText1),
            confidence: calculateConfidence(sentence, part.added ? cleanText2 : cleanText1),
            context: getContext(sentence, part.added ? cleanText2 : cleanText1),
          })
        }
      })
    }
  })

  // Detect modifications by comparing similar sentences
  const addedChanges = changes.filter((c) => c.type === "added")
  const removedChanges = changes.filter((c) => c.type === "removed")

  // Find potential modifications
  removedChanges.forEach((removed) => {
    const similarAdded = addedChanges.find((added) => {
      const similarity = calculateSimilarity(removed.content, added.content)
      return similarity > 0.4 && similarity < 0.95 // Threshold for modifications
    })

    if (similarAdded) {
      // Convert to modification
      const removedIndex = changes.findIndex((c) => c.id === removed.id)
      const addedIndex = changes.findIndex((c) => c.id === similarAdded.id)

      if (removedIndex !== -1 && addedIndex !== -1) {
        // Replace removed change with modification
        changes[removedIndex] = {
          id: removed.id,
          type: "modified",
          oldContent: removed.content,
          newContent: similarAdded.content,
          lineNumber: removed.lineNumber,
          confidence: Math.max(removed.confidence, similarAdded.confidence),
          similarity: calculateSimilarity(removed.content, similarAdded.content),
          context: removed.context,
        }

        // Remove the added change
        changes.splice(addedIndex, 1)
      }
    }
  })

  // Calculate summary statistics
  const summary = {
    totalChanges: changes.length,
    added: changes.filter((c) => c.type === "added").length,
    removed: changes.filter((c) => c.type === "removed").length,
    modified: changes.filter((c) => c.type === "modified").length,
    unchanged: Math.max(sentences1.length, sentences2.length) - changes.length,
  }

  return {
    changes: changes.sort((a, b) => a.lineNumber - b.lineNumber),
    summary,
    rawDiff: { lineDiff, sentenceDiff, wordDiff },
  }
}

// Helper function to estimate line number
function estimateLineNumber(sentence, fullText) {
  const lines = fullText.split("\n")
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(sentence.substring(0, 50))) {
      return i + 1
    }
  }
  return 1
}

// Helper function to calculate confidence score
function calculateConfidence(sentence, fullText) {
  const words = sentence.split(" ").length
  if (words < 3) return 0.6
  if (words < 10) return 0.8
  return 0.95
}

// Helper function to get context around a change
function getContext(sentence, fullText) {
  const index = fullText.indexOf(sentence.substring(0, 30))
  if (index === -1) return ""

  const start = Math.max(0, index - 100)
  const end = Math.min(fullText.length, index + sentence.length + 100)
  return fullText.substring(start, end)
}

export function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0

  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1

  if (longer.length === 0) return 1.0

  const distance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase())
  return (longer.length - distance) / longer.length
}

function levenshteinDistance(str1, str2) {
  const matrix = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
      }
    }
  }

  return matrix[str2.length][str1.length]
}

// Enhanced key changes extraction with better patterns
export function extractKeyChanges(changes) {
  const keyChanges = {
    financial: [],
    dates: [],
    parties: [],
    obligations: [],
    termination: [],
    liability: [],
    intellectual_property: [],
    confidentiality: [],
    other: [],
  }

  const patterns = {
    financial: [
      /\$[\d,]+(?:\.\d{2})?/gi,
      /payment|fee|cost|price|salary|wage|compensation|invoice|billing|budget|expense|revenue|profit|loss|amount|money|dollar/gi,
      /\b\d+\s*(?:dollars?|usd|cents?)\b/gi,
    ],
    dates: [
      /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/g,
      /\b\d{4}[/-]\d{1,2}[/-]\d{1,2}\b/g,
      /\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}\b/gi,
      /deadline|due date|expir|effective date|commencement|term|duration|period/gi,
    ],
    parties: [
      /party|parties|client|contractor|vendor|supplier|customer|company|corporation|llc|inc|ltd|partnership|individual|person|entity|organization/gi,
    ],
    obligations: [
      /shall|must|will|required|obligated|responsible|duty|deliver|provide|perform|complete|execute|fulfill|covenant|undertake|agree|commit/gi,
    ],
    termination: [/terminat|end|expir|cancel|dissolv|notice period|notice requirement|breach|default|violation/gi],
    liability: [/liabilit|damage|loss|harm|injury|indemnif|hold harmless|defend|limitation|cap|maximum|unlimited/gi],
    intellectual_property: [
      /intellectual property|ip|copyright|trademark|patent|proprietary|confidential|trade secret|license|ownership|rights/gi,
    ],
    confidentiality: [
      /confidential|non-disclosure|nda|proprietary|secret|private|restricted|disclosure|reveal|share/gi,
    ],
  }

  changes.forEach((change) => {
    const content = (change.content || change.newContent || change.oldContent || "").toLowerCase()
    let categorized = false

    Object.entries(patterns).forEach(([category, categoryPatterns]) => {
      if (!categorized) {
        const matches = categoryPatterns.some((pattern) => pattern.test(content))
        if (matches) {
          keyChanges[category].push({
            ...change,
            category,
            importance: calculateImportance(change, category),
            matchedPattern: categoryPatterns.find((pattern) => pattern.test(content)),
          })
          categorized = true
        }
      }
    })

    if (!categorized) {
      keyChanges.other.push({
        ...change,
        category: "other",
        importance: "low",
      })
    }
  })

  return keyChanges
}

function calculateImportance(change, category) {
  const highImportanceCategories = ["financial", "liability", "termination"]
  const mediumImportanceCategories = ["obligations", "dates", "parties"]

  if (highImportanceCategories.includes(category)) return "high"
  if (mediumImportanceCategories.includes(category)) return "medium"
  return "low"
}

// Generate comprehensive comparison insights
export function generateInsights(originalText, revisedText, changes, keyChanges) {
  const insights = {
    summary: generateSummary(changes),
    riskAssessment: assessRisk(keyChanges),
    recommendations: generateRecommendations(keyChanges),
    impactAnalysis: analyzeImpact(changes, keyChanges),
  }

  return insights
}

function generateSummary(changes) {
  const total = changes.length
  const added = changes.filter((c) => c.type === "added").length
  const removed = changes.filter((c) => c.type === "removed").length
  const modified = changes.filter((c) => c.type === "modified").length

  return {
    total,
    added,
    removed,
    modified,
    description: `Document comparison reveals ${total} changes: ${added} additions, ${removed} removals, and ${modified} modifications.`,
  }
}

function assessRisk(keyChanges) {
  let riskScore = 0
  const riskFactors = []

  // High-risk changes
  if (keyChanges.liability.length > 0) {
    riskScore += keyChanges.liability.length * 15
    riskFactors.push(`${keyChanges.liability.length} liability-related changes detected`)
  }

  if (keyChanges.financial.length > 0) {
    riskScore += keyChanges.financial.length * 12
    riskFactors.push(`${keyChanges.financial.length} financial changes detected`)
  }

  if (keyChanges.termination.length > 0) {
    riskScore += keyChanges.termination.length * 10
    riskFactors.push(`${keyChanges.termination.length} termination-related changes`)
  }

  // Medium-risk changes
  if (keyChanges.obligations.length > 0) {
    riskScore += keyChanges.obligations.length * 8
    riskFactors.push(`${keyChanges.obligations.length} obligation changes`)
  }

  if (keyChanges.dates.length > 0) {
    riskScore += keyChanges.dates.length * 6
    riskFactors.push(`${keyChanges.dates.length} date-related changes`)
  }

  const riskLevel = riskScore > 50 ? "high" : riskScore > 25 ? "medium" : "low"

  return {
    score: Math.min(riskScore, 100),
    level: riskLevel,
    factors: riskFactors,
  }
}

function generateRecommendations(keyChanges) {
  const recommendations = []

  if (keyChanges.financial.length > 0) {
    recommendations.push({
      category: "Financial",
      priority: "high",
      recommendation:
        "Review all financial changes carefully, including payment terms, amounts, and billing schedules.",
    })
  }

  if (keyChanges.liability.length > 0) {
    recommendations.push({
      category: "Liability",
      priority: "high",
      recommendation: "Assess liability changes for potential risk exposure and consider legal consultation.",
    })
  }

  if (keyChanges.termination.length > 0) {
    recommendations.push({
      category: "Termination",
      priority: "medium",
      recommendation: "Verify termination clauses align with business requirements and notice periods are acceptable.",
    })
  }

  if (keyChanges.dates.length > 0) {
    recommendations.push({
      category: "Dates",
      priority: "medium",
      recommendation: "Confirm all date changes are accurate and achievable within your operational timeline.",
    })
  }

  return recommendations
}

function analyzeImpact(changes, keyChanges) {
  const impact = {
    operational: 0,
    financial: 0,
    legal: 0,
    timeline: 0,
  }

  // Calculate impact scores
  impact.financial = keyChanges.financial.length * 20 + keyChanges.liability.length * 15
  impact.legal =
    keyChanges.liability.length * 25 +
    keyChanges.intellectual_property.length * 15 +
    keyChanges.confidentiality.length * 10
  impact.operational = keyChanges.obligations.length * 15 + keyChanges.parties.length * 10
  impact.timeline = keyChanges.dates.length * 20 + keyChanges.termination.length * 15

  return {
    scores: impact,
    overall: Math.max(...Object.values(impact)),
    primaryConcern: Object.entries(impact).reduce((a, b) => (impact[a[0]] > impact[b[0]] ? a : b))[0],
  }
}

// Improved text formatting into structured points
export function formatTextIntoPoints(text) {
  // Split text into sentences and paragraphs
  const paragraphs = text.split("\n").filter((p) => p.trim())
  const points = []

  paragraphs.forEach((paragraph, pIndex) => {
    const sentences = paragraph.split(/[.!?]+/).filter((s) => s.trim().length > 10) // Filter out very short sentences
    sentences.forEach((sentence, sIndex) => {
      if (sentence.trim()) {
        points.push({
          id: `${pIndex}-${sIndex}`,
          content: sentence.trim(),
          paragraph: pIndex,
          sentence: sIndex,
          wordCount: sentence.trim().split(" ").length,
        })
      }
    })
  })

  return points
}

// Enhanced side-by-side comparison
export function createSideBySideComparison(originalText, revisedText, changes) {
  const originalPoints = formatTextIntoPoints(originalText)
  const revisedPoints = formatTextIntoPoints(revisedText)

  const comparisonData = []
  const maxLength = Math.max(originalPoints.length, revisedPoints.length)

  for (let i = 0; i < maxLength; i++) {
    const originalPoint = originalPoints[i] || null
    const revisedPoint = revisedPoints[i] || null

    // More accurate change detection
    let relatedChange = null
    let status = "unchanged"

    if (originalPoint && revisedPoint) {
      // Check if content is similar
      const similarity = calculateSimilarity(originalPoint.content, revisedPoint.content)

      if (similarity < 0.8) {
        // Find related change
        relatedChange = changes.find((change) => {
          if (change.type === "modified") {
            return (
              originalPoint.content.includes(change.oldContent.substring(0, 30)) ||
              revisedPoint.content.includes(change.newContent.substring(0, 30))
            )
          } else {
            const content = change.content || ""
            return (
              originalPoint.content.includes(content.substring(0, 30)) ||
              revisedPoint.content.includes(content.substring(0, 30))
            )
          }
        })

        status = relatedChange ? relatedChange.type : "modified"
      }
    } else if (originalPoint && !revisedPoint) {
      status = "removed"
      relatedChange = changes.find(
        (change) => change.type === "removed" && originalPoint.content.includes(change.content.substring(0, 30)),
      )
    } else if (!originalPoint && revisedPoint) {
      status = "added"
      relatedChange = changes.find(
        (change) => change.type === "added" && revisedPoint.content.includes(change.content.substring(0, 30)),
      )
    }

    comparisonData.push({
      index: i + 1,
      original: originalPoint,
      revised: revisedPoint,
      change: relatedChange,
      status: status,
      similarity: originalPoint && revisedPoint ? calculateSimilarity(originalPoint.content, revisedPoint.content) : 0,
    })
  }

  return comparisonData
}

// Enhanced PDF report generation (keeping the existing structure but with better formatting)
export async function generateComparisonReport(comparisonData, originalFileName, revisedFileName) {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.width
  const pageHeight = pdf.internal.pageSize.height
  const margin = 20
  let yPosition = margin

  // Helper function to add text with word wrapping
  function addText(text, x, y, maxWidth, fontSize = 12) {
    pdf.setFontSize(fontSize)
    const lines = pdf.splitTextToSize(text, maxWidth)
    pdf.text(lines, x, y)
    return y + lines.length * fontSize * 0.4
  }

  // Helper function to add a table
  function addTable(headers, rows, startY) {
    const colWidth = (pageWidth - 2 * margin) / headers.length
    let currentY = startY

    // Add headers
    pdf.setFontSize(10)
    pdf.setFont(undefined, "bold")
    headers.forEach((header, index) => {
      pdf.text(header, margin + index * colWidth + 2, currentY)
    })

    // Add header line
    pdf.line(margin, currentY + 2, pageWidth - margin, currentY + 2)
    currentY += 8

    // Add rows
    pdf.setFont(undefined, "normal")
    rows.forEach((row, rowIndex) => {
      if (currentY > pageHeight - 40) {
        pdf.addPage()
        currentY = margin

        // Re-add headers on new page
        pdf.setFont(undefined, "bold")
        headers.forEach((header, index) => {
          pdf.text(header, margin + index * colWidth + 2, currentY)
        })
        pdf.line(margin, currentY + 2, pageWidth - margin, currentY + 2)
        currentY += 8
        pdf.setFont(undefined, "normal")
      }

      row.forEach((cell, cellIndex) => {
        const cellText = pdf.splitTextToSize(cell, colWidth - 4)
        pdf.text(cellText, margin + cellIndex * colWidth + 2, currentY)
      })

      currentY += 12

      // Add row separator
      if (rowIndex < rows.length - 1) {
        pdf.line(margin, currentY - 2, pageWidth - margin, currentY - 2)
      }
    })

    return currentY + 10
  }

  // Helper function to check if we need a new page
  function checkNewPage(requiredHeight) {
    if (yPosition + requiredHeight > pageHeight - margin) {
      pdf.addPage()
      yPosition = margin
    }
  }

  // Title Page
  pdf.setFontSize(24)
  pdf.setFont(undefined, "bold")
  pdf.text("Contract Comparison Report", pageWidth / 2, 40, { align: "center" })

  pdf.setFontSize(14)
  pdf.setFont(undefined, "normal")
  yPosition = 60
  yPosition = addText(`Original Document: ${originalFileName}`, margin, yPosition, pageWidth - 2 * margin)
  yPosition = addText(`Revised Document: ${revisedFileName}`, margin, yPosition + 10, pageWidth - 2 * margin)
  yPosition = addText(`Generated: ${new Date().toLocaleString()}`, margin, yPosition + 10, pageWidth - 2 * margin)

  // Executive Summary
  checkNewPage(60)
  yPosition += 20
  pdf.setFontSize(18)
  pdf.setFont(undefined, "bold")
  yPosition = addText("Executive Summary", margin, yPosition, pageWidth - 2 * margin, 18)

  pdf.setFontSize(12)
  pdf.setFont(undefined, "normal")
  yPosition += 10
  yPosition = addText(comparisonData.insights.summary.description, margin, yPosition, pageWidth - 2 * margin)

  // Summary Statistics Table
  checkNewPage(100)
  yPosition += 20
  pdf.setFontSize(16)
  pdf.setFont(undefined, "bold")
  yPosition = addText("Summary Statistics", margin, yPosition, pageWidth - 2 * margin, 16)
  yPosition += 10

  const summaryHeaders = ["Metric", "Count", "Percentage"]
  const total = Math.max(comparisonData.summary.totalChanges, 1) // Avoid division by zero
  const summaryRows = [
    ["Total Changes", comparisonData.summary.totalChanges.toString(), "100%"],
    [
      "Additions",
      comparisonData.summary.added.toString(),
      `${Math.round((comparisonData.summary.added / total) * 100)}%`,
    ],
    [
      "Removals",
      comparisonData.summary.removed.toString(),
      `${Math.round((comparisonData.summary.removed / total) * 100)}%`,
    ],
    [
      "Modifications",
      comparisonData.summary.modified.toString(),
      `${Math.round((comparisonData.summary.modified / total) * 100)}%`,
    ],
  ]

  yPosition = addTable(summaryHeaders, summaryRows, yPosition)

  // Key Changes Table
  checkNewPage(150)
  yPosition += 20
  pdf.setFontSize(16)
  pdf.setFont(undefined, "bold")
  yPosition = addText("Key Changes by Category", margin, yPosition, pageWidth - 2 * margin, 16)
  yPosition += 10

  const keyChangeHeaders = ["Category", "Type", "Line", "Description"]
  const keyChangeRows = []

  Object.entries(comparisonData.keyChanges).forEach(([category, changes]) => {
    changes.slice(0, 20).forEach((change) => {
      const description =
        change.type === "modified"
          ? `${change.oldContent.substring(0, 40)}... → ${change.newContent.substring(0, 40)}...`
          : change.content.substring(0, 80) + (change.content.length > 80 ? "..." : "")

      keyChangeRows.push([
        category.replace(/_/g, " ").toUpperCase(),
        change.type.toUpperCase(),
        change.lineNumber.toString(),
        description,
      ])
    })
  })

  if (keyChangeRows.length > 0) {
    yPosition = addTable(keyChangeHeaders, keyChangeRows, yPosition)
  }

  // All Changes Table
  checkNewPage(150)
  yPosition += 20
  pdf.setFontSize(16)
  pdf.setFont(undefined, "bold")
  yPosition = addText("All Changes", margin, yPosition, pageWidth - 2 * margin, 16)
  yPosition += 10

  const allChangeHeaders = ["#", "Type", "Line", "Content"]
  const allChangeRows = comparisonData.changes.slice(0, 50).map((change, index) => {
    const content =
      change.type === "modified"
        ? `OLD: ${change.oldContent.substring(0, 60)}... NEW: ${change.newContent.substring(0, 60)}...`
        : change.content.substring(0, 100) + (change.content.length > 100 ? "..." : "")

    return [(index + 1).toString(), change.type.toUpperCase(), change.lineNumber.toString(), content]
  })

  if (allChangeRows.length > 0) {
    yPosition = addTable(allChangeHeaders, allChangeRows, yPosition)
  }

  // Side-by-Side Comparison Points
  const sideBySideData = createSideBySideComparison(
    comparisonData.originalText,
    comparisonData.revisedText,
    comparisonData.changes,
  )

  checkNewPage(150)
  yPosition += 20
  pdf.setFontSize(16)
  pdf.setFont(undefined, "bold")
  yPosition = addText("Side-by-Side Comparison", margin, yPosition, pageWidth - 2 * margin, 16)
  yPosition += 10

  const sideByHeaders = ["Point", "Original", "Revised", "Status"]
  const sideByRows = sideBySideData
    .slice(0, 30)
    .map((item) => [
      item.index.toString(),
      item.original ? item.original.content.substring(0, 50) + (item.original.content.length > 50 ? "..." : "") : "N/A",
      item.revised ? item.revised.content.substring(0, 50) + (item.revised.content.length > 50 ? "..." : "") : "N/A",
      item.status.toUpperCase(),
    ])

  if (sideByRows.length > 0) {
    yPosition = addTable(sideByHeaders, sideByRows, yPosition)
  }

  // Risk Assessment and Recommendations (keep existing code)
  checkNewPage(80)
  yPosition += 15
  pdf.setFontSize(16)
  pdf.setFont(undefined, "bold")
  yPosition = addText("Risk Assessment", margin, yPosition, pageWidth - 2 * margin, 16)

  pdf.setFontSize(12)
  pdf.setFont(undefined, "normal")
  yPosition += 10
  yPosition = addText(
    `Risk Level: ${comparisonData.insights.riskAssessment.level.toUpperCase()}`,
    margin,
    yPosition,
    pageWidth - 2 * margin,
  )
  yPosition = addText(
    `Risk Score: ${comparisonData.insights.riskAssessment.score}/100`,
    margin,
    yPosition + 5,
    pageWidth - 2 * margin,
  )

  if (comparisonData.insights.riskAssessment.factors.length > 0) {
    yPosition += 10
    yPosition = addText("Risk Factors:", margin, yPosition, pageWidth - 2 * margin)
    comparisonData.insights.riskAssessment.factors.forEach((factor) => {
      yPosition = addText(`• ${factor}`, margin + 10, yPosition + 5, pageWidth - 2 * margin - 10)
    })
  }

  // Recommendations
  if (comparisonData.insights.recommendations.length > 0) {
    checkNewPage(100)
    yPosition += 20
    pdf.setFontSize(16)
    pdf.setFont(undefined, "bold")
    yPosition = addText("Recommendations", margin, yPosition, pageWidth - 2 * margin, 16)

    comparisonData.insights.recommendations.forEach((rec) => {
      checkNewPage(40)
      yPosition += 15
      pdf.setFontSize(12)
      pdf.setFont(undefined, "bold")
      yPosition = addText(
        `${rec.category} (${rec.priority.toUpperCase()} Priority)`,
        margin,
        yPosition,
        pageWidth - 2 * margin,
        12,
      )

      pdf.setFont(undefined, "normal")
      yPosition = addText(rec.recommendation, margin, yPosition + 5, pageWidth - 2 * margin)
    })
  }

  // Footer
  const totalPages = pdf.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFontSize(8)
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: "right" })
    pdf.text("Generated by LegalMind.AI", margin, pageHeight - 10)
  }

  return pdf
}
