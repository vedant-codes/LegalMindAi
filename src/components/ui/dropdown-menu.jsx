"use client"

import React, { useState, useRef, useEffect } from "react"

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {React.Children.map(children, (child) => React.cloneElement(child, { isOpen, setIsOpen }))}
    </div>
  )
}

const DropdownMenuTrigger = ({ children, isOpen, setIsOpen, asChild = false }) => {
  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  if (asChild) {
    return React.cloneElement(children, { onClick: handleClick })
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {children}
    </button>
  )
}

const DropdownMenuContent = ({ children, isOpen, align = "right", side = "bottom", className = "" }) => {
  if (!isOpen) return null

  const alignmentClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 transform -translate-x-1/2",
  }

  const sideClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
  }

  return (
    <div
      className={`absolute z-50 ${alignmentClasses[align]} ${sideClasses[side]} w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${className}`}
    >
      <div className="py-1" role="menu">
        {children}
      </div>
    </div>
  )
}

const DropdownMenuItem = ({ children, onClick, className = "", disabled = false }) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick()
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${
        disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      } group flex items-center px-4 py-2 text-sm w-full text-left ${className}`}
      role="menuitem"
    >
      {children}
    </button>
  )
}

const DropdownMenuSeparator = ({ className = "" }) => {
  return <div className={`border-t border-gray-100 my-1 ${className}`} />
}

const DropdownMenuLabel = ({ children, className = "" }) => {
  return <div className={`px-4 py-2 text-sm font-medium text-gray-900 ${className}`}>{children}</div>
}

const DropdownMenuGroup = ({ children }) => {
  return <div>{children}</div>
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
}
