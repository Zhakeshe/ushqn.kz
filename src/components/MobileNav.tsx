import { NavLink } from 'react-router-dom'
import { productNavigation } from '../product/navigation'
import { useCopy } from '../product/useCopy'

export function MobileNav() {
  const copy = useCopy()
  return (
    <nav
      aria-label={copy(
        'Основные разделы',
        'Негізгі бөлімдер',
        'Main navigation',
      )}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-ushqn-border)] bg-[var(--color-ushqn-surface)]/95 px-1 backdrop-blur-lg lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex overflow-x-auto">
        {productNavigation
          .filter((x) => x.to !== '/achievements')
          .map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex min-w-[68px] flex-1 flex-col items-center justify-center gap-1 px-1 py-3 text-[9px] font-semibold ${isActive ? 'text-violet-600' : 'text-[var(--color-ushqn-muted)]'}`
              }
            >
              <Icon size={19} />
              <span>{copy(label[0], label[1], label[2])}</span>
            </NavLink>
          ))}
      </div>
    </nav>
  )
}
