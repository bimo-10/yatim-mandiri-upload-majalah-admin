"use client";
import React from "react";
import { DateInput } from "@mantine/dates";

export default function InputDate({ radius, label, error, placeholder }) {
  return (
    <>
      <section className="">
        <DateInput
          radius={radius}
          label={label}
          error={error}
          placeholder={placeholder}
          className="w-1/2"
        />
      </section>
    </>
  );
}
