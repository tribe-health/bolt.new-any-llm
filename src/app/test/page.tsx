'use client'

import { useState } from 'react'
import { AIChat } from '@/components/ai-chat'

export default function TestPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Chat Test Page</h1>
      <div className="border rounded-lg shadow-sm">
        <AIChat />
      </div>
    </div>
  )
}
