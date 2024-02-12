import { useAtomValue, useSetAtom } from 'jotai'
import { atomDark } from 'jotai-dark'

const isDarkAtom = atomDark({
  disableTransition: true,
  disableTransitionExclude: ['.i-lucide-sun', '.i-lucide-moon'],
})

export function useDark() {
  const isDark = useAtomValue(isDarkAtom)
  const theme = (isDark ? 'dark' : 'light') as 'light' | 'dark'
  const toggleDark = useSetAtom(isDarkAtom) as () => void
  return { isDark, theme, toggleDark }
}
