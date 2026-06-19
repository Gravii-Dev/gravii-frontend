'use client'

import { useEffect, useRef, useState } from 'react'
import s from './cursor-trail.module.css'

type CursorVariant = 'default' | 'pill' | 'checked' | 'hidden'

type CursorVisualState = {
  isActive: boolean
  isPressed: boolean
  isVisible: boolean
  label: string
  variant: CursorVariant
}

type CursorHit = {
  state: CursorVisualState
  surface: HTMLElement | null
  target: HTMLElement | null
}

type SurfaceRect = {
  height: number
  left: number
  top: number
  width: number
}

const CURSOR_TARGET_SELECTOR =
  '[data-cursor-target], [data-cursor-label], [data-cursor-shape]'
const IMPLICIT_CURSOR_TARGET_SELECTOR =
  "button:not(:disabled), a[href], [role='button']"
const NATIVE_CURSOR_SELECTOR =
  "input, textarea, select, [contenteditable='true'], [contenteditable=''], [data-cursor-native='true']"

const DEFAULT_VISUAL_STATE: CursorVisualState = {
  isActive: false,
  isPressed: false,
  isVisible: false,
  label: '',
  variant: 'default',
}

function joinClasses(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(' ')
}

function normalizeCursorVariant(value: string | undefined): CursorVariant {
  if (value === 'pill' || value === 'checked' || value === 'hidden') {
    return value
  }

  if (value === 'chip') {
    return 'pill'
  }

  return 'default'
}

function statesMatch(left: CursorVisualState, right: CursorVisualState) {
  return (
    left.isActive === right.isActive &&
    left.isPressed === right.isPressed &&
    left.isVisible === right.isVisible &&
    left.label === right.label &&
    left.variant === right.variant
  )
}

function shouldUseNativeCursor(target: Element | null) {
  return Boolean(target?.closest(NATIVE_CURSOR_SELECTOR))
}

function isDisabledTarget(target: HTMLElement) {
  return (
    target.matches(':disabled') ||
    target.getAttribute('aria-disabled') === 'true'
  )
}

function resolveCursorSurface(target: HTMLElement | null) {
  if (!target) {
    return null
  }

  if (target.dataset.cursorSurface === 'parent') {
    return target.parentElement
  }

  if (target.dataset.cursorSurface === 'child') {
    return target.firstElementChild instanceof HTMLElement
      ? target.firstElementChild
      : target
  }

  return target
}

function measureSurface(surface: HTMLElement): SurfaceRect | null {
  const rect = surface.getBoundingClientRect()

  if (rect.width === 0 || rect.height === 0) {
    return null
  }

  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width,
  }
}

function syncSurfaceFill(
  surface: HTMLElement,
  rect: SurfaceRect,
  clientX: number,
  clientY: number
) {
  const x = Math.min(Math.max(clientX - rect.left, 0), rect.width)
  const y = Math.min(Math.max(clientY - rect.top, 0), rect.height)
  const radius =
    Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y)) + 4

  surface.style.setProperty('--gravii-cursor-fill-x', `${x}px`)
  surface.style.setProperty('--gravii-cursor-fill-y', `${y}px`)
  surface.style.setProperty('--gravii-cursor-fill-radius', `${radius}px`)
}

function primeSurfaceFill(
  surface: HTMLElement,
  rect: SurfaceRect,
  clientX: number,
  clientY: number
) {
  const x = Math.min(Math.max(clientX - rect.left, 0), rect.width)
  const y = Math.min(Math.max(clientY - rect.top, 0), rect.height)

  surface.style.setProperty('--gravii-cursor-fill-x', `${x}px`)
  surface.style.setProperty('--gravii-cursor-fill-y', `${y}px`)
  surface.style.setProperty('--gravii-cursor-fill-radius', '0px')
}

function clearSurfaceFill(surface: HTMLElement | null) {
  if (!surface) {
    return
  }

  surface.classList.remove('expressive-cursor-surface-hovered')
  surface.style.removeProperty('--gravii-cursor-fill-x')
  surface.style.removeProperty('--gravii-cursor-fill-y')
  surface.style.removeProperty('--gravii-cursor-fill-radius')
}

function readCursorHit(
  eventTarget: EventTarget | null,
  isPressed: boolean
): CursorHit {
  if (!(eventTarget instanceof Element)) {
    return {
      state: DEFAULT_VISUAL_STATE,
      surface: null,
      target: null,
    }
  }

  if (shouldUseNativeCursor(eventTarget)) {
    return {
      state: {
        ...DEFAULT_VISUAL_STATE,
        variant: 'hidden',
      },
      surface: null,
      target: null,
    }
  }

  const cursorTarget =
    eventTarget.closest<HTMLElement>(CURSOR_TARGET_SELECTOR)
  const implicitTarget = eventTarget.closest<HTMLElement>(
    IMPLICIT_CURSOR_TARGET_SELECTOR
  )
  const interactiveTarget = cursorTarget ?? implicitTarget

  if (!interactiveTarget) {
    return {
      state: {
        ...DEFAULT_VISUAL_STATE,
        isPressed,
        isVisible: true,
      },
      surface: null,
      target: null,
    }
  }

  if (isDisabledTarget(interactiveTarget)) {
    return {
      state: {
        ...DEFAULT_VISUAL_STATE,
        isPressed,
        isVisible: true,
      },
      surface: null,
      target: interactiveTarget,
    }
  }

  const variant = normalizeCursorVariant(
    interactiveTarget.dataset.cursorVariant ??
      interactiveTarget.dataset.cursorShape
  )

  if (variant === 'hidden') {
    return {
      state: {
        ...DEFAULT_VISUAL_STATE,
        variant,
      },
      surface: null,
      target: interactiveTarget,
    }
  }

  return {
    state: {
      isActive: true,
      isPressed,
      isVisible: true,
      label: interactiveTarget.dataset.cursorLabel ?? '',
      variant,
    },
    surface: variant === 'pill' ? resolveCursorSurface(interactiveTarget) : null,
    target: interactiveTarget,
  }
}

function syncCursorPosition(
  cursor: HTMLElement | null,
  label: HTMLElement | null,
  event: PointerEvent
) {
  const x = `${event.clientX}px`
  const y = `${event.clientY}px`

  if (cursor) {
    cursor.style.left = x
    cursor.style.top = y
  }

  if (label) {
    label.style.left = x
    label.style.top = y
  }
}

export function CursorTrail() {
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const labelRef = useRef<HTMLDivElement | null>(null)
  const activeTargetRef = useRef<HTMLElement | null>(null)
  const activeSurfaceRef = useRef<HTMLElement | null>(null)
  const activeSurfaceRectRef = useRef<SurfaceRect | null>(null)
  const surfaceFrameRef = useRef(0)
  const pendingSurfaceFillRef = useRef<{
    clientX: number
    clientY: number
    surface: HTMLElement
  } | null>(null)
  const pressedRef = useRef(false)
  const visualStateRef = useRef<CursorVisualState>(DEFAULT_VISUAL_STATE)
  const [isEnabled, setIsEnabled] = useState(false)
  const [visualState, setVisualState] =
    useState<CursorVisualState>(DEFAULT_VISUAL_STATE)

  useEffect(() => {
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    )

    function syncEnabledState() {
      setIsEnabled(pointerQuery.matches && !reducedMotionQuery.matches)
    }

    syncEnabledState()
    pointerQuery.addEventListener('change', syncEnabledState)
    reducedMotionQuery.addEventListener('change', syncEnabledState)

    return () => {
      pointerQuery.removeEventListener('change', syncEnabledState)
      reducedMotionQuery.removeEventListener('change', syncEnabledState)
    }
  }, [])

  useEffect(() => {
    function cancelSurfaceFill() {
      if (surfaceFrameRef.current !== 0) {
        window.cancelAnimationFrame(surfaceFrameRef.current)
        surfaceFrameRef.current = 0
      }
      pendingSurfaceFillRef.current = null
    }

    function clearHoverState() {
      activeTargetRef.current?.classList.remove(
        'expressive-cursor-hovered',
        'is-hovered'
      )
      cancelSurfaceFill()
      clearSurfaceFill(activeSurfaceRef.current)
      activeTargetRef.current = null
      activeSurfaceRef.current = null
      activeSurfaceRectRef.current = null
    }

    if (!isEnabled) {
      delete document.documentElement.dataset.expressiveCursor
      pressedRef.current = false
      clearHoverState()
      return undefined
    }

    document.documentElement.dataset.expressiveCursor = 'true'

    function updateVisualState(nextState: CursorVisualState) {
      if (statesMatch(visualStateRef.current, nextState)) {
        return
      }

      visualStateRef.current = nextState
      setVisualState(nextState)
    }

    function scheduleSurfaceFill(
      surface: HTMLElement,
      clientX: number,
      clientY: number
    ) {
      pendingSurfaceFillRef.current = { clientX, clientY, surface }

      if (surfaceFrameRef.current !== 0) {
        return
      }

      surfaceFrameRef.current = window.requestAnimationFrame(() => {
        surfaceFrameRef.current = 0

        const pending = pendingSurfaceFillRef.current
        pendingSurfaceFillRef.current = null

        if (!pending || pending.surface !== activeSurfaceRef.current) {
          return
        }

        const rect =
          activeSurfaceRectRef.current ?? measureSurface(pending.surface)

        if (!rect) {
          return
        }

        activeSurfaceRectRef.current = rect
        syncSurfaceFill(
          pending.surface,
          rect,
          pending.clientX,
          pending.clientY
        )
      })
    }

    function syncHoverState(hit: CursorHit, event: PointerEvent) {
      const targetChanged = activeTargetRef.current !== hit.target
      const surfaceChanged = activeSurfaceRef.current !== hit.surface

      if (targetChanged || surfaceChanged) {
        clearHoverState()
        activeTargetRef.current = hit.target
        activeSurfaceRef.current = hit.surface

        hit.target?.classList.add('expressive-cursor-hovered', 'is-hovered')

        if (hit.surface) {
          const rect = measureSurface(hit.surface)

          if (!rect) {
            return
          }

          activeSurfaceRectRef.current = rect
          primeSurfaceFill(hit.surface, rect, event.clientX, event.clientY)
          hit.surface.classList.add('expressive-cursor-surface-hovered')
          scheduleSurfaceFill(hit.surface, event.clientX, event.clientY)
        }
      }
    }

    function handlePointerMove(event: PointerEvent) {
      syncCursorPosition(cursorRef.current, labelRef.current, event)
      const hit = readCursorHit(event.target, pressedRef.current)
      syncHoverState(hit, event)
      updateVisualState(hit.state)
    }

    function handlePointerDown(event: PointerEvent) {
      pressedRef.current = true
      const hit = readCursorHit(event.target, true)
      syncHoverState(hit, event)
      updateVisualState(hit.state)
    }

    function handlePointerUp(event: PointerEvent) {
      pressedRef.current = false
      const hit = readCursorHit(event.target, false)
      syncHoverState(hit, event)
      updateVisualState(hit.state)
    }

    function handlePointerOut(event: PointerEvent) {
      if (event.relatedTarget === null) {
        pressedRef.current = false
        clearHoverState()
        updateVisualState(DEFAULT_VISUAL_STATE)
      }
    }

    function handleWindowBlur() {
      pressedRef.current = false
      clearHoverState()
      updateVisualState(DEFAULT_VISUAL_STATE)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    window.addEventListener('pointerup', handlePointerUp, { passive: true })
    window.addEventListener('pointerout', handlePointerOut, { passive: true })
    window.addEventListener('blur', handleWindowBlur)

    return () => {
      delete document.documentElement.dataset.expressiveCursor
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointerout', handlePointerOut)
      window.removeEventListener('blur', handleWindowBlur)
      clearHoverState()
      visualStateRef.current = DEFAULT_VISUAL_STATE
    }
  }, [isEnabled])

  if (!isEnabled) {
    return null
  }

  const hasLabel =
    visualState.isActive &&
    visualState.isVisible &&
    visualState.label.length > 0 &&
    visualState.variant !== 'pill'

  return (
    <>
      <div
        ref={cursorRef}
        className={joinClasses(
          s.cursor,
          visualState.isVisible && s.visible,
          visualState.isActive && s.active,
          visualState.isPressed && s.pressed,
          visualState.variant === 'pill' && s.pill,
          visualState.variant === 'checked' && s.checked,
          visualState.variant === 'hidden' && s.hidden
        )}
        data-testid="expressive-cursor"
        aria-hidden="true"
      />
      <div
        ref={labelRef}
        className={joinClasses(
          s.label,
          hasLabel && s.labelActive,
          visualState.variant === 'pill' && s.labelPill
        )}
        data-testid="expressive-cursor-label"
        aria-hidden="true"
      >
        {visualState.label}
      </div>
    </>
  )
}
