"use client"

import { useState } from "react"
import { Monitor, Tablet, Smartphone } from "lucide-react"

interface Block {
  id: string
  type: "text" | "image" | "button" | "divider"
  content?: string
  src?: string
  alt?: string
  href?: string
  text?: string
}

interface EmailPreviewProps {
  content: { blocks: Block[] }
}

type ViewportSize = "desktop" | "tablet" | "mobile"

export function EmailPreview({ content }: EmailPreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>("desktop")
  const blocks = content.blocks || []

  const getViewportStyles = () => {
    switch (viewport) {
      case "desktop":
        return "w-full max-w-4xl"
      case "tablet":
        return "w-full max-w-2xl"
      case "mobile":
        return "w-full max-w-sm"
      default:
        return "w-full max-w-4xl"
    }
  }

  const getContentPadding = () => {
    switch (viewport) {
      case "desktop":
        return "p-8"
      case "tablet":
        return "p-6"
      case "mobile":
        return "p-4"
      default:
        return "p-8"
    }
  }

  const getContentMaxWidth = () => {
    switch (viewport) {
      case "desktop":
        return "max-w-md"
      case "tablet":
        return "max-w-sm"
      case "mobile":
        return "max-w-full"
      default:
        return "max-w-md"
    }
  }

  const renderBlock = (block: Block) => {
    const mobileTextSize = viewport === "mobile" ? "text-sm" : "text-base"
    const mobilePadding = viewport === "mobile" ? "p-6" : "p-8"
    const mobileButtonSize = viewport === "mobile" ? "px-6 py-2 text-sm" : "px-8 py-3"

    switch (block.type) {
      case "text":
        return (
          <div key={block.id} className="mb-4">
            <div
              className={`text-gray-800 leading-relaxed ${mobileTextSize}`}
              dangerouslySetInnerHTML={{ __html: block.content || "" }}
            />
          </div>
        )

      case "image":
        return (
          <div key={block.id} className="mb-6">
            <div
              className={`bg-gradient-to-br from-orange-300 to-orange-400 rounded-xl ${mobilePadding} flex items-center justify-center`}
            >
              <img
                src={block.src || "/placeholder.svg?height=120&width=120"}
                alt={block.alt || "Image"}
                className={`max-w-full h-auto object-contain ${viewport === "mobile" ? "max-h-24" : "max-h-32"}`}
              />
            </div>
          </div>
        )

      case "button":
        return (
          <div key={block.id} className="mb-6">
            <a
              href={block.href || "#"}
              className={`inline-block bg-green-500 hover:bg-green-600 text-white ${mobileButtonSize} rounded-full font-medium transition-colors duration-200 shadow-sm hover:shadow-md`}
            >
              {block.text || "Click me"}
            </a>
          </div>
        )

      case "divider":
        return (
          <div key={block.id} className="mb-6">
            <div className="h-px bg-gray-200"></div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-full bg-gradient-to-br from-green-100 to-green-200 p-6 flex flex-col">
      {/* Viewport Controls */}
      <div className="mb-4 flex justify-center">
        <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200">
          <div className="flex space-x-1">
            <button
              onClick={() => setViewport("desktop")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                viewport === "desktop"
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setViewport("tablet")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                viewport === "tablet"
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Tablet className="w-4 h-4" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setViewport("mobile")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                viewport === "mobile"
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Viewport Size Indicator */}
      <div className="mb-4 text-center">
        <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-gray-600">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>
            {viewport === "desktop" && "1200px+ Desktop View"}
            {viewport === "tablet" && "768px Tablet View"}
            {viewport === "mobile" && "375px Mobile View"}
          </span>
        </div>
      </div>

      {/* Browser Window */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className={`${getViewportStyles()} bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out`}
        >
          {/* Browser Header */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              {/* Traffic Light Buttons */}
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>

              {/* URL Bar */}
              <div className="flex-1 ml-4">
                <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-500 border border-gray-200 truncate">
                  {viewport === "mobile" ? "preview.mailcraft.com" : "preview.mailcraft.com/template"}
                </div>
              </div>

              {/* Responsive Indicator */}
              <div className="hidden sm:flex items-center space-x-1 text-xs text-gray-400">
                {viewport === "desktop" && <Monitor className="w-3 h-3" />}
                {viewport === "tablet" && <Tablet className="w-3 h-3" />}
                {viewport === "mobile" && <Smartphone className="w-3 h-3" />}
              </div>
            </div>
          </div>

          {/* Email Content */}
          <div className="bg-white min-h-[400px] transition-all duration-300">
            {blocks.length === 0 ? (
              <div className={`${getContentPadding()} text-center`}>
                <div className="mb-6">
                  <div
                    className={`${viewport === "mobile" ? "w-12 h-12" : "w-16 h-16"} bg-gray-100 rounded-xl mx-auto flex items-center justify-center mb-4`}
                  >
                    <svg
                      className={`${viewport === "mobile" ? "w-6 h-6" : "w-8 h-8"} text-gray-400`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className={`${viewport === "mobile" ? "text-base" : "text-lg"} font-medium text-gray-900 mb-2`}>
                    Email Preview
                  </h3>
                  <p className={`text-gray-500 ${viewport === "mobile" ? "text-sm" : "text-base"}`}>
                    Your email template will appear here
                  </p>
                </div>

                {/* Placeholder Content */}
                <div className={`space-y-4 ${getContentMaxWidth()} mx-auto`}>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  <div
                    className={`${viewport === "mobile" ? "h-6" : "h-8"} bg-green-200 rounded-full animate-pulse ${viewport === "mobile" ? "w-24" : "w-32"} mx-auto mt-6`}
                  ></div>
                </div>
              </div>
            ) : (
              <div className={getContentPadding()}>
                <div className={`${getContentMaxWidth()} mx-auto`}>{blocks.map(renderBlock)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
