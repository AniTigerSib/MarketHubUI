import { ApiError } from '@/services/api'

const messages = {
  en: {
    credentials: 'Invalid credentials. Check your username or email and password, then try again.',
    conflict:
      'That username or email is already registered. Try another one, or log in to your account.',
    validation:
      'Please check your details. Use a valid email, a 3–32 character username, and an 8–72 character password.',
    rateLimit: 'Too many attempts. Please wait a few minutes before trying again.',
    connection: 'We couldn’t connect. Check your connection and try again.',
    unavailable: 'Sign-in is temporarily unavailable. Please try again shortly.',
    session: 'Your session has expired. Please log in again.',
    profile:
      'You’re signed in, but we couldn’t load your profile yet. Please try logging in again shortly.',
    unexpected: 'Something went wrong. Please try again.',
    terms: 'Please accept the terms to continue.',
  },
  ru: {
    credentials: 'Неверные данные для входа. Проверьте имя пользователя или почту и пароль.',
    conflict:
      'Это имя пользователя или почта уже зарегистрированы. Укажите другие данные или войдите в свой аккаунт.',
    validation:
      'Проверьте данные: корректная почта, имя пользователя от 3 до 32 символов и пароль от 8 до 72 символов.',
    rateLimit: 'Слишком много попыток. Подождите несколько минут и попробуйте снова.',
    connection: 'Не удалось подключиться. Проверьте соединение и попробуйте снова.',
    unavailable: 'Вход временно недоступен. Попробуйте чуть позже.',
    session: 'Сессия истекла. Войдите снова.',
    profile: 'Вход выполнен, но профиль пока не загрузился. Попробуйте войти снова чуть позже.',
    unexpected: 'Что-то пошло не так. Попробуйте снова.',
    terms: 'Примите условия, чтобы продолжить.',
  },
}

export type AuthErrorKey = keyof typeof messages.en
export function authErrorKey(error: unknown, action: 'signup' | 'login'): AuthErrorKey {
  if (!(error instanceof ApiError)) return 'unexpected'
  if (error.status === 0) return 'connection'
  if (error.status === 429) return 'rateLimit'
  if (error.status >= 500) return 'unavailable'
  if (error.path === '/users/me' && error.status === 404) return 'profile'
  if (error.status === 401 || error.status === 403) {
    return error.status === 401 && error.path === '/auth/login' ? 'credentials' : 'session'
  }
  if (action === 'signup' && error.status === 409) return 'conflict'
  if (error.status === 400) return action === 'signup' ? 'validation' : 'credentials'
  return 'unexpected'
}

export function authErrorMessage(key: AuthErrorKey, lang: 'en' | 'ru'): string {
  return messages[lang][key]
}
