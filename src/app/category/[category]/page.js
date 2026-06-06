"use client"
import {useProductStore} from "@/store/useProductStore"
import {useParams} from "next/navigation"
import { useEffect } from "react"

const CategoryPage = () => {
const {fetchProductsByCategory} = useProductStore();

  const {category} = useParams();

  useEffect(() => {
    fetchProductsByCategory(category);
  }, [category, fetchProductsByCategory]);

  return (
    <div>
      <h1>Category: {category}</h1>
    </div>
  )
}

export default CategoryPage

