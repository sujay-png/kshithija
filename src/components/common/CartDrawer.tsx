'use client';

import Link from 'next/link';
import { useCart } from './CartContext';

export default function CartDrawer() {
  const { items, isOpen, totalQty, subtotal, updateQty, removeItem, close } = useCart();

  return (
    <>
      {/* Cart Drawer Backdrop Overlay */}
      <div
        id="cart-drawer-backdrop"
        onClick={close}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-[999998] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Cart Drawer Slide-out Panel */}
      <aside
        id="cart-drawer-panel"
        className={`fixed top-0 right-0 bottom-0 w-full max-w-[430px] bg-[#fffdf8] shadow-2xl z-[999999] transform transition-transform duration-300 ease-out flex flex-col border-l border-[#ded5c5] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 bg-[#fbf9f4] border-b border-[#e8dfcf] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#183e2a] text-white flex items-center justify-center text-sm shadow-xs">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h2 id="cart-drawer-title" className="text-base sm:text-lg font-serif font-bold text-[#082213]">
                Your Shopping Cart
              </h2>
              <p className="text-[11px] text-[#627568]">
                <span id="cart-drawer-count">{totalQty}</span> items in basket
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-cart-btn"
            onClick={close}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#eee8db] border border-[#ded5c5] text-[#082213] flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
            aria-label="Close Shopping Cart"
          >
            &times;
          </button>
        </div>

        {/* Free Shipping Notification Bar */}
        <div className="bg-[#eaf4ed] px-5 py-2.5 border-b border-[#d2e6d8] flex items-center gap-2 text-xs text-[#1c643b]" />

        {/* Cart Items List */}
        {items.length > 0 ? (
          <div id="cart-items-container" className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {items.map((item) => (
              <div
                key={String(item.id)}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-[#ded5c5] shadow-xs"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover bg-[#f4ede0] shrink-0 border border-[#e8dfcf]"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-[#082213] truncate">{item.name}</h4>
                  <p className="text-xs font-bold text-[#1c643b] mt-0.5">{item.price}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="inline-flex items-center border border-[#ded5c5] rounded-lg bg-[#faf8f4]">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, -1)}
                        className="px-2 py-0.5 text-xs font-bold text-[#082213] hover:bg-[#eee8db] transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-semibold text-[#082213]">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, 1)}
                        className="px-2 py-0.5 text-xs font-bold text-[#082213] hover:bg-[#eee8db] transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-[11px] text-red-600 hover:underline cursor-pointer ml-auto"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div id="cart-empty-state" className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#f4ede0] text-3xl flex items-center justify-center mb-3">
              🛍️
            </div>
            <h3 className="text-base font-serif font-bold text-[#082213] mb-1">Your cart is empty</h3>
            <p className="text-xs text-[#627568] max-w-xs mb-5">
              Discover our natural herbal skincare, anti-dandruff creams, and vitality supplements.
            </p>
            <Link
              href="/products"
              onClick={close}
              className="px-5 py-2.5 rounded-xl bg-[#0c3920] hover:bg-[#164e2d] text-white text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Explore Products
            </Link>
          </div>
        )}

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div id="cart-footer" className="p-5 sm:p-6 bg-white border-t border-[#e8dfcf] space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#55695b] font-medium">Subtotal</span>
              <span id="cart-subtotal-price" className="text-xl font-bold font-serif text-[#082213]">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <p className="text-[11px] text-[#7a8c80]">
              Taxes and delivery calculated at checkout. WhatsApp ordering available.
            </p>

            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={close}
                className="relative w-full inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-semibold text-gray-900 rounded-xl group bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 hover:text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <span className="relative w-full px-5 py-3 transition-all ease-in duration-150 bg-white group-hover:bg-transparent rounded-[10px] flex items-center justify-center gap-2 font-bold tracking-wide">
                  <span>Checkout</span>
                  <span className="opacity-40">•</span>
                  <span id="cart-checkout-amount">₹{subtotal.toLocaleString('en-IN')}</span>
                </span>
              </Link>

              <Link
                href="/cart"
                onClick={close}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-[#f4ede0] hover:bg-[#eae0cf] text-[#0a1c12] border border-[#ded5c5] text-xs font-semibold transition-all text-center cursor-pointer"
              >
                <span>View Cart</span>
                <span>&rarr;</span>
              </Link>

              <button
                type="button"
                id="cart-continue-btn"
                onClick={close}
                className="w-full py-2.5 text-center text-xs font-semibold text-[#1c643b] hover:text-[#082213] hover:underline transition-colors cursor-pointer"
              >
                Continue Shopping &rarr;
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
