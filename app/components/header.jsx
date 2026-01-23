"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Menu, X, Handbag, Search, User } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  const links = [
    { href: "/", label: "Início" },
    { href: "/guardaroupa", label: "Guarda-roupa" },
    { href: "/loja", label: "Loja" },
    { href: "/colecoes", label: "Coleções" },
  ];

  return (
    <>
      <AnimatePresence>
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 left-0 w-full h-14 z-40 backdrop-blur-md bg-background"
        >
          <div className="mx-auto h-full px-4 md:px-10 flex items-center justify-between">
            <div className="flex gap-4 md:hidden">
              <button onClick={() => setOpen(true)} className="text-text">
                <Menu size={24} />
              </button>
              <button onClick={() => setOpen(true)} className="text-text">
                <Search size={24} />
              </button>
            </div>

            <Link
              href="/"
              className="font-burgues text-2xl md:text-4xl tracking-wide text-text"
            >
              Kilario
            </Link>

            <div className="flex gap-4 md:hidden">
              <button onClick={() => setOpen(true)} className="text-text">
                <User size={24} />
              </button>

              <button onClick={() => setOpen(true)} className="text-text">
                <Handbag size={24} />
              </button>
            </div>

            <nav className="hidden md:flex gap-6 h-full items-center">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`h-full flex items-center font-montserrat text-sm uppercase font-bold text-text ${
                    path === link.href ? "border-b-2 border-text" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </motion.header>
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background-blur z-50"
              onClick={() => setOpen(false)}
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-0 left-0 h-full w-64 bg-background z-50 p-6"
            >
              <button onClick={() => setOpen(false)} className="mb-8 text-text">
                <X size={24} />
              </button>

              <nav className="flex flex-col gap-6">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-text font-montserrat uppercase font-bold"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed z-40 bottom-0"
              >
                a
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
