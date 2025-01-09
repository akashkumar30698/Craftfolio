"use client"

import React, { useState, useCallback, useRef, useEffect } from 'react'
import styles from './ColorPicker.module.css'

interface ColorPickerProps {
  onChange?: (color: { h: number; s: number; v: number }) => void
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ onChange }) => {
  const [hsv, setHsv] = useState({ h: 0, s: 100, v: 100 })
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const handleChange = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current || !isDragging.current) return

      const { current: container } = containerRef
      const rect = container.getBoundingClientRect()

      let clientX, clientY
      if (event instanceof TouchEvent) {
        clientX = event.touches[0].clientX
        clientY = event.touches[0].clientY
      } else {
        clientX = event.clientX
        clientY = event.clientY
      }

      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))

      const s = Math.round(x * 100)
      const v = Math.round((1 - y) * 100)

      setHsv(prev => ({ ...prev, s, v }))
      onChange?.({ ...hsv, s, v })
    },
    [hsv, onChange]
  )



  const handleMouseUp = useCallback(() => {
    isDragging.current = false
    window.removeEventListener('mousemove', handleChange)
    window.removeEventListener('mouseup', handleMouseUp)
  }, [handleChange])

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true
    handleChange(event.nativeEvent)
    window.addEventListener('mousemove', handleChange)
    window.addEventListener('mouseup', handleMouseUp)
  }, [handleChange, handleMouseUp])




  const handleTouchEnd = useCallback(() => {
    isDragging.current = false
    window.removeEventListener('touchmove', handleChange)
    window.removeEventListener('touchend', handleTouchEnd)
  }, [handleChange])

  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    isDragging.current = true
    handleChange(event.nativeEvent)
    window.addEventListener('touchmove', handleChange)
    window.addEventListener('touchend', handleTouchEnd)
  }, [handleChange, handleTouchEnd])



  useEffect(() => {
    return () => {
      handleMouseUp()
      handleTouchEnd()
    }
  }, [handleMouseUp, handleTouchEnd])

  const pointerStyle = {
    left: `${hsv.s}%`,
    top: `${100 - hsv.v}%`,
  }

  const saturationStyle = {
    backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
  }

  return (
    <div
      ref={containerRef}
      className={styles.saturation}
      style={saturationStyle}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        className={styles.interactive}
        role="slider"
        aria-label="Color"
        aria-valuetext={`Saturation ${hsv.s}%, Brightness ${hsv.v}%`}
        aria-valuenow={hsv.s} // Assuming 'hsv.s' is the current value of the slider (you can use any value here)
        tabIndex={0}
      >

      <div className={styles.pointer} style={pointerStyle}>
        <div
          className={styles.pointerFill}
          style={{ backgroundColor: `hsl(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` }}
        />
      </div>
    </div>
    </div >
  )
}

