"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
            toastOptions={{
        style: {
          background: "var(--popover)",
          color: "var(--popover-foreground)",
          border: "1px solid var(--border)",
       },
        classNames: {
          success: "success-toast",
          error: "error-toast",
          warning: "warning-toast",
          info: "info-toast",
        },
       }
    }
     
      {...props}
    />
  )
}

export { Toaster }
