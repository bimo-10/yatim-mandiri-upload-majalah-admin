import React from "react";
import UpdateCategoryComponent from "./UpdateCategoryComponent";
import NavbarComponent from "@/components/sections/NavbarComponent";

export async function getCategory(id) {
  const res = await fetch(`${process.env.BASE_URL}/api/category/${id}`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data;
}
export default async function UpdateCategoryPage({ params }) {
  const id = params.id;
  const category = await getCategory(id);
  console.log(params);
  return (
    <>
      <NavbarComponent />
      <UpdateCategoryComponent id={id} category={category} />
    </>
  );
}
