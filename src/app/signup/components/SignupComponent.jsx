"use client";

import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Input,
  PasswordInput,
  Popover,
  Progress,
  Text,
  Title,
} from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// PASSWORD REQUIREMENT
function PasswordRequirement({ meets, label }) {
  return (
    <Text
      c={meets ? "teal" : "red"}
      style={{ display: "flex", alignItems: "center" }}
      mt={7}
      size="sm"
    >
      {meets ? (
        <IconCheck width={14} height={14} />
      ) : (
        <IconX width={14} height={14} />
      )}{" "}
      <Box>{label}</Box>
    </Text>
  );
}

// REQUIREMENT
const requirements = [
  { re: /[0-9]/, label: "Masukan angka" },
  { re: /[a-z]/, label: "Masukan huruf kecil" },
  { re: /[A-Z]/, label: "Masukan huruf besar" },
  {
    re: /[$&+,:;=?@#|'<>.^*()%!-]/,
    label: "Masukan simbol",
  },
];

// STRENGTH PASSWORD
function getStrength(password) {
  let multiplier = password.length >= 8 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

export default function SignupComponent() {
  const router = useRouter();
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [visible, { toggle }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      username: (value) =>
        value.length < 2 ? "Nama harus lebih dari 2" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email tidak valid"),
      password: (value) =>
        value.length < 8 ? "Password harus lebih dari 8" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Password tidak cocok" : null,
    },
  });

  // console.log(form.values);

  const handleSubmit = async (values) => {
    setIsLoading(true);

    const res = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await res.json();
    console.log(data);
    setIsLoading(false);

    router.push("/login");
  };

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(form.values.password)}
    />
  ));

  const strength = getStrength(form.values.password);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";

  return (
    <>
      <Container fluid size={"xs"}>
        <Title align={"center"} my={"lg"} size={"h1"}>
          Sign Up
        </Title>

        <Card withBorder shadow="sm" radius="md" w={"380px"}>
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <Flex direction={"column"} gap={"sm"}>
              <Input.Wrapper id="username" label="Username" required>
                <Input
                  placeholder="Username"
                  {...form.getInputProps("username")}
                />
              </Input.Wrapper>

              <Input.Wrapper id="email" label="Email" required>
                <Input
                  placeholder="email@mail.com"
                  {...form.getInputProps("email")}
                />
              </Input.Wrapper>

              <Popover
                opened={popoverOpened}
                position="bottom"
                width="target"
                transitionProps={{ transition: "pop" }}
              >
                <Popover.Target>
                  <div
                    onFocusCapture={() => setPopoverOpened(true)}
                    onBlurCapture={() => setPopoverOpened(false)}
                  >
                    <PasswordInput
                      withAsterisk
                      label="Your Password"
                      placeholder="Your Password"
                      visible={visible}
                      onVisibilityChange={toggle}
                      required
                      {...form.getInputProps("password")}
                    />
                  </div>
                </Popover.Target>
                <Popover.Dropdown>
                  <Progress color={color} value={strength} size={5} mb="xs" />
                  <PasswordRequirement
                    label="Masukan angka minimal 8 characters"
                    meets={form.values.password.length >= 8}
                  />
                  {checks}
                </Popover.Dropdown>
              </Popover>

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm Password"
                visible={visible}
                onVisibilityChange={toggle}
                withAsterisk
                required
                {...form.getInputProps("confirmPassword")}
              />

              <Button
                my={"18px"}
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan" }}
                type="submit"
              >
                Sign Up
              </Button>
            </Flex>
          </form>

          <Text align={"center"} size={"sm"}>
            Sudah punya akun?{" "}
            <Link href="/login" className="text-blue-500 underline">
              Login
            </Link>
          </Text>
        </Card>
        {/* <Button
          my={"18px"}
          variant="gradient"
          gradient={{ from: "red", to: "orange" }}
          onClick={() => router.push("/")}
          fullWidth
        >
          Kembali ke halaman utama
        </Button> */}
      </Container>
    </>
  );
}
