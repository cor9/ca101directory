"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy, Download } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const yourListingUrl = "https://directory.childactor101.com/your-listing-slug";
const badgeImageUrl = "https://directory.childactor101.com/badge.png"; // Placeholder

const htmlSnippet = `<a href="${yourListingUrl}" target="_blank" rel="noopener noreferrer">
  <img src="${badgeImageUrl}" alt="Find us on Child Actor 101 Directory" style="width: 200px; height: auto;" />
</a>`;

const socialCaption = `Find us on the Child Actor 101 Directory! We're proud to be a trusted resource for families in the entertainment industry. Visit our profile here: ${yourListingUrl}`;

const pressBlurb = `We are proud to be a featured vendor on the Child Actor 101 Directory, a curated platform of vetted coaches, photographers, and industry professionals specializing in youth acting. This recognition highlights our commitment to providing safe, high-quality services for young performers and their families.`;


export const BacklinkResourceKitClient = () => {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(id);
            toast.success("Copied to clipboard!");
            setTimeout(() => setCopied(null), 2000);
        }, (err) => {
            toast.error("Failed to copy.");
            console.error("Could not copy text: ", err);
        });
    };

    const handleDownload = () => {
        toast.info("Badge download is coming soon!");
        // In a real app, you would trigger a file download here.
        // For example:
        // const link = document.createElement('a');
        // link.href = badgeImageUrl;
        // link.download = 'child-actor-101-badge.png';
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
    }
    
  return (
    <div className="space-y-8">
      {/* 1. Badge Download */}
      <div className="bg-card rounded-lg p-6 border">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Directory Badge
        </h2>
        <p className="text-gray-900 mb-6">
          Add this badge to your website's homepage or footer to show families you're a trusted part of the Child Actor 101 community.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md w-48 h-48 flex items-center justify-center flex-shrink-0">
                {/* Placeholder for actual badge SVG/image */}
                <div className="text-center">
                    <div className="font-bold text-blue-900 text-lg">CHILD ACTOR 101</div>
                    <div className="text-sm text-orange-500 font-semibold tracking-wider">APPROVED</div>
                    <div className="text-xs text-gray-900 mt-2">Find us on the Directory</div>
                </div>
            </div>
            <div className="w-full">
                <Button onClick={handleDownload} className="w-full sm:w-auto">
                    <Download className="mr-2" size={16} />
                    Download Badge (.png)
                </Button>
                <p className="text-xs text-gray-900 mt-2">A high-resolution transparent PNG will be provided.</p>
            </div>
        </div>
      </div>

      {/* 2. HTML Snippet */}
      <div className="bg-card rounded-lg p-6 border">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          HTML Snippet
        </h2>
         <p className="text-gray-900 mb-4">
            Copy and paste this code into your website where you want the badge to appear.
        </p>
        <div className="relative">
            <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                <code>
                    {htmlSnippet}
                </code>
            </pre>
            <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(htmlSnippet, 'html')}
            >
                {copied === 'html' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                <span className="ml-2">{copied === 'html' ? 'Copied' : 'Copy'}</span>
            </Button>
        </div>
      </div>

      {/* 3. Social Media Caption */}
      <div className="bg-card rounded-lg p-6 border">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Social Media Bio (Linktree/Instagram)
        </h2>
         <p className="text-gray-900 mb-4">
            A simple one-liner to add to your social media profiles.
        </p>
        <div className="relative">
            <div className="bg-muted p-4 rounded-md text-sm text-gray-900">
              {socialCaption}
            </div>
            <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(socialCaption, 'social')}
            >
                 {copied === 'social' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                <span className="ml-2">{copied === 'social' ? 'Copied' : 'Copy'}</span>
            </Button>
        </div>
      </div>

       {/* 4. Press Blurb */}
      <div className="bg-card rounded-lg p-6 border">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Website "About Us" or "Press" Blurb
        </h2>
         <p className="text-gray-900 mb-4">
            Use this pre-written text on your website to announce your inclusion in the directory.
        </p>
        <div className="relative">
            <div className="bg-muted p-4 rounded-md text-sm text-gray-900 leading-relaxed">
              {pressBlurb}
            </div>
             <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(pressBlurb, 'press')}
            >
                {copied === 'press' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                <span className="ml-2">{copied === 'press' ? 'Copied' : 'Copy'}</span>
            </Button>
        </div>
      </div>

    </div>
  );
};
