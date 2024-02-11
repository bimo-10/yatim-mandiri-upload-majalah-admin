"use client";

import { Badge, Button, Group, Notification } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function MajalahComponent({ post, category }) {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const checkIcon = <FaCheckCircle size={16} color="green" />;

  console.log(post);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // console.log(posts);

  // MOMENT LOCALE
  const moment = require("moment");
  require("moment/locale/id");
  moment.locale("id");

  // HANDLE DELETE
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/post/${id}`, {
        method: "DELETE",
        data: { id: id },
      });
      const data = await response.json();
      // console.log(data);
      setIsDeleted(true);
      return data;
    } catch (error) {
      console.log(error);
    }
    router.refresh();
  };
  function createMarkup() {
    return { __html: post.content };
  }

  const handleButtonClose = () => {
    setIsDeleted(false);
    router.refresh();
  };

  return (
    <>
      <section className="px-8 py-4">
        {isDeleted ? (
          <Notification
            icon={checkIcon}
            color="green"
            title="Post deleted"
            onClose={handleButtonClose}
            my={20}
            pb={20}
          />
        ) : (
          <div className="flex gap-4 mb-6">
            <Image
              src={`/images/${post.image}`}
              alt={post.image}
              width={200}
              height={200}
              priority={true}
              className="w-64 h-44 rounded-md"
            />
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="font-bold text-xl mb-4">{post.title}</h1>
                {isClient ? (
                  <section
                    className="mb-4"
                    dangerouslySetInnerHTML={createMarkup()}
                  />
                ) : null}
              </div>

              <div>
                <p className="text-sm">
                  Release: {moment(post.date).format("DD MMMM YYYY")}
                  {/* {post.createdAt} */}
                </p>
                {post.categories.map((category) => (
                  <Badge color="blue" variant="light" key={category.id} mx={2}>
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
