import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, compact: boolean = false): string {
  if (compact && amount >= 1000000) {
    return `₦${(amount / 1000000).toFixed(1)}M`
  }
  if (compact && amount >= 1000) {
    return `₦${(amount / 1000).toFixed(1)}K`
  }
  return `₦${amount.toLocaleString()}`
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidNigerianPhone(phone: string): boolean {
  const phoneRegex = /^(\+234|0)[789][01]\d{8}$/
  return phoneRegex.test(phone)
}

export function formatNigerianCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0
  return (part / total) * 100
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'pending': 'text-warning-600 bg-warning-50',
    'approved': 'text-success-600 bg-success-50',
    'rejected': 'text-danger-600 bg-danger-50',
    'processing': 'text-primary-600 bg-primary-50',
    'completed': 'text-success-600 bg-success-50',
    'cancelled': 'text-gray-600 bg-gray-50',
    'draft': 'text-gray-600 bg-gray-50',
    'active': 'text-success-600 bg-success-50',
    'inactive': 'text-gray-600 bg-gray-50',
  }
  return statusColors[status.toLowerCase()] || 'text-gray-600 bg-gray-50'
}

export function getPriorityColor(priority: string): string {
  const priorityColors: Record<string, string> = {
    'low': 'text-success-600 bg-success-50',
    'medium': 'text-warning-600 bg-warning-50',
    'high': 'text-danger-600 bg-danger-50',
    'urgent': 'text-red-600 bg-red-50',
  }
  return priorityColors[priority.toLowerCase()] || 'text-gray-600 bg-gray-50'
}
