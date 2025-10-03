"use client";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  variant?: "default" | "hero" | "minimal";
}

export function Logo({ 
  className, 
  size = "md", 
  showText = true, 
  variant = "default" 
}: LogoProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const logoLight = siteConfig.logo;
  const logoDark = siteConfig.logoDark ?? logoLight;

  // During server-side rendering and initial client render, always use logoLight
  // This prevents hydration mismatch
  const logo = mounted && theme === "dark" ? logoDark : logoLight;

  // Only show theme-dependent UI after hydration to prevent mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClasses = {
    sm: "h-6 w-auto",
    md: "h-8 w-auto", 
    lg: "h-12 w-auto",
    xl: "h-16 w-auto"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl", 
    xl: "text-2xl"
  };

  if (variant === "minimal") {
    return (
      <img
        src={logo}
        alt="Child Actor 101 Directory"
        title="Child Actor 101 Directory"
        className={cn(sizeClasses[size], "rounded-md", className)}
      />
    );
  }

  if (variant === "hero") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="relative">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-tomato-red/20 via-retro-blue/20 to-mustard-gold/20 rounded-lg blur-sm scale-110" />
          <img
            src={logo}
            alt="Child Actor 101 Directory"
            title="Child Actor 101 Directory"
            className={cn(sizeClasses[size], "relative rounded-lg drop-shadow-lg", className)}
          />
        </div>
        {showText && (
          <span className={cn("font-bold text-gradient_blue-orange", textSizeClasses[size])}>
            {siteConfig.name}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src={logo}
        alt="Child Actor 101 Directory"
        title="Child Actor 101 Directory"
        className={cn(sizeClasses[size], "rounded-md", className)}
      />
      {showText && (
        <span className={cn("font-bold", textSizeClasses[size])}>
          {siteConfig.name}
        </span>
      )}
    </div>
  );
}
