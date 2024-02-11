import NavbarComponent from "@/components/sections/NavbarComponent";
import React from "react";
import CategoryComponent from "../../components/sections/CategoryComponent";
import PostCategoryComponent from "./components/sections/PostCategoryComponent";
import NavbarAdminComponent from "../(dashboard)/admin/components/NavbarAdminComponent";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";

export const getCategories = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/category`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data;
};

export default async function page() {
  const session = await getServerSession(authOptions);
  const categories = await getCategories();

  // console.log(category);

  return (
    <>
      <main>
        <NavbarAdminComponent session={session} />
        {/* <SearchComponent
          placeholder={"Insert New Category Name..."}
          radius={"sm"}
          label={"New Category Name"}
        >
          Save
        </SearchComponent> */}
        <PostCategoryComponent />
        <CategoryComponent categories={categories} />
      </main>
    </>
  );
}
