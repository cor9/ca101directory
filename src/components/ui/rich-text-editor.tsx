"use client";

import { forwardRef, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { 
  ssr: false,
  loading: () => <div className="h-32 bg-gray-50 rounded border animate-pulse" />
});

import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minHeight?: string;
}

const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  ({ value, onChange, placeholder, className, disabled, minHeight = "120px" }, ref) => {
    const quillRef = useRef<any>(null);

    // Quill toolbar configuration
    const modules = {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['blockquote', 'code-block'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link'],
        ['clean']
      ]
    };

    const formats = [
      'header', 'bold', 'italic', 'underline', 'strike',
      'list', 'bullet', 'blockquote', 'code-block',
      'color', 'background', 'align', 'link'
    ];

    // Custom styles to match your design system
    useEffect(() => {
      const style = document.createElement('style');
      style.textContent = `
        .ql-editor {
          min-height: ${minHeight};
          font-family: inherit;
          font-size: 14px;
          line-height: 1.5;
        }
        .ql-editor.ql-blank::before {
          font-style: normal;
          opacity: 0.6;
        }
        .ql-toolbar {
          border-top: 1px solid #e2e8f0;
          border-left: 1px solid #e2e8f0;
          border-right: 1px solid #e2e8f0;
          border-bottom: none;
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
        }
        .ql-container {
          border-bottom: 1px solid #e2e8f0;
          border-left: 1px solid #e2e8f0;
          border-right: 1px solid #e2e8f0;
          border-top: none;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }
        .ql-editor:focus {
          outline: none;
        }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }, [minHeight]);

    return (
      <div ref={ref} className={cn("rich-text-editor", className)}>
        <ReactQuill
          value={value || ''}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          readOnly={disabled}
          theme="snow"
        />
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export { RichTextEditor };
