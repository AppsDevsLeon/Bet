'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useMemo} from 'react';

const LOCALES = ['es', 'en'] as const;

export default function LanguageSwitcher() {
  const pathname = usePathname() || '/es';
  const current = pathname.split('/')[1] as 'es' | 'en';

  const basePath = useMemo(
    () => pathname.replace(/^\/(es|en)/, ''), 
    [pathname]
  );

  return (
    <div style={{display:'flex', gap:8}}>
      {LOCALES.map(l => (
        <Link key={l} href={`/${l}${basePath}`} prefetch>
          <button
            style={{
              padding:'6px 10px',
              borderRadius:8,
              border:'1px solid rgba(var(--n2))',
              background: l===current ? 'rgb(var(--highlight))' : 'rgb(var(--p2))',
              color: l===current ? 'rgb(var(--p1))' : 'rgb(var(--n5))'
            }}
          >
            {l.toUpperCase()}
          </button>
        </Link>
      ))}
    </div>
  );
}
