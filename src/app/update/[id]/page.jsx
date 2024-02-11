import NavbarComponent from "@/components/sections/NavbarComponent";
import UpdateComponent from "./components/sections/UpdateComponent";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import NavbarAdminComponent from "@/app/(dashboard)/admin/components/NavbarAdminComponent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

const prisma = new PrismaClient();

// GET POSTS

const getPosts = async () => {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/post`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log({ message: error.message });
  }
};

// GET CATEGORIES
const getCategories = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/category`, {
    cache: "no-store",
  });
  const data = await res.json();

  return data;
};

export default async function page({ params }) {
  const session = await getServerSession(authOptions);
  // console.log(params);
  const id = params.id;
  const posts = await getPosts();
  // console.log(posts);
  const categories = await getCategories();
  return (
    <>
      <NavbarAdminComponent session={session} />
      <UpdateComponent categories={categories} posts={posts} id={id} />
    </>
  );
}
