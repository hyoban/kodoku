/* eslint-disable @eslint-react/dom/no-dangerously-set-innerhtml */
"use client"

import { createStore, Provider as JotaiProvider } from "jotai"

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        id="change-theme"
        dangerouslySetInnerHTML={{
          __html: `!(function () {
              var e =
                  window.matchMedia &&
                  window.matchMedia("(prefers-color-scheme: dark)").matches,
                t = localStorage.getItem("use-dark") || '"system"';
              ('"dark"' === t || (e && '"light"' !== t)) &&
                document.documentElement.classList.toggle("dark", !0);
            })();`,
        }}
      ></script>
      {children}
    </>
  )
}

const store = createStore()

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider>
      <JotaiProvider store={store}>{children}</JotaiProvider>
    </ThemeProvider>
  )
}
