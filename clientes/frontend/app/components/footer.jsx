"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail } from "lucide-react";

export default function Footer() {
  const links = [
    { href: "/", label: "Início" },
    { href: "/guardaroupa", label: "Guarda-roupa" },
    { href: "/loja", label: "Loja" },
    { href: "/colecoes", label: "Coleções" },
  ];

  return (
    <footer className="w-full bg-background mt-20 relative border-t border-background-blur/40">
      <div className="mx-auto px-6 md:px-10 md:py-12 flex flex-col md:flex-row gap-10 md:gap-0 relative">
        <div className="md:w-1/2 flex items-center justify-center md:justify-start relative">
          <Image
            src="/footerfish.png"
            alt="Kilario"
            width={400}
            height={400}
            className="object-cover rotate-y-180 absolute max-sm:hidden -top-20 left-40 z-0"
          />
          <Image
            src="/footerfish.png"
            alt="Kilario"
            width={400}
            height={400}
            className="object-cover rotate-y-180 absolute max-sm:hidden top-20 -left-5 z-0"
          />
          <Image
            src="/footerfish.png"
            alt="Kilario"
            width={400}
            height={400}
            className="object-cover rotate-y-180 absolute max-sm:hidden -top-15 -left-75"
          />
          <Image
            src="/footerfish.png"
            alt="Kilario"
            width={400}
            height={400}
            className="object-cover rotate-y-180 absolute max-sm:hidden top-20 left-125"
          />
          <Image
            src="/footerfish.png"
            alt="Kilario"
            width={400}
            height={400}
            className="object-cover rotate-y-180 absolute max-sm:hidden -top-20 left-255"
          />
          <Image
            src="/footerfish.png"
            alt="Kilario"
            width={400}
            height={400}
            className="object-cover rotate-y-180 absolute max-sm:hidden top-20 left-235"
          />
        </div>

        <div className="md:w-2/3 flex flex-col items-start gap-8 text-text z-10">
          <nav className="grid grid-cols-2 grid-rows-2 gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-montserrat uppercase font-bold text-sm hover:opacity-70 transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-row items-start gap-4">
            <a
              href="https://www.instagram.com/brechokilario"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-70 transition"
            >
              <Instagram size={18} />
              <span className="font-montserrat text-sm">@brechokilario</span>
            </a>

            <a
              href="mailto:brechokilario@gmail.com"
              className="flex items-center gap-2 hover:opacity-70 transition"
            >
              <Mail size={18} />
              <span className="font-montserrat text-sm">
                brechokilario@gmail.com
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="w-full py-4 text-center mt-10 md:mt-25">
        <p className="text-xs font-montserrat text-text">
          © {new Date().getFullYear()} Kilario. Todos os direitos reservados.
        </p>
        <p className="text-xs font-montserrat text-text mt-0.5">
          Desenvolvido por{" "}
          <a href="https://apenasumgaroto.com.br/" target="_blank">
            Apenas um Garoto Iludido.
          </a>
        </p>
      </div>
    </footer>
  );
}
