"use client";
import { Input } from "@mantine/core";
import React from "react";

export default function InputPartial({ radius, placeholder, label }) {
  return (
    <>
      <section>
        <Input
          radius={radius}
          placeholder={placeholder}
          label={label}
          className="w-1/2"
        />
      </section>
    </>
  );
}
