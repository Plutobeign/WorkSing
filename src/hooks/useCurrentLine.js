import { useMemo } from 'react'

// Binary search — finds last line where timeMs <= progressMs
function findCurrentIndex(lines, progressMs) {
  if (!lines || lines.length === 0) return -1

  let lo = 0
  let hi = lines.length - 1
  let result = -1

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    if (lines[mid].timeMs <= progressMs) {
      result = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }

  return result
}

export function useCurrentLine(lines, progressMs) {
  return useMemo(() => {
    const index = findCurrentIndex(lines, progressMs)

    if (index === -1) {
      return {
        prevLine:     null,
        currentLine:  null,
        nextLine:     lines?.[0]?.text || null,
        currentIndex: -1,
      }
    }

    return {
      prevLine:     lines[index - 1]?.text || null,
      currentLine:  lines[index]?.text     || null,
      nextLine:     lines[index + 1]?.text || null,
      currentIndex: index,
    }
  }, [lines, progressMs])
}
