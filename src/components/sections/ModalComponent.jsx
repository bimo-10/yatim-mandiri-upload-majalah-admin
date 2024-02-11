"use client";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";

export default function ModalComponent({ children, open, close, opened }) {
  return (
    <>
      {/* <section className="fixed inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-black opacity-50"></div>

          <div className="relative bg-white rounded-lg p-4 max-w-md mx-auto">
            <div
              className="absolute top-0 right-0 p-2 cursor-pointer"
              onClick={handleClose}
            >
              &times;
            </div>

            {children}
          </div>
        </div>
      </section> */}

      <Modal opened={opened} onClose={close} centered>
        {/* Modal content */}
        {children}
      </Modal>
    </>
  );
}
