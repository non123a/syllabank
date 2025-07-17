// routes
import { PATH_AUTH, PATH_DASHBOARD } from './routes/paths'

// API
// ----------------------------------------------------------------------

export const apiPath = process.env.NEXT_PUBLIC_API_PATH
export const authPath = process.env.NEXT_PUBLIC_AUTH_PATH
export const fortifyPath = process.env.NEXT_PUBLIC_FORTIFY_PATH

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = PATH_DASHBOARD.rootAlt
export const PATH_AFTER_VERIFY = PATH_AUTH.twoFactor

// LAYOUT
// ----------------------------------------------------------------------

export const HEADER = {
  MOBILE_HEIGHT: 64,
  MAIN_DESKTOP_HEIGHT: 88,
  DASHBOARD_DESKTOP_HEIGHT: 92,
  DASHBOARD_DESKTOP_OFFSET_HEIGHT: 92 - 32
}

export const NAVBAR = {
  BASE_WIDTH: 260,
  DASHBOARD_WIDTH: 280,
  DASHBOARD_COLLAPSE_WIDTH: 88,
  //
  DASHBOARD_ITEM_ROOT_HEIGHT: 48,
  DASHBOARD_ITEM_SUB_HEIGHT: 40,
  DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32
}

export const ICON = {
  NAVBAR_ITEM: 22,
  NAVBAR_ITEM_HORIZONTAL: 20
}

// SETTINGS
// ----------------------------------------------------------------------

export const cookiesExpires = 3

export const cookiesKey = {
  themeMode: 'themeMode',
  themeDirection: 'themeDirection',
  themeColorPresets: 'themeColorPresets',
  themeLayout: 'themeLayout',
  themeStretch: 'themeStretch'
}

export const defaultSettings = {
  themeMode: 'light',
  themeDirection: 'ltr',
  themeColorPresets: 'default',
  themeLayout: 'horizontal',
  themeStretch: true
}

export const authConfig = {
  registerPath: `/auth/register`,
  loginPath: `/login`,
  logoutPath: `/auth/logout`,
  forgotPasswordPath: `/auth/forgot-password`,
  resetPasswordPath: `/auth/reset-password`,
  setPasswordPath: `/auth/set-password`,
  verify2FAPath: `/two-factor-challenge`,
  csrfTokenPath: `/sanctum/csrf-cookie`,
  mePath: `/me`
}

export const settingConfig = {
  changePasswordPath: `/auth/change-password`,
  confirmPasswordPath: `/user/confirm-password`,
  confirmedPasswordStatusPath: `/user/confirmed-password-status`,
  enableTwoFactorPath: `/user/two-factor-authentication`,
  disableTwoFactorPath: `/user/two-factor-authentication`,
  getQrCodePath: `/user/two-factor-qr-code`,
  getRecoveryCodesPath: `/user/two-factor-recovery-codes`,
  regenerateRecoveryCodesPath: `user/two-factor-recovery-codes`
}

export const calendarConfig = {
  firstday: 1,
  minTime: '07:00:00',
  maxTime: '22:00:00',
  slotDuration: '00:30:00',
  labelInterval: '01:00:00',
  weekends: true
}
