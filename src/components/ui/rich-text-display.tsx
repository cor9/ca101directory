"use client";

import DOMPurify from "isomorphic-dompurify";
import { cn } from "@/lib/utils";

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

export function RichTextDisplay({ content, className }: RichTextDisplayProps) {
  // Sanitize HTML content to prevent XSS
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'code', 'pre',
      'a'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'style'],
    ALLOW_DATA_ATTR: false
  });

  if (!content || content.trim() === '') {
    return null;
  }

  return (
    <div 
      className={cn(
        "rich-text-content prose prose-sm max-w-none",
        "prose-headings:font-semibold prose-headings:text-gray-900",
        "prose-p:text-gray-700 prose-p:leading-relaxed",
        "prose-strong:text-gray-900 prose-em:text-gray-700",
        "prose-ul:text-gray-700 prose-ol:text-gray-700",
        "prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic",
        "prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
        "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline",
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
