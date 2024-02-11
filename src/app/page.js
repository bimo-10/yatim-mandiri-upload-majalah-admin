import MajalahComponent from "@/components/sections/MajalahComponent";
import NavbarComponent from "@/components/sections/NavbarComponent";
import SearchComponent from "@/components/sections/SearchComponent";
import { authOptions } from "@/libs/auth";
import prisma from "@/libs/prisma";
import { Container } from "@mantine/core";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

import { FaSearch } from "react-icons/fa";
import NavbarAdminComponent from "./(dashboard)/admin/components/NavbarAdminComponent";

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

// const getSession = () => {
//   const { status } = useSession({
//     required: true,
//     onUnauthenticated() {
//       // The user is not authenticated, handle it here.
//       redirect("/login");
//     },
//   });

//   if (status === "loading") {
//     return <div>Loading...</div>;
//   }
// };

export default async function Home() {
  const session = await getServerSession(authOptions);
  // console.log(session?.user);

  const posts = await getPosts();
  // console.log(posts);
  return (
    <>
      <main className="pb-6">
        <NavbarAdminComponent session={session} />
        <SearchComponent
          placeholder={"Search..."}
          radius={"sm"}
          label={"Find Magazine"}
          posts={posts}
          icon={<FaSearch />}
          session={session}
        >
          Find
        </SearchComponent>
        {/* <MajalahComponent posts={posts} /> */}
      </main>
    </>
  );
}
