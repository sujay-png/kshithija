'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@components/common/CartContext';

export default function BlogPostClient() {
  const router = useRouter();
  const { addItem } = useCart();

  useEffect(() => {
    // Initialize WordPress / Elementor FAQ Accordions inside .blog-content
    const container = document.querySelector('.blog-content');
    if (container) {
      const accordions = container.querySelectorAll('.elementor-accordion, .eael-adv-accordion, .elementor-toggle');
      accordions.forEach((acc) => {
        const items = acc.querySelectorAll('.elementor-accordion-item, .eael-accordion-list, .elementor-toggle-item');
        items.forEach((item) => {
          const header = item.querySelector('.elementor-tab-title, .eael-accordion-header') as HTMLElement | null;
          const content = item.querySelector('.elementor-tab-content, .eael-accordion-content') as HTMLElement | null;
          if (!header || !content) return;

          const toggle = (e: Event) => {
            e.preventDefault();
            const isOpen =
              header.classList.contains('is-active') ||
              header.classList.contains('elementor-active') ||
              header.classList.contains('eael-active');

            if (isOpen) {
              header.classList.remove('is-active', 'elementor-active', 'eael-active');
              item.classList.remove('is-active');
              content.classList.remove('is-active');
              content.style.display = 'none';
              header.setAttribute('aria-expanded', 'false');
            } else {
              header.classList.add('is-active', 'elementor-active', 'eael-active');
              item.classList.add('is-active');
              content.classList.add('is-active');
              content.style.display = 'block';
              header.setAttribute('aria-expanded', 'true');
            }
          };

          header.addEventListener('click', toggle);
        });
      });
    }

    // Buy Now CTA handler
    const handleBuyNow = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const btn = target?.closest('[data-buy-now]') as HTMLElement | null;
      if (!btn) return;
      e.preventDefault();
      const id = btn.getAttribute('data-product-id');
      const name = btn.getAttribute('data-product-name');
      const price = btn.getAttribute('data-product-price') || '₹349';
      const image = btn.getAttribute('data-product-image') || '';

      if (id && name) {
        addItem({ id, name, price, image, quantity: 1 });
        router.push('/checkout');
      } else if (id) {
        router.push(`/product/${id}`);
      }
    };

    document.addEventListener('click', handleBuyNow);
    return () => document.removeEventListener('click', handleBuyNow);
  }, [addItem, router]);

  return null;
}
