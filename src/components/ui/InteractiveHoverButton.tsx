import Link from 'next/link';

interface InteractiveHoverButtonProps {
  href?: string;
  text?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export default function InteractiveHoverButton({
  href = '/products',
  text = 'Explore More',
  className = '',
  type = 'button',
  onClick,
}: InteractiveHoverButtonProps) {
  const classes = `group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[#0d2a1b] bg-white px-6 py-2.5 text-center text-xs font-semibold tracking-widest uppercase text-[#0d2a1b] shadow-2xs transition-all duration-300 hover:shadow-md cursor-pointer select-none ${className}`;

  const inner = (
    <>
      <span className="inline-block translate-x-0 pl-2 transition-all duration-300 group-hover:translate-x-full group-hover:opacity-0">
        {text}
      </span>
      <div className="absolute inset-0 z-10 flex h-full w-full translate-x-full items-center justify-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <span>{text}</span>
        <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
      <div className="absolute left-3.5 top-1/2 h-2 w-2 -translate-y-1/2 scale-100 rounded-full bg-[#0d2a1b] transition-all duration-300 group-hover:left-0 group-hover:top-0 group-hover:h-full group-hover:w-full group-hover:translate-y-0 group-hover:scale-[2.5]" />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {inner}
    </button>
  );
}
