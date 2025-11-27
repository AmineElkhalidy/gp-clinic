"use client"

import { useState } from "react"
import { generatePrescriptionPDF, generateInvoicePDF } from "@/lib/pdf"
import { toast } from "sonner"

export function usePrescriptionPDF() {
  const [isGenerating, setIsGenerating] = useState(false)

  const downloadPrescription = async (prescriptionId: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch(`/api/prescriptions/${prescriptionId}/pdf`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Erreur lors de la récupération des données")
      }

      const doc = generatePrescriptionPDF(result.data)
      doc.save(`ordonnance-${result.data.prescriptionId}.pdf`)

      toast.success("PDF généré", {
        description: "L'ordonnance a été téléchargée avec succès.",
      })
    } catch (error) {
      console.error("Error generating prescription PDF:", error)
      toast.error("Erreur", {
        description: "Impossible de générer le PDF de l'ordonnance.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const previewPrescription = async (prescriptionId: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch(`/api/prescriptions/${prescriptionId}/pdf`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Erreur lors de la récupération des données")
      }

      const doc = generatePrescriptionPDF(result.data)
      const pdfBlob = doc.output("blob")
      const pdfUrl = URL.createObjectURL(pdfBlob)
      window.open(pdfUrl, "_blank")
    } catch (error) {
      console.error("Error generating prescription PDF:", error)
      toast.error("Erreur", {
        description: "Impossible de générer l'aperçu de l'ordonnance.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    isGenerating,
    downloadPrescription,
    previewPrescription,
  }
}

export function useInvoicePDF() {
  const [isGenerating, setIsGenerating] = useState(false)

  const downloadInvoice = async (invoiceId: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Erreur lors de la récupération des données")
      }

      const doc = generateInvoicePDF(result.data)
      doc.save(`facture-${result.data.invoiceNumber}.pdf`)

      toast.success("PDF généré", {
        description: "La facture a été téléchargée avec succès.",
      })
    } catch (error) {
      console.error("Error generating invoice PDF:", error)
      toast.error("Erreur", {
        description: "Impossible de générer le PDF de la facture.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const previewInvoice = async (invoiceId: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Erreur lors de la récupération des données")
      }

      const doc = generateInvoicePDF(result.data)
      const pdfBlob = doc.output("blob")
      const pdfUrl = URL.createObjectURL(pdfBlob)
      window.open(pdfUrl, "_blank")
    } catch (error) {
      console.error("Error generating invoice PDF:", error)
      toast.error("Erreur", {
        description: "Impossible de générer l'aperçu de la facture.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const printInvoice = async (invoiceId: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Erreur lors de la récupération des données")
      }

      const doc = generateInvoicePDF(result.data)
      doc.autoPrint()
      const pdfBlob = doc.output("blob")
      const pdfUrl = URL.createObjectURL(pdfBlob)
      const printWindow = window.open(pdfUrl, "_blank")
      if (printWindow) {
        printWindow.focus()
      }
    } catch (error) {
      console.error("Error printing invoice:", error)
      toast.error("Erreur", {
        description: "Impossible d'imprimer la facture.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    isGenerating,
    downloadInvoice,
    previewInvoice,
    printInvoice,
  }
}

