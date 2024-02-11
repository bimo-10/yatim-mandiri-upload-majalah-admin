import getPosts from "@/libs/getPosts";
import React from "react";

export default async function MantineTable() {
  const getPosts = await getPosts();
  console.log(getPosts);
}
