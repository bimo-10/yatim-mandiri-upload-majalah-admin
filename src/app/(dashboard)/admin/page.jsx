// import NavbarComponent from "@/components/sections/NavbarComponent";
// import SearchComponent from "@/components/sections/SearchComponent";
import { authOptions } from "@/libs/auth";
import { Container } from "@mantine/core";
import { getServerSession } from "next-auth";
import { FaSearch } from "react-icons/fa";
import React from "react";
import { useSession } from "next-auth/react";
import NavbarAdminComponent from "./components/NavbarAdminComponent";
import SearchAdminComponent from "./components/SearchAdminComponent";
import AffixPartials from "@/components/partials/AffixPartials";

const getPosts = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/post`, {
    cache: "no-store",
  });

  const data = await res.json();
  return data.data;
};

const getPostQuery = async (pageNum, pageSize) => {
  const response = await fetch(
    `${process.env.BASE_URL}/api/post?pageNum=${pageNum}&pageSize=${pageSize}`
  );
  const data = await response.json();

  return data;
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const posts = await getPosts();
  const postQuery = await getPostQuery(1, 5);

  return (
    <>
      <Container fluid>
        <NavbarAdminComponent session={session} />
        <SearchAdminComponent
          placeholder={"Search..."}
          radius={"sm"}
          label={"Find Magazine"}
          posts={posts}
          postQuery={postQuery}
          icon={<FaSearch />}
          session={session}
        >
          Find
        </SearchAdminComponent>
        <AffixPartials />
      </Container>
    </>
  );
}
