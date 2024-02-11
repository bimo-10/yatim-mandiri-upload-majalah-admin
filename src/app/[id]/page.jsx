import NavbarComponent from "@/components/sections/NavbarComponent";
import React from "react";
import SingleViewComponent from "./components/SingleViewComponent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import NavbarAdminComponent from "../(dashboard)/admin/components/NavbarAdminComponent";

// GET POST ID
async function getPostId(id) {
  const res = await fetch(`${process.env.BASE_URL}/api/post/view/${id}`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data;
}

export default async function page({ params }) {
  const session = await getServerSession(authOptions);
  const id = params.id;
  const post = await getPostId(id);
  console.log(post);

  return (
    <>
      <main className="pb-6">
        <NavbarAdminComponent session={session} />
        <SingleViewComponent post={post.data.getPost} />
      </main>
    </>
  );
}
