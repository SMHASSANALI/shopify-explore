'use server';

import { cookies } from "next/headers";
import Link from "next/link";
import { IoMdCart } from "react-icons/io";
import { getCart } from "@/lib/shopify";
import { calculateTotal } from "@/utils/helper";

export default async function CartBadge() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  if (!cartId) {
    return (
      <Link href="/cart" className="flex flex-row gap-1 items-end">
        <div className="relative mr-1">
          <IoMdCart size={30} color="white" />
        </div>
        <div>
          <p className="text-white text-[12px] font-extralight leading-none">Cart</p>
          <p className="text-white !text-[14px] font-light leading-none">£ 0.00</p>
        </div>
      </Link>
    );
  }

  let total = "0.00";
  let itemCount = 0;
  try {
    const cart = await getCart(cartId);
    total = cart ? calculateTotal(cart.lines.edges) : "0.00";
    itemCount = cart ? cart.lines.edges.reduce((sum, { node }) => sum + (node.quantity || 0), 0) : 0;
  } catch {
    total = "0.00";
    itemCount = 0;
  }

  return (
    <Link href="/cart" className="flex flex-row gap-1 items-end">
      <div className="relative mr-1">
        <IoMdCart size={30} color="white" />
        {itemCount > 0 && (
          <span className="absolute top-[-10px] right-[-10px] bg-[var(--accent)] text-white rounded-full flex items-center justify-center w-[18px] h-[18px] !text-xs font-bold">
            {itemCount}
          </span>
        )}
      </div>
      <div>
        <p className="text-white text-[12px] font-extralight leading-none">Cart</p>
        <p className="text-white !text-[14px] font-light leading-none">£ {total}</p>
      </div>
    </Link>
  );
}


