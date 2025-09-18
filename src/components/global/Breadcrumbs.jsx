"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { IoCaretForward } from "react-icons/io5";

export default function Breadcrumbs({
  baseLabel = "Home",
  baseHref = "/",
  overrides = {},
  className = "",
}) {
  const pathname = usePathname();

  const segments = useMemo(() => {
    if (!pathname) return [];
    const parts = pathname
      .split("?")[0]
      .split("#")[0]
      .split("/")
      .filter(Boolean);
    return parts;
  }, [pathname]);

  const items = useMemo(() => {
    const list = [];
    let href = "";
    segments.forEach((seg) => {
      href += `/${seg}`;
      const label =
        overrides[seg] || decodeURIComponent(seg).replace(/[-_]/g, " ");
      list.push({ label, href });
    });
    return list;
  }, [segments, overrides]);

  const jsonLd = useMemo(() => {
    const itemListElements = [
      {
        "@type": "ListItem",
        position: 1,
        name: baseLabel,
        item: baseHref,
      },
      ...items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 2,
        name: item.label,
        item: item.href,
      })),
    ];
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: itemListElements,
    };
  }, [items, baseHref, baseLabel]);

  if (!pathname) return null;

  return (
    <nav aria-label="Breadcrumb" className={`${className} w-full !text-xs md:!text-sm`}>
      <ol className="flex flex-row items-center gap-2 text-gray-600 font-semibold">
        <li>
          <Link href={baseHref} className="hover:underline">
            {baseLabel}
          </Link>
        </li>
        {items.map((item, idx) => (
          <li key={item.href} className="flex flex-row items-center gap-1">
            <span>
              <IoCaretForward size={16} />
            </span>
            {idx < items.length - 1 ? (
              <Link href={item.href} className="hover:underline capitalize">
                {item.label}
              </Link>
            ) : (
              <span className="capitalize text-wrap line-clamp-1 text-ellipsis" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}
