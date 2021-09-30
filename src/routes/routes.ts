import { createBrowserHistory } from 'history'

import { getNetworkLabel } from 'src/config'
import { PUBLIC_URL } from 'src/utils/constants'

export const history = createBrowserHistory({
  basename: PUBLIC_URL,
})

export const getNetworkSlug = (): string => {
  return getNetworkLabel().toLowerCase()
}

export const ROOT_ROUTE = '/:network'
export const WELCOME_ROUTE = `${ROOT_ROUTE}/welcome`
export const OPEN_ROUTE = `${ROOT_ROUTE}/open`
export const LOAD_ROUTE = `${ROOT_ROUTE}/load`

export const BASE_SAFE_ROUTE = `${ROOT_ROUTE}/safes/:safeAddress`

export const SAFE_ROUTES = {
  ASSETS_BALANCES: `${BASE_SAFE_ROUTE}/balances`,
  ASSETS_COLLECTIBLES: `${BASE_SAFE_ROUTE}/balances/collectibles`,
  TRANSACTIONS: `${BASE_SAFE_ROUTE}/transactions`,
  ADDRESS_BOOK: `${BASE_SAFE_ROUTE}/address-book`,
  APPS: `${BASE_SAFE_ROUTE}/apps`,
  SETTINGS_BASE_ROUTE: `${BASE_SAFE_ROUTE}/settings`,
  SETTINGS_DETAILS: `${BASE_SAFE_ROUTE}/settings/details`,
  SETTINGS_OWNERS: `${BASE_SAFE_ROUTE}/settings/owners`,
  SETTINGS_POLICIES: `${BASE_SAFE_ROUTE}/settings/policies`,
  SETTINGS_SPENDING_LIMIT: `${BASE_SAFE_ROUTE}/settings/spending-limit`,
  SETTINGS_ADVANCED: `${BASE_SAFE_ROUTE}/settings/advanced`,
}
