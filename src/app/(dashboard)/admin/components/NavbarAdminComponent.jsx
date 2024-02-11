"use client";
import { Button, Text } from "@mantine/core";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

export default function NavbarAdminComponent({ session }) {
  return (
    <>
      <nav className="flex align-center justify-between px-4 py-4 shadow-lg">
        <div className="flex gap-8 items-center">
          <h1>Yatim Mandiri</h1>

          <ul className="flex gap-4">
            <li>
              <Link href="/admin">Magazines</Link>
            </li>
            <li>
              <Link href="/category">Category</Link>
            </li>
            <li>
              <Link href="/post">Post New Magazine</Link>
            </li>
          </ul>
        </div>

        {session?.user ? (
          <div className="flex gap-4">
            <Text size="md">
              Welcome,{" "}
              <span className="font-bold capitalize">
                {session?.user?.username}
              </span>
            </Text>

            <Button
              size="xs"
              color="red"
              onClick={() =>
                signOut({
                  redirect: true,
                  callbackUrl: `${window.location.origin}/login`,
                })
              }
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button size="sm">Login</Button>
          </Link>
        )}
      </nav>
    </>
  );
}
