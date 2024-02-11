import NavbarComponent from "@/components/sections/NavbarComponent";
import PostComponent from "@/components/sections/PostComponent";
import React from "react";
import NavbarAdminComponent from "../(dashboard)/admin/components/NavbarAdminComponent";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

export const getCategories = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/category`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data;
};

// const getPosts = async () => {
//   const res = await fetch(`${process.env.BASE_URL}/api/post`, {
//     cache: "no-store",
//   });
//   const data = await res.json();
//   return data;
// };

// const getCategory = async () => {
//   const res = await prisma.category.findMany();
//   return res;
// };

export default async function page() {
  const session = await getServerSession(authOptions);
  const categories = await getCategories();
  // const posts = await getPosts();
  return (
    <>
      <main>
        <NavbarAdminComponent session={session} />
        <PostComponent categories={categories} />
      </main>
    </>
  );
}
