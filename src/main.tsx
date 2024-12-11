import React from 'react'
import ReactDOM from 'react-dom/client'
import { AIChat } from '@/components/ai-chat'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Chat</h1>
      <div className="border rounded-lg shadow-sm">
        <AIChat />
      </div>
    </div>
  </React.StrictMode>
)
