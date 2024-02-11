import { Skeleton } from "@mantine/core";
import React from "react";

export default function loading() {
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <Skeleton height={500} radius={"xl"} width={"60%"} />
      </div>
    </>
  );
}
