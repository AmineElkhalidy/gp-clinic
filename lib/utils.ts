import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date to French locale
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('fr-FR', options || {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Format date with time
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Format time only
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Format currency in Moroccan Dirham
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2
  }).format(amount)
}

// Format phone number for Morocco
export function formatPhone(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '')
  
  // Format as Moroccan phone number
  if (digits.length === 10) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`
  }
  
  return phone
}

// Calculate age from date of birth
export function calculateAge(dateOfBirth: Date | string): number {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }
  
  return age
}

// Generate invoice number
export function generateInvoiceNumber(prefix: string, count: number): string {
  const year = new Date().getFullYear()
  const paddedCount = String(count).padStart(5, '0')
  return `${prefix}-${year}-${paddedCount}`
}

// Get initials from name
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

// Debounce function for search inputs
export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => func(...args), wait)
  }
}

// French translations for enums
export const genderLabels: Record<string, string> = {
  MALE: 'Homme',
  FEMALE: 'Femme'
}

export const maritalStatusLabels: Record<string, string> = {
  SINGLE: 'Célibataire',
  MARRIED: 'Marié(e)',
  DIVORCED: 'Divorcé(e)',
  WIDOWED: 'Veuf/Veuve'
}

export const appointmentStatusLabels: Record<string, string> = {
  SCHEDULED: 'Programmé',
  CONFIRMED: 'Confirmé',
  IN_PROGRESS: 'En cours',
  COMPLETED: 'Terminé',
  CANCELLED: 'Annulé',
  NO_SHOW: 'Absent'
}

export const paymentStatusLabels: Record<string, string> = {
  PENDING: 'En attente',
  PARTIAL: 'Partiel',
  PAID: 'Payé',
  CANCELLED: 'Annulé'
}

export const paymentMethodLabels: Record<string, string> = {
  CASH: 'Espèces',
  CARD: 'Carte bancaire',
  BANK_TRANSFER: 'Virement',
  CHECK: 'Chèque',
  OTHER: 'Autre'
}

export const expenseCategoryLabels: Record<string, string> = {
  RENT: 'Loyer',
  UTILITIES: 'Services publics',
  SUPPLIES: 'Fournitures',
  MEDICATIONS: 'Médicaments',
  EQUIPMENT: 'Équipement',
  SALARY: 'Salaires',
  MAINTENANCE: 'Maintenance',
  INSURANCE: 'Assurance',
  TAXES: 'Impôts',
  OTHER: 'Autre'
}

export const userRoleLabels: Record<string, string> = {
  DOCTOR: 'Médecin',
  ASSISTANT: 'Assistant(e)'
}

