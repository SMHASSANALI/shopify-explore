"use client";

import React from "react";
import { motion } from "framer-motion";
import { PiCaretRight } from "react-icons/pi";
import Link from "next/link";

const CustomLink = ({ text, href }) => {
  return (
    <Link
      className={
        "text-black font-light flex items-center gap-1 rounded cursor-pointer"
      }
      href={href}
    >
      {text}
      <PiCaretRight />
    </Link>
  );
};

export default CustomLink;
