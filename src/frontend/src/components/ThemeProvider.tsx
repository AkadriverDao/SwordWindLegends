import type React from "react";
import { useEffect } from "react";
import {
  ACCENT_COLORS,
  FONT_STYLES,
  THEME_COLORS,
} from "../types/customization";
import { useCustomizationContext } from "./CustomizationProvider";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { customization } = useCustomizationContext();

  useEffect(() => {
    // Apply theme colors
    const themeColor = THEME_COLORS.find(
      (t) => t.value === customization.themeColor,
    );
    if (themeColor) {
      document.documentElement.style.setProperty(
        "--theme-primary",
        themeColor.primary,
      );
      document.documentElement.style.setProperty(
        "--theme-secondary",
        themeColor.secondary,
      );
    }

    // Apply font style
    const fontStyle = FONT_STYLES.find(
      (f) => f.value === customization.fontStyle,
    );
    if (fontStyle) {
      document.documentElement.style.setProperty(
        "--theme-font-family",
        fontStyle.fontFamily,
      );
    }

    // Apply accent color
    const accentColor = ACCENT_COLORS.find(
      (a) => a.value === customization.accentColor,
    );
    if (accentColor) {
      document.documentElement.style.setProperty(
        "--theme-accent",
        accentColor.color,
      );
    }

    // Apply text size
    const textSizeMap = {
      small: "14px",
      medium: "16px",
      large: "18px",
    };
    document.documentElement.style.setProperty(
      "--theme-text-size",
      textSizeMap[customization.textSize as keyof typeof textSizeMap] || "16px",
    );

    // Apply border radius
    const borderRadiusMap = {
      none: "0px",
      small: "0.375rem",
      rounded: "0.75rem",
      large: "1.5rem",
    };
    document.documentElement.style.setProperty(
      "--theme-border-radius",
      borderRadiusMap[
        customization.borderRadius as keyof typeof borderRadiusMap
      ] || "0.75rem",
    );

    // Apply background style
    const backgroundClass = `bg-${customization.backgroundStyle}`;
    document.body.className = document.body.className.replace(/bg-\w+/g, "");
    document.body.classList.add(backgroundClass);
  }, [customization]);

  return <>{children}</>;
}
