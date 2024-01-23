import { useDark } from "~/hooks/use-dark"
import { cn } from "~/lib/utils"

export function AppearanceSwitch({ className }: { className?: string }) {
  const { toggleDark } = useDark()

  return (
    <button onClick={toggleDark} className={cn("flex", className)}>
      <div className="i-lucide-sun scale-100 dark:scale-0 transition-transform duration-500 rotate-0 dark:-rotate-90" />
      <div className="i-lucide-moon absolute scale-0 dark:scale-100 transition-transform duration-500 rotate-90 dark:rotate-0" />
      <div className="sr-only">Toggle dark mode</div>
    </button>
  )
}
