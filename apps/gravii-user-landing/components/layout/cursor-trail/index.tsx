'use client'

import { useEffect, useRef } from 'react'
import s from './cursor-trail.module.css'

const MAX_POINTS = 16
const FADE_RATE = 0.08
const DOT_RADIUS = 4
const HUE = 264 // violet

type Point = { x: number; y: number; life: number }

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return undefined
    if (window.matchMedia('(hover: none)').matches) return undefined

    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }
    resize()

    const points: Point[] = []
    let mouseX = -100
    let mouseY = -100
    let rafId = 0

    const handleMove = (event: MouseEvent) => {
      mouseX = event.clientX
      mouseY = event.clientY
      points.push({ x: mouseX, y: mouseY, life: 1 })
      if (points.length > MAX_POINTS) points.shift()
    }

    const handleResize = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      resize()
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of points) {
        p.life -= FADE_RATE
        if (p.life <= 0) continue
        const r = DOT_RADIUS * p.life
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${HUE}, 70%, 55%, ${p.life * 0.35})`
        ctx.fill()
      }
      // Remove dead points
      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i]
        if (p && p.life <= 0) points.splice(i, 1)
      }
      rafId = window.requestAnimationFrame(tick)
    }
    rafId = window.requestAnimationFrame(tick)

    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className={s.canvas} />
}
