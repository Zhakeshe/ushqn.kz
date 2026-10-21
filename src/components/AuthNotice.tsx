import { useCopy } from '../product/useCopy'

export function AuthNotice() {
  const copy = useCopy()
  return (
    <p
      role="alert"
      className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-6 text-amber-900"
    >
      {copy(
        'Вход временно недоступен. Настройки подключения сервиса авторизации ещё не заданы. Попробуйте позже.',
        'Кіру уақытша қолжетімсіз. Авторизация сервисінің байланыс баптаулары әлі берілмеген. Кейінірек қайталап көріңіз.',
        'Sign-in is temporarily unavailable. The authentication connection has not been configured yet. Please try again later.',
      )}
    </p>
  )
}
