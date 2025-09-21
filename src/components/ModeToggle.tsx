import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

const THEME_KEY = "theme"

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "theme-light"
}

export function ModeToggle() {
  const [theme, setThemeState] = React.useState<"theme-light" | "dark">("theme-light")

  // Initialize from localStorage or system
  React.useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === "dark" || stored === "theme-light") {
      setThemeState(stored)
    } else {
      setThemeState(getSystemTheme())
    }
  }, [])

  // Apply theme and persist
  React.useEffect(() => {
    document.documentElement.classList[theme === "dark" ? "add" : "remove"]("dark")
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  // Toggle theme handler
  const toggleTheme = () => {
    setThemeState(prev => (prev === "dark" ? "theme-light" : "dark"))
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${theme === "dark" ? "scale-0 -rotate-90" : "scale-100 rotate-0"}`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${theme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-90"}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}