"use client";

import { Badge, Button, Container, Group, Input, Text } from "@mantine/core";
import { useInputState, useListState } from "@mantine/hooks";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import MajalahComponent from "./MajalahComponent";

export default function SearchComponent({
  placeholder,
  radius,
  label,
  description,
  children,
  posts,
  icon,
  session,
}) {
  const [title, setTitle] = useInputState("");
  const [values, handlers] = useListState(posts);
  // const [values, setValues] = useState(posts);

  console.log(values);

  const router = useRouter();

  // MOMENT LOCALE
  const moment = require("moment");
  require("moment/locale/id");
  moment.locale("id");

  // HANDLE FILTER
  // const handleFilter = (e) => {
  //   e.preventDefault();

  //   handlers.filter(
  //     (post) =>
  //       post.title.toLowerCase().includes(title.toLowerCase()) ||
  //       post.content.toLowerCase().includes(title.toLowerCase()) ||
  //       post.categories.name.toLowerCase().includes(title.toLowerCase())
  //   );

  //   if (!title) return;

  //   if (values.length === 0) {
  //     handlers.setState(posts);
  //   }

  //   console.log(values);

  //   setTitle("");
  // };

  const handleRefresh = (e) => {
    e.preventDefault();
    handlers.setState(posts);
    setTitle("");
  };

  // SORT VALUES BY ID
  values.sort((a, b) => Number(b.id) - Number(a.id));
  console.log(values);

  return (
    <>
      <section className="p-8 flex items-end gap-2 ">
        <Input.Wrapper label={label} description={description} w={380}>
          <Input
            placeholder={placeholder}
            radius={radius}
            value={title}
            onChange={setTitle}
            rightSection={icon}
          />
        </Input.Wrapper>
        {/* <Button type="button" onClick={handleFilter} size="sm">
          {children}
        </Button> */}
      </section>
      {/* MAPPING VALUES */}
      {values
        .filter((post) => {
          if (title === "") return post;
          else if (post.title.toLowerCase().includes(title.toLowerCase())) {
            return post;
          }
        })
        .map((post) => {
          return (
            <MajalahComponent post={post} key={post.id} session={session} />
          );
        })}
      {/* <Container>
        {values.length === 0 && (
          <div className="text-center">
            <h1 className="text-2xl mb-4">No Results</h1>
            <Button onClick={handleRefresh}>Refresh</Button>
          </div>
        )}
      </Container> */}
    </>
  );
}
