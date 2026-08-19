"use client"

import { useCallback, useRef } from "react"
import { useInViewCanvas } from "@/lib/useInViewCanvas"

/**
 * Fundo técnico procedural: grade, cruzes ocasionais e uma varredura lenta.
 * Decorativo — aria-hidden, sem captura de ponteiro, DPR limitado a 2,
 * pausado fora da viewport e congelado em um frame sob reduced motion.
 */
export function TechnicalBackdrop({ density = 7 }: { density?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null)

  const draw = useCallback(
    ({ context, width, height, time }: {
      context: CanvasRenderingContext2D
      width: number
      height: number
      time: number
    }) => {
      context.clearRect(0, 0, width, height)

      const cell = width / density
      const line = Math.max(1, width / 2400)
      context.lineWidth = line
      context.strokeStyle = "rgba(79, 227, 193, 0.16)"

      for (let x = 0; x <= width; x += cell) {
        context.beginPath()
        context.moveTo(x, 0)
        context.lineTo(x, height)
        context.stroke()
      }
      for (let y = 0; y <= height; y += cell) {
        context.beginPath()
        context.moveTo(0, y)
        context.lineTo(width, y)
        context.stroke()
      }

      // Cruzes em interseções determinísticas (sem Math.random: evita flicker).
      const arm = cell * 0.09
      context.strokeStyle = "rgba(79, 227, 193, 0.5)"
      context.lineWidth = line * 1.6
      let index = 0
      for (let x = cell; x < width; x += cell) {
        for (let y = cell; y < height; y += cell) {
          index += 1
          if (index % 5) continue
          context.beginPath()
          context.moveTo(x - arm, y)
          context.lineTo(x + arm, y)
          context.moveTo(x, y - arm)
          context.lineTo(x, y + arm)
          context.stroke()
        }
      }

      // Varredura horizontal lenta reforçando a leitura vertical.
      const sweep = ((time * 0.12) % 1.4) - 0.2
      const y = height * sweep
      const gradient = context.createLinearGradient(0, y - height * 0.08, 0, y + height * 0.08)
      gradient.addColorStop(0, "rgba(79, 227, 193, 0)")
      gradient.addColorStop(0.5, "rgba(79, 227, 193, 0.22)")
      gradient.addColorStop(1, "rgba(79, 227, 193, 0)")
      context.fillStyle = gradient
      context.fillRect(0, y - height * 0.08, width, height * 0.16)
    },
    [density],
  )

  useInViewCanvas(canvas, draw)

  return (
    <div className="technical-backdrop" aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  )
}
