type ScrollToAnchorOptions = {
  behavior?: ScrollBehavior
  updateHash?: boolean
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

export function getAnchorScrollTop(element: HTMLElement) {
  const sectionTop = element.getBoundingClientRect().top + window.scrollY
  const rawProgress = element.dataset.anchorProgress
  const anchorProgress = rawProgress ? Number(rawProgress) : 0

  if (!(Number.isFinite(anchorProgress) && anchorProgress > 0)) {
    return sectionTop
  }

  const scrollableDistance = Math.max(
    0,
    element.offsetHeight - window.innerHeight
  )
  return sectionTop + scrollableDistance * clamp01(anchorProgress)
}

export function scrollToAnchorId(
  id: string,
  { behavior = 'auto', updateHash = false }: ScrollToAnchorOptions = {}
) {
  const element = document.getElementById(id)

  if (!element) {
    return false
  }

  if (updateHash && window.location.hash !== `#${id}`) {
    window.history.pushState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#${id}`
    )
  }

  window.scrollTo({
    top: getAnchorScrollTop(element),
    behavior,
  })

  return true
}
