"use client";

import {
  Alert,
  Button,
  Card,
  Container,
  Flex,
  Input,
  PasswordInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Bounce, ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { notifications } from "@mantine/notifications";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";

export default function LoginComponent() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email tidak valid"),
      password: (value) =>
        value.length < 8 ? "Password harus lebih dari 8" : null,
    },
  });

  const handleSubmit = async (values) => {
    const signInData = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (signInData.error) {
      console.log(signInData);
      notifications.show({
        title: "Error",
        message: "Email atau Password tidak valid",
        icon: <FaCircleXmark />,
        color: "red",
        autoClose: 4000,
      });
    } else {
      router.refresh();
      router.push("/admin");
      notifications.show({
        title: "Success",
        message: "Login Success",
        icon: <FaCheckCircle />,
        color: "green",
        autoClose: 4000,
      });
    }
  };

  // const handleToast = () => {
  //   toast.success("Login Success", {
  //     position: "top-center",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "light",
  //     transition: Bounce,
  //   });
  // };

  return (
    <>
      <Container fluid size={"xs"}>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
        <Title align={"center"} my={"lg"} size={"h1"}>
          Sign In
        </Title>
        <Card withBorder shadow="sm" radius="md" w={"380px"}>
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <Flex direction={"column"} gap={"sm"}>
              <Input.Wrapper id="email" label="Email" required>
                <Input
                  label="Email"
                  placeholder="Email"
                  {...form.getInputProps("email")}
                />
              </Input.Wrapper>

              <PasswordInput
                label="Password"
                placeholder="Password"
                required
                {...form.getInputProps("password")}
              />

              <Button
                my={"18px"}
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan" }}
                type="submit"
                // onClick={form.onSubmit((values) => handleSubmit(values))}
                // onClick={() => handleToast()}
              >
                Sign In
              </Button>
            </Flex>
          </form>
        </Card>
        <Button
          my={"18px"}
          variant="gradient"
          gradient={{ from: "red", to: "orange" }}
          onClick={() => router.push("/signup")}
          fullWidth
        >
          Sign Up
        </Button>
      </Container>
    </>
  );
}
