"use client"

import * as React from "react"
import { CategoryTableWrapper } from "./_components/category-table-wrapper"

/**
 * CategoryIndexPage
 * This page serves as the index for managing articles/blog posts 
 * (referred to as categories in the current navigation structure).
 * Using the refactored Sortable Data Table for Drag & Drop functionality.
 */
export default function CategoryIndexPage() {
  return <CategoryTableWrapper isSortable={true} />
}
