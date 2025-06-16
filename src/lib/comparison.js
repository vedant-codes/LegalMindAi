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

// Enhanced PDF report generation with better formatting and alignment
export async function generateComparisonReport(comparisonData, originalFileName, revisedFileName) {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.width
  const pageHeight = pdf.internal.pageSize.height
  const margin = 20
  let yPosition = margin

  // Color definitions
  const colors = {
    primary: [41, 98, 255], // Blue
    success: [34, 197, 94], // Green
    danger: [239, 68, 68], // Red
    warning: [245, 158, 11], // Yellow
    secondary: [107, 114, 128], // Gray
    dark: [31, 41, 55], // Dark gray
    light: [249, 250, 251], // Light gray
  }

  // Helper function to set color
  function setColor(colorArray) {
    pdf.setTextColor(colorArray[0], colorArray[1], colorArray[2])
  }

  // Helper function to set fill color
  function setFillColor(colorArray) {
    pdf.setFillColor(colorArray[0], colorArray[1], colorArray[2])
  }

  // Helper function to add text with word wrapping and better formatting
  function addText(text, x, y, maxWidth, fontSize = 12, color = colors.dark, isBold = false) {
    pdf.setFontSize(fontSize)
    pdf.setFont(undefined, isBold ? "bold" : "normal")
    setColor(color)
    const lines = pdf.splitTextToSize(text, maxWidth)
    pdf.text(lines, x, y)
    return y + lines.length * (fontSize * 0.4) + 2
  }

  // Helper function to add a styled header
  function addHeader(text, level = 1, y = null) {
    if (y !== null) yPosition = y

    checkNewPage(30)

    const fontSize = level === 1 ? 18 : level === 2 ? 16 : 14
    const color = level === 1 ? colors.primary : level === 2 ? colors.dark : colors.secondary

    // Add some spacing before header
    yPosition += level === 1 ? 15 : 10

    yPosition = addText(text, margin, yPosition, pageWidth - 2 * margin, fontSize, color, true)

    // Add underline for main headers
    if (level <= 2) {
      setColor(level === 1 ? colors.primary : colors.secondary)
      pdf.setLineWidth(level === 1 ? 1 : 0.5)
      pdf.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 8
    } else {
      yPosition += 5
    }

    return yPosition
  }

  // Helper function to add bullet points
  function addBulletPoint(text, x, y, maxWidth, fontSize = 11) {
    setColor(colors.dark)
    pdf.setFontSize(fontSize)
    pdf.setFont(undefined, "normal")

    // Add bullet
    pdf.text("•", x, y)

    // Add text with proper indentation
    const lines = pdf.splitTextToSize(text, maxWidth - 10)
    pdf.text(lines, x + 8, y)

    return y + lines.length * (fontSize * 0.4) + 3
  }

  // Enhanced table function with better styling
  function addStyledTable(headers, rows, startY, options = {}) {
    const {
      headerColor = colors.primary,
      headerBgColor = colors.light,
      alternateRows = true,
      borderColor = colors.secondary,
      fontSize = 10,
    } = options

    const colWidth = (pageWidth - 2 * margin) / headers.length
    let currentY = startY

    // Table header background
    setFillColor(headerBgColor)
    pdf.rect(margin, currentY - 5, pageWidth - 2 * margin, 15, "F")

    // Table header border
    setColor(borderColor)
    pdf.setLineWidth(0.5)
    pdf.rect(margin, currentY - 5, pageWidth - 2 * margin, 15)

    // Add headers
    pdf.setFontSize(fontSize + 1)
    pdf.setFont(undefined, "bold")
    setColor(headerColor)
    headers.forEach((header, index) => {
      const cellX = margin + index * colWidth + 5
      pdf.text(header, cellX, currentY + 5)

      // Vertical lines for header
      if (index > 0) {
        pdf.line(margin + index * colWidth, currentY - 5, margin + index * colWidth, currentY + 10)
      }
    })

    currentY += 15

    // Add rows
    pdf.setFont(undefined, "normal")
    pdf.setFontSize(fontSize)
    setColor(colors.dark)

    rows.forEach((row, rowIndex) => {
      if (currentY > pageHeight - 50) {
        pdf.addPage()
        currentY = margin + 20

        // Re-add headers on new page
        setFillColor(headerBgColor)
        pdf.rect(margin, currentY - 5, pageWidth - 2 * margin, 15, "F")

        setColor(borderColor)
        pdf.rect(margin, currentY - 5, pageWidth - 2 * margin, 15)

        pdf.setFontSize(fontSize + 1)
        pdf.setFont(undefined, "bold")
        setColor(headerColor)
        headers.forEach((header, index) => {
          const cellX = margin + index * colWidth + 5
          pdf.text(header, cellX, currentY + 5)
          if (index > 0) {
            pdf.line(margin + index * colWidth, currentY - 5, margin + index * colWidth, currentY + 10)
          }
        })
        currentY += 15
        pdf.setFont(undefined, "normal")
        pdf.setFontSize(fontSize)
        setColor(colors.dark)
      }

      // Alternate row background
      if (alternateRows && rowIndex % 2 === 1) {
        setFillColor([248, 250, 252]) // Very light gray
        pdf.rect(margin, currentY - 2, pageWidth - 2 * margin, 18, "F")
      }

      // Calculate row height based on content
      let maxRowHeight = 12
      const cellContents = row.map((cell, cellIndex) => {
        const cellWidth = colWidth - 10
        const lines = pdf.splitTextToSize(cell, cellWidth)
        maxRowHeight = Math.max(maxRowHeight, lines.length * (fontSize * 0.4) + 8)
        return lines
      })

      // Add cell content
      row.forEach((cell, cellIndex) => {
        const cellX = margin + cellIndex * colWidth + 5
        const lines = cellContents[cellIndex]

        // Add text
        pdf.text(lines, cellX, currentY + 8)

        // Vertical lines
        if (cellIndex > 0) {
          setColor(borderColor)
          pdf.line(margin + cellIndex * colWidth, currentY - 2, margin + cellIndex * colWidth, currentY + maxRowHeight)
        }
      })

      // Horizontal line after row
      setColor(borderColor)
      pdf.line(margin, currentY + maxRowHeight, pageWidth - margin, currentY + maxRowHeight)

      currentY += maxRowHeight + 2
    })

    // Final border
    setColor(borderColor)
    pdf.rect(margin, startY - 5, pageWidth - 2 * margin, currentY - startY + 5)

    return currentY + 10
  }

  // Helper function to add a colored info box
  function addInfoBox(title, content, color = colors.primary, bgColor = null) {
    checkNewPage(40)

    if (!bgColor) {
      bgColor = [color[0], color[1], color[2], 0.1] // Light version of the color
    }

    // Background
    setFillColor([245, 247, 250])
    pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 35, 3, 3, "F")

    // Left border
    setFillColor(color)
    pdf.rect(margin, yPosition, 4, 35, "F")

    // Title
    yPosition = addText(title, margin + 15, yPosition + 10, pageWidth - 2 * margin - 20, 12, color, true)

    // Content
    yPosition = addText(content, margin + 15, yPosition + 2, pageWidth - 2 * margin - 20, 10, colors.dark, false)

    yPosition += 15
    return yPosition
  }

  // Helper function to check if we need a new page
  function checkNewPage(requiredHeight) {
    if (yPosition + requiredHeight > pageHeight - margin) {
      pdf.addPage()
      yPosition = margin + 10
    }
  }

  // Helper function to add statistics cards
  function addStatCard(title, value, color, x, y, width = 80, height = 40) {
    // Card background
    setFillColor([255, 255, 255])
    pdf.roundedRect(x, y, width, height, 2, 2, "F")

    // Card border
    setColor([229, 231, 235])
    pdf.setLineWidth(0.5)
    pdf.roundedRect(x, y, width, height, 2, 2)

    // Value
    pdf.setFontSize(18)
    pdf.setFont(undefined, "bold")
    setColor(color)
    pdf.text(value.toString(), x + width / 2, y + 20, { align: "center" })

    // Title
    pdf.setFontSize(9)
    pdf.setFont(undefined, "normal")
    setColor(colors.secondary)
    pdf.text(title, x + width / 2, y + 32, { align: "center" })
  }

  // ==================== START REPORT GENERATION ====================

  // TITLE PAGE
  setFillColor(colors.primary)
  pdf.rect(0, 0, pageWidth, 60, "F")

  pdf.setFontSize(28)
  pdf.setFont(undefined, "bold")
  setColor([255, 255, 255])
  pdf.text("CONTRACT COMPARISON REPORT", pageWidth / 2, 35, { align: "center" })

  yPosition = 80

  // Document info box
  addInfoBox(
    "Document Information",
    `Original: ${originalFileName}\nRevised: ${revisedFileName}\nGenerated: ${new Date().toLocaleString()}`,
    colors.primary,
  )

  // EXECUTIVE SUMMARY
  addHeader("Executive Summary", 1)
  yPosition = addText(
    comparisonData.insights.summary.description,
    margin,
    yPosition,
    pageWidth - 2 * margin,
    12,
    colors.dark,
  )

  // SUMMARY STATISTICS CARDS
  addHeader("Summary Statistics", 2)

  const cardWidth = (pageWidth - 2 * margin - 30) / 4
  const cardY = yPosition + 10

  addStatCard("Total Changes", comparisonData.summary.totalChanges, colors.primary, margin, cardY, cardWidth)
  addStatCard("Added", comparisonData.summary.added, colors.success, margin + cardWidth + 10, cardY, cardWidth)
  addStatCard("Removed", comparisonData.summary.removed, colors.danger, margin + 2 * (cardWidth + 10), cardY, cardWidth)
  addStatCard(
    "Modified",
    comparisonData.summary.modified,
    colors.warning,
    margin + 3 * (cardWidth + 10),
    cardY,
    cardWidth,
  )

  yPosition = cardY + 50

  // RISK ASSESSMENT
  addHeader("Risk Assessment", 2)

  const riskLevel = comparisonData.insights.riskAssessment.level
  const riskColor = riskLevel === "high" ? colors.danger : riskLevel === "medium" ? colors.warning : colors.success

  addInfoBox(
    `Risk Level: ${riskLevel.toUpperCase()} (Score: ${comparisonData.insights.riskAssessment.score}/100)`,
    `Primary Concern: ${comparisonData.insights.impactAnalysis.primaryConcern}`,
    riskColor,
  )

  if (comparisonData.insights.riskAssessment.factors.length > 0) {
    yPosition = addText("Risk Factors:", margin, yPosition, pageWidth - 2 * margin, 12, colors.dark, true)
    yPosition += 5

    comparisonData.insights.riskAssessment.factors.forEach((factor) => {
      yPosition = addBulletPoint(factor, margin + 10, yPosition, pageWidth - 2 * margin - 20)
    })
  }

  // KEY CHANGES BY CATEGORY
  checkNewPage(100)
  addHeader("Key Changes by Category", 2)

  const keyChangeHeaders = ["Category", "Type", "Priority", "Description"]
  const keyChangeRows = []

  Object.entries(comparisonData.keyChanges).forEach(([category, changes]) => {
    changes.slice(0, 15).forEach((change) => {
      const description =
        change.type === "modified"
          ? `${change.oldContent.substring(0, 50)}... → ${change.newContent.substring(0, 50)}...`
          : change.content.substring(0, 100) + (change.content.length > 100 ? "..." : "")

      keyChangeRows.push([
        category.replace(/_/g, " ").toUpperCase(),
        change.type.toUpperCase(),
        change.importance || "LOW",
        description,
      ])
    })
  })

  if (keyChangeRows.length > 0) {
    yPosition = addStyledTable(keyChangeHeaders, keyChangeRows, yPosition, {
      headerColor: colors.primary,
      fontSize: 9,
    })
  } else {
    yPosition = addText("No key changes detected.", margin, yPosition, pageWidth - 2 * margin, 11, colors.secondary)
  }

  // ALL CHANGES SUMMARY
  checkNewPage(100)
  addHeader("All Changes Summary", 2)

  const allChangeHeaders = ["#", "Type", "Line", "Content Preview"]
  const allChangeRows = comparisonData.changes.slice(0, 30).map((change, index) => {
    const content =
      change.type === "modified"
        ? `OLD: ${change.oldContent.substring(0, 40)}... NEW: ${change.newContent.substring(0, 40)}...`
        : change.content.substring(0, 80) + (change.content.length > 80 ? "..." : "")

    return [(index + 1).toString(), change.type.toUpperCase(), change.lineNumber.toString(), content]
  })

  if (allChangeRows.length > 0) {
    yPosition = addStyledTable(allChangeHeaders, allChangeRows, yPosition, {
      headerColor: colors.dark,
      fontSize: 9,
      alternateRows: true,
    })
  }

  // DETAILED CHANGES
  checkNewPage(100)
  addHeader("Detailed Changes Analysis", 2)

  comparisonData.changes.slice(0, 20).forEach((change, index) => {
    checkNewPage(60)

    // Change header
    addHeader(`Change #${index + 1} - ${change.type.toUpperCase()} (Line ${change.lineNumber})`, 3)

    if (change.type === "modified") {
      // Original content
      yPosition = addText("Original Content:", margin, yPosition, pageWidth - 2 * margin, 11, colors.danger, true)
      yPosition += 3
      setFillColor([254, 242, 242]) // Light red background
      pdf.rect(margin, yPosition - 2, pageWidth - 2 * margin, 20, "F")
      yPosition = addText(change.oldContent, margin + 5, yPosition + 8, pageWidth - 2 * margin - 10, 10, colors.dark)
      yPosition += 8

      // New content
      yPosition = addText("Revised Content:", margin, yPosition, pageWidth - 2 * margin, 11, colors.success, true)
      yPosition += 3
      setFillColor([240, 253, 244]) // Light green background
      pdf.rect(margin, yPosition - 2, pageWidth - 2 * margin, 20, "F")
      yPosition = addText(change.newContent, margin + 5, yPosition + 8, pageWidth - 2 * margin - 10, 10, colors.dark)
      yPosition += 8

      if (change.similarity) {
        yPosition = addText(
          `Similarity: ${Math.round(change.similarity * 100)}%`,
          margin,
          yPosition,
          pageWidth - 2 * margin,
          9,
          colors.secondary,
        )
      }
    } else {
      const bgColor = change.type === "added" ? [240, 253, 244] : [254, 242, 242]
      const textColor = change.type === "added" ? colors.success : colors.danger

      yPosition = addText(
        `${change.type === "added" ? "Added" : "Removed"} Content:`,
        margin,
        yPosition,
        pageWidth - 2 * margin,
        11,
        textColor,
        true,
      )
      yPosition += 3
      setFillColor(bgColor)
      pdf.rect(margin, yPosition - 2, pageWidth - 2 * margin, 20, "F")
      yPosition = addText(change.content, margin + 5, yPosition + 8, pageWidth - 2 * margin - 10, 10, colors.dark)
      yPosition += 8
    }

    if (change.confidence) {
      yPosition = addText(
        `Confidence: ${Math.round(change.confidence * 100)}%`,
        margin,
        yPosition,
        pageWidth - 2 * margin,
        9,
        colors.secondary,
      )
    }

    yPosition += 10
  })

  // RECOMMENDATIONS
  if (comparisonData.insights.recommendations.length > 0) {
    checkNewPage(80)
    addHeader("Recommendations", 2)

    comparisonData.insights.recommendations.forEach((rec, index) => {
      checkNewPage(50)

      const priorityColor =
        rec.priority === "high" ? colors.danger : rec.priority === "medium" ? colors.warning : colors.success

      addInfoBox(`${rec.category} (${rec.priority.toUpperCase()} Priority)`, rec.recommendation, priorityColor)
    })
  }

  // IMPACT ANALYSIS
  checkNewPage(80)
  addHeader("Impact Analysis", 2)

  const impacts = [
    { name: "Financial Impact", score: comparisonData.insights.impactAnalysis.scores.financial },
    { name: "Legal Impact", score: comparisonData.insights.impactAnalysis.scores.legal },
    { name: "Operational Impact", score: comparisonData.insights.impactAnalysis.scores.operational },
    { name: "Timeline Impact", score: comparisonData.insights.impactAnalysis.scores.timeline },
  ]

  impacts.forEach((impact) => {
    const barWidth = (impact.score / 100) * (pageWidth - 2 * margin - 100)
    const barColor = impact.score > 70 ? colors.danger : impact.score > 40 ? colors.warning : colors.success

    yPosition = addText(`${impact.name}:`, margin, yPosition, 80, 11, colors.dark, true)

    // Progress bar background
    setFillColor([229, 231, 235])
    pdf.rect(margin + 85, yPosition - 8, pageWidth - 2 * margin - 100, 8, "F")

    // Progress bar fill
    setFillColor(barColor)
    pdf.rect(margin + 85, yPosition - 8, barWidth, 8, "F")

    // Score text
    yPosition = addText(`${impact.score}/100`, pageWidth - margin - 30, yPosition, 30, 10, colors.dark)
    yPosition += 8
  })

  // FOOTER ON ALL PAGES
  const totalPages = pdf.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)

    // Footer background
    setFillColor([248, 250, 252])
    pdf.rect(0, pageHeight - 20, pageWidth, 20, "F")

    // Footer content
    pdf.setFontSize(8)
    pdf.setFont(undefined, "normal")
    setColor(colors.secondary)
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: "right" })
    pdf.text("Generated by LegalMind.AI", margin, pageHeight - 8)
    pdf.text(new Date().toLocaleDateString(), pageWidth / 2, pageHeight - 8, { align: "center" })
  }

  return pdf
}
