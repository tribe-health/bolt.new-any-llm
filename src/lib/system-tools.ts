import { type Tool } from '@/types/ai'

interface DateFormatParams {
  date: string
  format?: 'short' | 'medium' | 'long' | 'full'
}

interface MathParams {
  expression: string
}

interface EmailParams {
  email: string
}

const systemTools: Tool[] = [
  {
    name: 'getCurrentTime',
    description: 'Get the current time in ISO format',
    parameters: {},
    execute: async () => {
      return {
        time: new Date().toISOString()
      }
    }
  },
  {
    name: 'formatDate',
    description: 'Format a date string using Intl.DateTimeFormat',
    parameters: {
      date: {
        type: 'string',
        description: 'The date string to format'
      },
      format: {
        type: 'string',
        enum: ['short', 'medium', 'long', 'full'],
        description: 'The format to use'
      }
    },
    execute: async (params: unknown) => {
      const { date, format = 'long' } = params as DateFormatParams
      const dateObj = new Date(date)
      const options: Intl.DateTimeFormatOptions = {
        dateStyle: format
      }
      return {
        formatted: new Intl.DateTimeFormat('en-US', options).format(dateObj)
      }
    }
  },
  {
    name: 'calculateMath',
    description: 'Safely evaluate a mathematical expression',
    parameters: {
      expression: {
        type: 'string',
        description: 'The mathematical expression to evaluate'
      }
    },
    execute: async (params: unknown) => {
      const { expression } = params as MathParams
      // Simple and safe math evaluation
      const sanitized = expression.replace(/[^0-9+\-*/.()\s]/g, '')
      try {
        // eslint-disable-next-line no-eval
        const result = eval(`(${sanitized})`)
        return { result }
      } catch (error) {
        throw new Error('Invalid mathematical expression')
      }
    }
  },
  {
    name: 'generateUUID',
    description: 'Generate a UUID v4',
    parameters: {},
    execute: async () => {
      const uuid = crypto.randomUUID()
      return { uuid }
    }
  },
  {
    name: 'validateEmail',
    description: 'Validate an email address',
    parameters: {
      email: {
        type: 'string',
        description: 'The email address to validate'
      }
    },
    execute: async (params: unknown) => {
      const { email } = params as EmailParams
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return {
        isValid: emailRegex.test(email),
        email
      }
    }
  }
]

// Helper to register all system tools
export function registerSystemTools(toolRegistry: (tool: Tool) => void): void {
  systemTools.forEach(tool => toolRegistry(tool))
}
