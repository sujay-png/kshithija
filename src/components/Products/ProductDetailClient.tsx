'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@lib/products';
import { useCart } from '@components/common/CartContext';
import InteractiveHoverButton from '@components/ui/InteractiveHoverButton';

interface GrowHairVariant {
  size: string;
  rawSize: '30g' | '70g';
  price: string;
  name: string;
  id: string;
  image: string;
  url: string;
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  isGrowHair: boolean;
  initialGrowHairSize: '30g' | '70g';
  variant30: GrowHairVariant;
  variant70: GrowHairVariant;
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  isGrowHair,
  initialGrowHairSize,
  variant30,
  variant70,
}: ProductDetailClientProps) {
  const { addItem } = useCart();
  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const [mainImage, setMainImage] = useState(galleryImages[0] || product.image);
  const [qty, setQty] = useState(1);
  const [growSize, setGrowSize] = useState<'30g' | '70g'>(initialGrowHairSize);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const activeVariant = isGrowHair ? (growSize === '70g' ? variant70 : variant30) : null;
  const displayTitle = activeVariant ? activeVariant.name : product.name;
  const displayPrice = activeVariant ? activeVariant.price : product.price;
  const displayId = activeVariant ? activeVariant.id : product.id;
  const displayImage = activeVariant ? activeVariant.image : product.image;

  const isWithoutSugar = product.id.includes('without-sugar');
  const isProductOnSale = Boolean(product.onSale || product.badge === 'Sale!');
  const isSoldOut = product.inStock === false || product.badge === 'Sold Out';
  const categoryLabel = product.catalogCategory === 'beauty' ? 'Beauty Products' : 'Wellness Products';
  const categoryHref = product.catalogCategory === 'beauty' ? '/beauty' : '/wellness';

  const handleGrowHairSwitch = (target: '30g' | '70g') => {
    setGrowSize(target);
    const selected = target === '70g' ? variant70 : variant30;
    if (typeof window !== 'undefined' && window.history?.replaceState && selected.url) {
      window.history.replaceState({ size: target }, '', selected.url);
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: displayId,
      name: displayTitle,
      price: displayPrice,
      image: displayImage,
      quantity: qty,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1400);
  };

  return (
    <article className="w-full bg-[#fbf9f4] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-b border-[#e8dfcf]">
      <div className="max-w-7xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8 text-xs text-[#5a6e61]">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="hover:text-[#0c3920] transition-colors">Home</Link></li>
            <li className="text-[#98a89e]">/</li>
            <li><Link href="/products" className="hover:text-[#0c3920] transition-colors">Products</Link></li>
            <li className="text-[#98a89e]">/</li>
            <li><Link href={categoryHref} className="hover:text-[#0c3920] transition-colors">{categoryLabel}</Link></li>
            <li className="text-[#98a89e]">/</li>
            <li className="font-semibold text-[#082213] truncate max-w-xs sm:max-w-md" aria-current="page">
              {displayTitle}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Imagery & Feature Badges */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-white border border-[#e8dfcf] shadow-md group">
              <img
                id="main-product-image"
                src={mainImage}
                alt={displayTitle}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (product.fallbackImage && !target.src.endsWith(product.fallbackImage)) {
                    target.src = product.fallbackImage;
                  }
                }}
              />

              {isProductOnSale && (
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#858012] text-white text-xs font-bold flex items-center justify-center shadow-lg transform rotate-[-4deg] tracking-tight select-none pointer-events-none">
                  Sale!
                </div>
              )}

              {isSoldOut ? (
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs border border-rose-200 px-3 py-1.5 rounded-full shadow-xs flex items-center gap-2 text-xs font-semibold text-rose-700">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Sold Out · Inquire for Next Batch</span>
                </div>
              ) : (
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs border border-[#e0ede3] px-3 py-1.5 rounded-full shadow-xs flex items-center gap-2 text-xs font-semibold text-[#1c643b]">
                  <span className="w-2 h-2 rounded-full bg-[#2ea843] animate-pulse" />
                  <span>In Stock · Ships from Mangaluru</span>
                </div>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-[#5a6e61] uppercase tracking-wider">
                    Product Gallery ({galleryImages.length} photos)
                  </span>
                  <span className="text-[11px] text-[#8fa196]">Click to view</span>
                </div>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                  {galleryImages.map((imgSrc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMainImage(imgSrc)}
                      className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 bg-white transition-all cursor-pointer focus:outline-none ${
                        mainImage === imgSrc ? 'border-[#1c643b] ring-2 ring-[#1c643b]/30' : 'border-[#e8dfcf] hover:border-[#1c643b]'
                      }`}
                      aria-label={`View photo ${idx + 1} of ${product.name}`}
                    >
                      <img src={imgSrc} alt={`${product.name} photo ${idx + 1}`} className="w-full h-full object-cover object-center" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.badgeIcons && product.badgeIcons.length > 0 ? (
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                {product.badgeIcons.map((b, idx) => (
                  <div key={idx} className="bg-white border border-[#e8dfcf] p-3 rounded-2xl shadow-2xs flex flex-col items-center justify-center">
                    <div className="w-10 h-10 mb-1.5 flex items-center justify-center">
                      <img src={b.image} alt={b.title} className="max-w-full max-h-full object-contain" loading="lazy" />
                    </div>
                    <span className="text-xs font-bold text-[#082213] block leading-tight">{b.title}</span>
                    {b.subtitle && <span className="text-[10px] text-[#55695b] leading-tight block mt-0.5">{b.subtitle}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="bg-white border border-[#e8dfcf] p-3 rounded-2xl shadow-2xs">
                  <span className="text-xl block mb-1">🌿</span>
                  <span className="text-xs font-bold text-[#082213] block">No Added Chemicals</span>
                  <span className="text-[10px] text-[#55695b] leading-tight block mt-0.5">Zero parabens &amp; toxins</span>
                </div>
                <div className="bg-white border border-[#e8dfcf] p-3 rounded-2xl shadow-2xs">
                  <span className="text-xl block mb-1">📦</span>
                  <span className="text-xs font-bold text-[#082213] block">Hygienically Packed</span>
                  <span className="text-[10px] text-[#55695b] leading-tight block mt-0.5">Sealed at Mangaluru</span>
                </div>
                <div className="bg-white border border-[#e8dfcf] p-3 rounded-2xl shadow-2xs">
                  <span className="text-xl block mb-1">{isWithoutSugar ? '🚫' : '⚡'}</span>
                  <span className="text-xs font-bold text-[#082213] block">
                    {isWithoutSugar ? 'No Added Sugar' : 'Quick Absorption'}
                  </span>
                  <span className="text-[10px] text-[#55695b] leading-tight block mt-0.5">
                    {isWithoutSugar ? 'Zero sugar additives' : 'Non-greasy nourishment'}
                  </span>
                </div>
                <div className="bg-white border border-[#e8dfcf] p-3 rounded-2xl shadow-2xs">
                  <span className="text-xl block mb-1">🛡️</span>
                  <span className="text-xs font-bold text-[#082213] block">Rich in Antioxidants</span>
                  <span className="text-[10px] text-[#55695b] leading-tight block mt-0.5">Pure botanical potency</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Info, Variants & Accordions */}
          <div className="lg:col-span-6 flex flex-col justify-start text-left">
            <div className="flex items-center gap-2.5 mb-2.5">
              <Link
                href={categoryHref}
                className="inline-flex items-center px-3 py-1 rounded-full bg-[#eaf4ed] text-[#1c643b] text-xs font-semibold tracking-wider uppercase hover:bg-[#dcefe2] transition-colors"
              >
                {product.category}
              </Link>
              {product.badge && product.badge !== 'Sale!' && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#082213] text-white text-[11px] font-semibold tracking-wide">
                  ★ {product.badge}
                </span>
              )}
              {isProductOnSale && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#858012] text-white text-[11px] font-bold tracking-wide">
                  Special Offer
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-[#082213] leading-tight tracking-tight mb-2">
              {displayTitle}
            </h1>

            {product.subtitle && (
              <p className="text-sm font-semibold text-[#1c643b] tracking-wide mb-3">{product.subtitle}</p>
            )}

            <div className="p-4 sm:p-5 rounded-2xl bg-[#f4ede0] border border-[#e5dec9] mb-4 shadow-2xs">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-[#55695b] uppercase font-semibold block mb-0.5">
                    ( MRP Inclusive of Taxes )
                  </span>
                  <div className="flex items-center gap-3">
                    {product.originalPrice && isProductOnSale ? (
                      <>
                        <span className="text-base text-gray-400 line-through font-normal">{product.originalPrice}</span>
                        <span className="text-2xl sm:text-3xl font-bold text-[#082213] underline underline-offset-4">
                          {displayPrice}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#858012]/15 text-[#6c670a] text-xs font-bold">
                          Special Sale
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl sm:text-3xl font-bold text-[#082213]">{displayPrice}</span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-[#55695b] uppercase font-semibold block mb-1">Pack Size</span>
                  {isGrowHair ? (
                    <div className="inline-flex p-1 rounded-xl bg-white/90 border border-[#ded5c5] shadow-2xs gap-1">
                      {(['30g', '70g'] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => handleGrowHairSwitch(sz)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer select-none ${
                            growSize === sz ? 'bg-[#0c3920] text-white shadow-xs' : 'text-[#082213] hover:bg-[#faf6ee]'
                          }`}
                        >
                          {sz === '30g' ? '30 g' : '70 g'}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="inline-block bg-white border border-[#ded5c5] px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#082213] shadow-2xs">
                      {product.size || 'Standard'}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3.5 pt-3 border-t border-[#e5dec9] grid grid-cols-3 gap-2 text-center text-[11px] text-[#3e5044] font-medium">
                <div className="flex items-center justify-center gap-1.5">
                  <span>💳</span>
                  <span>Secure &amp; Easy Payment</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <span>🔬</span>
                  <span>Lab Tested</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <span>🏷️</span>
                  <span>Lowest Price</span>
                </div>
              </div>
            </div>

            {isGrowHair && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#faf7f2] border border-[#ded5c5] mb-4 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0c3920] flex items-center gap-1.5">
                    Select Pack Size:
                  </span>
                  <span className="text-[11px] text-[#55695b] font-medium">
                    {growSize === '30g' ? `30 g Selected (${variant30.price})` : `70 g Selected (${variant70.price})`}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleGrowHairSwitch('30g')}
                    className={`flex flex-col p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer relative ${
                      growSize === '30g'
                        ? 'border-[#0c3920] bg-white ring-2 ring-[#0c3920]/25 shadow-xs'
                        : 'border-[#ded5c5] bg-[#fdfbf7] hover:border-[#1c643b] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-0.5">
                      <span className="font-bold text-sm text-[#082213]">30 g</span>
                      <span className="text-xs font-bold text-[#0c3920]">{variant30.price}</span>
                    </div>
                    <span className="text-[11px] text-[#55695b]">Standard Jar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGrowHairSwitch('70g')}
                    className={`flex flex-col p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer relative ${
                      growSize === '70g'
                        ? 'border-[#0c3920] bg-white ring-2 ring-[#0c3920]/25 shadow-xs'
                        : 'border-[#ded5c5] bg-[#fdfbf7] hover:border-[#1c643b] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-0.5">
                      <span className="font-bold text-sm text-[#082213]">70 g</span>
                      <span className="text-xs font-bold text-[#0c3920]">{variant70.price}</span>
                    </div>
                    <span className="text-[11px] text-[#55695b]">Family Value Jar</span>
                  </button>
                </div>
              </div>
            )}

            {/* Order Actions */}
            <div className="space-y-3 pt-4 border-t border-[#e8dfcf] mb-8">
              {isSoldOut ? (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-sm mb-1">
                    <span className="text-base">📦</span>
                    <span>Currently Sold Out</span>
                  </div>
                  <p className="text-xs text-[#3e5044] leading-relaxed">
                    This item is currently sold out in our online inventory. You can inquire or pre-order directly via WhatsApp or phone for upcoming batch availability and priority dispatch from our Mangaluru store.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center border border-[#ded5c5] rounded-xl bg-white overflow-hidden shrink-0 h-12 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="px-3.5 h-full text-base font-bold text-[#082213] hover:bg-[#f4ede0] transition-colors cursor-pointer select-none"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={qty}
                      readOnly
                      className="w-12 text-center text-sm font-bold text-[#082213] border-0 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.min(99, q + 1))}
                      className="px-3.5 h-full text-base font-bold text-[#082213] hover:bg-[#f4ede0] transition-colors cursor-pointer select-none"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 h-12 rounded-xl bg-[#0c3920] hover:bg-[#15502e] active:scale-95 text-white text-sm font-bold tracking-wide transition-all duration-200 shadow-md hover:shadow-xl cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>{addedFeedback ? '✓ Added!' : 'Add to Cart'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Accordions */}
            <div className="mb-6 space-y-3">
              {product.specifications && (
                <details className="group bg-white rounded-2xl border border-[#e8dfcf] p-4 sm:p-5 shadow-2xs open:border-[#1c643b]" open>
                  <summary className="flex items-center justify-between font-serif font-medium text-[#082213] text-base cursor-pointer list-none select-none">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">📋</span>
                      <span>Specifications &amp; Details</span>
                    </span>
                    <span className="transition-transform duration-200 group-open:rotate-180 text-xs text-[#5a6e61]">▼</span>
                  </summary>

                  <div className="mt-4 pt-3 border-t border-[#e8dfcf] text-xs sm:text-[13px] text-[#3e5044]">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="p-2 rounded-lg bg-[#faf7f2] border border-[#ded5c5]/60">
                          <span className="font-bold text-[#082213] block mb-0.5">{key}</span>
                          <span className="text-[#55695b]">{value}</span>
                        </div>
                      ))}
                    </div>

                    {product.additionalFeatures && product.additionalFeatures.length > 0 && (
                      <div className="mt-3 p-3 rounded-xl bg-[#eaf4ed]/60 border border-[#cbe1d2]">
                        <span className="font-bold text-[#0c3920] block mb-1.5 uppercase text-[11px] tracking-wider">
                          Additional Features &amp; Care
                        </span>
                        <ul className="space-y-1 list-disc list-inside text-[#3e5044]">
                          {product.additionalFeatures.map((feat, idx) => (
                            <li key={idx}>{feat}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {product.detailedIngredients && product.detailedIngredients.length > 0 && (
                <details className="group bg-white rounded-2xl border border-[#e8dfcf] p-4 sm:p-5 shadow-2xs open:border-[#1c643b]">
                  <summary className="flex items-center justify-between font-serif font-medium text-[#082213] text-base cursor-pointer list-none select-none">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">🌿</span>
                      <span>Active Botanical Ingredients ({product.detailedIngredients.length})</span>
                    </span>
                    <span className="transition-transform duration-200 group-open:rotate-180 text-xs text-[#5a6e61]">▼</span>
                  </summary>

                  <div className="mt-4 pt-3 border-t border-[#e8dfcf]">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {product.detailedIngredients.map((ing, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center text-center p-3 rounded-xl bg-[#faf7f2] border border-[#ded5c5]/60 hover:shadow-xs transition-shadow"
                        >
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-white mb-2 p-1 border border-[#e8dfcf]">
                            <img src={ing.image} alt={ing.name} className="w-full h-full object-cover rounded-md" loading="lazy" />
                          </div>
                          <span className="text-xs font-bold text-[#082213] leading-snug">{ing.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              )}

              {product.whyItWorks && (
                <details className="group bg-white rounded-2xl border border-[#e8dfcf] p-4 sm:p-5 shadow-2xs open:border-[#1c643b]">
                  <summary className="flex items-center justify-between font-serif font-medium text-[#082213] text-base cursor-pointer list-none select-none">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">💡</span>
                      <span>Why {product.name.split('-')[0].trim()}</span>
                    </span>
                    <span className="transition-transform duration-200 group-open:rotate-180 text-xs text-[#5a6e61]">▼</span>
                  </summary>

                  <div className="mt-4 pt-3 border-t border-[#e8dfcf] text-xs sm:text-[13.5px] text-[#3e5044] leading-relaxed space-y-2.5">
                    {product.whyItWorks.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </details>
              )}
            </div>

            {product.highlights && product.highlights.length > 0 && (
              <div className="mb-6 p-5 rounded-2xl bg-white border border-[#e8dfcf] shadow-2xs">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#1c643b] mb-3.5 flex items-center gap-2">
                  <span>About Product</span>
                  <span className="h-px flex-1 bg-[#e8dfcf]" />
                </h2>
                <ul className="space-y-2.5">
                  {product.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13.5px] text-[#3e5044] leading-relaxed">
                      <span className="text-[#1c643b] font-bold shrink-0 mt-0.5">✔</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-20 pt-12 border-t border-[#e8dfcf]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#eaf4ed] text-[#1c643b] text-xs font-semibold tracking-wider uppercase mb-2">
                  Curated Selection
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#082213]">
                  Complementary Formulations
                </h2>
              </div>
              <InteractiveHoverButton href="/products" text="Explore More" className="self-start sm:self-auto" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="group flex flex-col items-center text-center bg-white rounded-2xl p-4 sm:p-5 border border-[#e8dfcf] shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#faf7f2] mb-3.5 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    {(item.onSale || item.badge === 'Sale!') && (
                      <div className="absolute top-2 right-2 w-9 h-9 rounded-full bg-[#858012] text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                        Sale!
                      </div>
                    )}
                  </div>

                  <h3 className="text-xs sm:text-[13px] font-semibold text-[#0c2a1a] leading-snug line-clamp-2 min-h-[36px] flex items-center justify-center mb-1.5 px-1 group-hover:text-[#1c643b] transition-colors">
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-center gap-1.5 mb-3">
                    {item.originalPrice && item.onSale ? (
                      <>
                        <span className="text-xs text-gray-400 line-through">{item.originalPrice}</span>
                        <span className="text-xs sm:text-sm font-bold text-[#0c2a1a] underline">{item.price}</span>
                      </>
                    ) : (
                      <span className="text-xs sm:text-sm font-bold text-[#0c2a1a]">{item.price}</span>
                    )}
                  </div>

                  <span className="mt-auto inline-flex items-center justify-center px-4 py-1.5 rounded-md bg-[#f4ede0] group-hover:bg-[#0c3920] group-hover:text-white text-[#082213] text-xs font-semibold tracking-wide transition-all">
                    View Details →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
