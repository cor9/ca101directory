"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

export default function PlaygroundPage() {
  const [bgColor, setBgColor] = useState("bg-navy");
  const [textColor, setTextColor] = useState("text-paper");
  const [fontSize, setFontSize] = useState("text-base");
  const [padding, setPadding] = useState("p-6");
  const [borderRadius, setBorderRadius] = useState("rounded-lg");
  const [customText, setCustomText] = useState("Hello, Child Actor 101!");

  const bgColors = [
    { name: "Navy", value: "bg-navy" },
    { name: "Cream", value: "bg-surface" },
    { name: "Blue", value: "bg-bauhaus-blue" },
    { name: "Mustard", value: "bg-bauhaus-mustard" },
    { name: "Orange", value: "bg-bauhaus-orange" },
    { name: "White", value: "bg-white" },
  ];

  const textColors = [
    { name: "Paper (Light)", value: "text-paper" },
    { name: "Ink (Dark)", value: "text-[#1E1F23]" },
    { name: "Navy", value: "text-navy" },
    { name: "Blue", value: "text-bauhaus-blue" },
    { name: "Mustard", value: "text-bauhaus-mustard" },
    { name: "Orange", value: "text-bauhaus-orange" },
  ];

  const fontSizes = [
    { name: "Small", value: "text-sm" },
    { name: "Base", value: "text-base" },
    { name: "Large", value: "text-lg" },
    { name: "XL", value: "text-xl" },
    { name: "2XL", value: "text-2xl" },
    { name: "3XL", value: "text-3xl" },
  ];

  const paddings = [
    { name: "None", value: "p-0" },
    { name: "Small", value: "p-2" },
    { name: "Medium", value: "p-4" },
    { name: "Large", value: "p-6" },
    { name: "XL", value: "p-8" },
  ];

  const borderRadii = [
    { name: "None", value: "rounded-none" },
    { name: "Small", value: "rounded" },
    { name: "Medium", value: "rounded-md" },
    { name: "Large", value: "rounded-lg" },
    { name: "XL", value: "rounded-xl" },
    { name: "Full", value: "rounded-full" },
  ];

  return (
    <div className="min-h-screen bg-navy py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-paper mb-4 bauhaus-heading">
            🎨 Component Playground
          </h1>
          <p className="text-paper/80 text-lg">
            Test and visualize your Bauhaus design system components
          </p>
        </div>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-surface">
            <TabsTrigger value="preview">Live Preview</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="colors">Color System</TabsTrigger>
          </TabsList>

          {/* Live Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Controls */}
              <div className="bg-surface rounded-lg p-6 shadow-lg space-y-4">
                <h2 className="text-xl font-bold text-[#1E1F23] mb-4">
                  Controls
                </h2>

                <div className="space-y-3">
                  <div>
                    <Label className="text-[#1E1F23]">Custom Text</Label>
                    <Input
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-[#1E1F23]">Background Color</Label>
                    <Select value={bgColor} onValueChange={setBgColor}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {bgColors.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            {color.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-[#1E1F23]">Text Color</Label>
                    <Select value={textColor} onValueChange={setTextColor}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {textColors.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            {color.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-[#1E1F23]">Font Size</Label>
                    <Select value={fontSize} onValueChange={setFontSize}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontSizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-[#1E1F23]">Padding</Label>
                    <Select value={padding} onValueChange={setPadding}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paddings.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-[#1E1F23]">Border Radius</Label>
                    <Select
                      value={borderRadius}
                      onValueChange={setBorderRadius}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {borderRadii.map((radius) => (
                          <SelectItem key={radius.value} value={radius.value}>
                            {radius.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1E1F23]/20">
                  <h3 className="font-bold text-[#1E1F23] mb-2">
                    Generated Classes:
                  </h3>
                  <code className="block bg-white p-3 rounded text-xs text-[#1E1F23] break-all">
                    {`${bgColor} ${textColor} ${fontSize} ${padding} ${borderRadius}`}
                  </code>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <h2 className="text-xl font-bold text-[#1E1F23] mb-4">
                    Live Preview
                  </h2>
                  <div
                    className={`${bgColor} ${textColor} ${fontSize} ${padding} ${borderRadius} shadow-lg transition-all duration-200`}
                  >
                    {customText}
                  </div>
                </div>

                <div className="bg-surface rounded-lg p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-[#1E1F23] mb-4">
                    Quick Examples
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-bauhaus-blue text-[#1E1F23] p-4 rounded-lg">
                      Blue Card with Dark Text
                    </div>
                    <div className="bg-bauhaus-mustard text-[#1E1F23] p-4 rounded-lg">
                      Mustard Card with Dark Text
                    </div>
                    <div className="bg-bauhaus-orange text-[#FFFDD0] p-4 rounded-lg">
                      Orange Card with Cream Text
                    </div>
                    <div className="bg-navy text-paper p-4 rounded-lg">
                      Navy Card with Light Text
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Buttons */}
              <div className="bg-surface rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-bold text-[#1E1F23] mb-4">
                  Buttons
                </h3>
                <div className="space-y-3">
                  <Button className="w-full">Primary Button</Button>
                  <Button variant="secondary" className="w-full">
                    Secondary Button
                  </Button>
                  <Button variant="outline" className="w-full">
                    Outline Button
                  </Button>
                  <Button variant="ghost" className="w-full">
                    Ghost Button
                  </Button>
                  <Button
                    className="w-full bg-bauhaus-orange text-[#FFFDD0]"
                  >
                    Custom Orange
                  </Button>
                </div>
              </div>

              {/* Badges */}
              <div className="bg-bauhaus-blue rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-bold text-[#1E1F23] mb-4">
                  Badges
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-bauhaus-mustard text-[#1E1F23]">
                      Mustard
                    </Badge>
                    <Badge className="bg-bauhaus-orange text-[#FFFDD0]">
                      Orange
                    </Badge>
                    <Badge className="bg-navy text-paper">Navy</Badge>
                  </div>
                </div>
              </div>

              {/* Icons */}
              <div className="bg-bauhaus-mustard rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-bold text-[#1E1F23] mb-4">Icons</h3>
                <div className="grid grid-cols-4 gap-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                  <Info className="w-8 h-8 text-blue-600" />
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>

              {/* Cards */}
              <div className="bg-bauhaus-orange rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-bold text-[#FFFDD0] mb-4">
                  Card Example
                </h3>
                <p className="text-[#FFFDD0]/90">
                  This is a card with orange background and cream text for
                  proper contrast.
                </p>
              </div>

              {/* Forms */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-bold text-[#1E1F23] mb-4">
                  Form Elements
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label>Email</Label>
                    <Input type="email" placeholder="Enter email" />
                  </div>
                  <div>
                    <Label>Select Option</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Option 1</SelectItem>
                        <SelectItem value="2">Option 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="bg-surface rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-bold text-[#1E1F23] mb-4">
                  Typography
                </h3>
                <div className="space-y-2 text-[#1E1F23]">
                  <h1 className="text-3xl font-bold">Heading 1</h1>
                  <h2 className="text-2xl font-bold">Heading 2</h2>
                  <h3 className="text-xl font-bold">Heading 3</h3>
                  <p className="text-base">Body text paragraph</p>
                  <p className="text-sm">Small text</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-6">
            <div className="bg-surface rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-[#1E1F23] mb-6">
                Bauhaus Color System
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Primary Colors */}
                <div className="space-y-2">
                  <h3 className="font-bold text-[#1E1F23]">Primary Colors</h3>
                  <div className="bg-navy h-24 rounded-lg flex items-center justify-center text-paper font-bold shadow-lg">
                    Navy
                  </div>
                  <div className="bg-surface h-24 rounded-lg flex items-center justify-center text-[#1E1F23] font-bold shadow-lg border-2 border-[#1E1F23]/10">
                    Cream/Surface
                  </div>
                </div>

                {/* Accent Colors */}
                <div className="space-y-2">
                  <h3 className="font-bold text-[#1E1F23]">Accent Colors</h3>
                  <div className="bg-bauhaus-blue h-24 rounded-lg flex items-center justify-center text-[#0C1A2B] font-bold shadow-lg">
                    Blue
                  </div>
                  <div className="bg-bauhaus-mustard h-24 rounded-lg flex items-center justify-center text-[#1E1F23] font-bold shadow-lg">
                    Mustard
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-[#1E1F23]">Accent Colors</h3>
                  <div className="bg-bauhaus-orange h-24 rounded-lg flex items-center justify-center text-[#FFFDD0] font-bold shadow-lg">
                    Orange
                  </div>
                  <div className="bg-bauhaus-red h-24 rounded-lg flex items-center justify-center text-paper font-bold shadow-lg">
                    Red
                  </div>
                </div>

                {/* Text Colors */}
                <div className="space-y-2">
                  <h3 className="font-bold text-[#1E1F23]">Text Colors</h3>
                  <div className="bg-navy h-24 rounded-lg flex items-center justify-center">
                    <span className="text-paper font-bold">
                      Paper (Light)
                    </span>
                  </div>
                  <div className="bg-surface h-24 rounded-lg flex items-center justify-center border-2 border-[#1E1F23]/10">
                    <span className="text-[#1E1F23] font-bold">Ink (Dark)</span>
                  </div>
                </div>

                {/* Contrast Rules */}
                <div className="col-span-full bg-white rounded-lg p-6 border-2 border-[#1E1F23]/10">
                  <h3 className="text-xl font-bold text-[#1E1F23] mb-4">
                    Contrast Rules
                  </h3>
                  <div className="space-y-2 text-[#1E1F23]">
                    <p>
                      ✅ <strong>Navy Background</strong> → Light Text
                      (text-paper)
                    </p>
                    <p>
                      ✅ <strong>Any Colored Box/Card</strong> → Dark Text
                      (text-[#1E1F23])
                    </p>
                    <p>
                      ✅ <strong>Orange Background</strong> → Cream Text
                      (text-[#FFFDD0])
                    </p>
                    <p>
                      ✅ <strong>Blue Background</strong> → Navy Text
                      (text-[#0C1A2B])
                    </p>
                    <p className="pt-4 text-red-600">
                      ❌ <strong>Never</strong> use dark text on navy
                      backgrounds
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

