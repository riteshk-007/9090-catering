import { cn } from '@/lib/utils'

type EyebrowProps = {
  children: React.ReactNode
  /** "deep" is the darker gold used on light (ivory/sand) backgrounds. */
  tone?: 'gold' | 'deep'
}

/** Small uppercase section label with a fine gold rule. */
export function Eyebrow({ children, tone = 'gold' }: EyebrowProps) {
  return (
    <p
      className={cn(
        'flex items-center gap-4 text-[11px] font-semibold tracking-[0.3em] uppercase',
        tone === 'gold' ? 'text-gold' : 'text-gold-deep',
      )}
    >
      <span aria-hidden className="h-px w-10 bg-current" />
      {children}
    </p>
  )
}
