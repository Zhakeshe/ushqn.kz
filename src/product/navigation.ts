import {
  LayoutDashboard,
  UserRound,
  Medal,
  Trophy,
  Compass,
  Store,
} from 'lucide-react'

export const productNavigation = [
  {
    to: '/home',
    icon: LayoutDashboard,
    label: ['Мой путь', 'Менің жолым', 'My journey'],
  },
  {
    to: '/profile',
    icon: UserRound,
    label: ['Портфолио', 'Портфолио', 'Portfolio'],
  },
  {
    to: '/achievements',
    icon: Medal,
    label: ['Достижения', 'Жетістіктер', 'Achievements'],
  },
  { to: '/rating', icon: Trophy, label: ['Рейтинг', 'Рейтинг', 'Rankings'] },
  {
    to: '/olympiads',
    icon: Trophy,
    label: ['Олимпиады', 'Олимпиадалар', 'Olympiads'],
  },
  {
    to: '/roadmap',
    icon: Compass,
    label: ['Профориентация', 'Кәсіби бағдар', 'Career guidance'],
  },
  {
    to: '/marketplace',
    icon: Store,
    label: ['Маркетплейс', 'Маркетплейс', 'Marketplace'],
  },
] as const
