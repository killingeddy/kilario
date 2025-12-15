"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { IoAlbumsOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BiCloset } from "react-icons/bi";
import { TbHome2 } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [visible, setVisible] = useState(false);
  const path = usePathname();

  useEffect(() => {
    // 🔹 fora da home → sempre visível
    if (path !== "/") {
      setVisible(true);
      return;
    }

    // 🔹 somente na home → depende do scroll
    const handleScroll = () => {
      setVisible(window.scrollY > 80);
    };

    handleScroll(); // estado correto ao carregar
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [path]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 left-0 w-full z-50 border-b border-first-blur bg-background p-2 flex items-center justify-between"
        >
          <Image
            src="/images/logo-red2.png"
            alt="Kilario Logo"
            width={80}
            height={10}
          />

          <nav className="flex gap-6">
            <Link href={"/"}>
              <div className="flex items-center gap-2 cursor-pointer">
                <TbHome2 size={22} />
                <span className="text-sm">Início</span>
              </div>
            </Link>

            <Link href={"/guardaroupa"}>
              <div className="flex items-center gap-2 cursor-pointer">
                <BiCloset size={22} />
                <span className="text-sm">Guarda-roupa</span>
              </div>
            </Link>

            <Link href={"/loja"}>
              <div className="flex items-center gap-2 cursor-pointer">
                <HiOutlineShoppingBag size={22} />
                <span className="text-sm">Loja</span>
              </div>
            </Link>

            <Link href={"/colecoes"}>
              <div className="flex items-center gap-2 cursor-pointer">
                <IoAlbumsOutline size={22} />
                <span className="text-sm">Coleções</span>
              </div>
            </Link>
          </nav>

          <Image
            src="/images/logo.png"
            alt="Kilario Logo"
            width={50}
            height={50}
          />
        </motion.header>
      )}
    </AnimatePresence>
  );
}
