"use client"

import React, { useRef, useEffect } from 'react'
import Image from 'next/image'

interface ProtectedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  priority?: boolean
  quality?: number
}

export function ProtectedImage({
  src,
  alt,
  width,
  height,
  className,
  fill = false,
  priority = false,
  quality = 75
}: ProtectedImageProps) {
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const imageElement = imageRef.current?.querySelector('img')
    if (imageElement) {
      // Apply additional protection
      imageElement.style.pointerEvents = 'none'
      imageElement.style.userSelect = 'none'
      imageElement.style.webkitUserSelect = 'none'
      imageElement.style.mozUserSelect = 'none'
      imageElement.style.msUserSelect = 'none'
      imageElement.style.webkitUserDrag = 'none'
      imageElement.style.userDrag = 'none'
      imageElement.style.webkitTouchCallout = 'none'
      imageElement.style.webkitTapHighlightColor = 'transparent'
      
      // Add event listeners
      const preventDefault = (e: Event) => e.preventDefault()
      
      imageElement.addEventListener('contextmenu', preventDefault)
      imageElement.addEventListener('dragstart', preventDefault)
      imageElement.addEventListener('selectstart', preventDefault)
      imageElement.addEventListener('mousedown', preventDefault)
      imageElement.addEventListener('keydown', preventDefault)
      
      return () => {
        imageElement.removeEventListener('contextmenu', preventDefault)
        imageElement.removeEventListener('dragstart', preventDefault)
        imageElement.removeEventListener('selectstart', preventDefault)
        imageElement.removeEventListener('mousedown', preventDefault)
        imageElement.removeEventListener('keydown', preventDefault)
      }
    }
  }, [src])

  return (
    <div 
      ref={imageRef}
      className={`relative inline-block ${className || ''}`}
      style={{ 
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {/* Protection overlay */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'transparent',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
      />
      
      {/* Actual image */}
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={className}
          priority={priority}
          quality={quality}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          priority={priority}
          quality={quality}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}
        />
      )}
      
      {/* Additional invisible protection layer */}
      <div 
        className="absolute inset-0 z-20"
        style={{
          background: 'transparent',
          pointerEvents: 'none'
        }}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onSelectStart={(e) => e.preventDefault()}
        onMouseDown={(e) => e.preventDefault()}
        onKeyDown={(e) => e.preventDefault()}
      />
    </div>
  )
}
