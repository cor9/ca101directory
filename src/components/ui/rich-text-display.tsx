"use client";

import DOMPurify from "isomorphic-dompurify";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

export function RichTextDisplay({ content, className }: RichTextDisplayProps) {
  const [sanitizedContent, setSanitizedContent] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Sanitize HTML content to prevent XSS
    const sanitized = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'blockquote', 'code', 'pre',
        'a', 'span'
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'style', 'class'],
      ALLOW_DATA_ATTR: false
    });
    setSanitizedContent(sanitized);
  }, [content]);

  if (!content || content.trim() === '') {
    return null;
  }

  // During SSR or before client hydration, show plain text version
  if (!isClient || !sanitizedContent) {
    const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return (
      <div className={cn("rich-text-content", className)}>
        {plainText}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "rich-text-content prose prose-sm max-w-none",
        "prose-headings:font-semibold prose-headings:text-gray-900",
        "prose-p:text-gray-900 prose-p:leading-relaxed",
        "prose-strong:text-gray-900 prose-em:text-gray-900",
        "prose-ul:text-gray-900 prose-ol:text-gray-900",
        "prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic",
        "prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
        "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline",
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
