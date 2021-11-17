import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import memoize from 'lodash.memoize'
import { currentExporerUriTemplate } from 'src/logic/config/store/selectors'
import { store } from 'src/store'
import { ETHERSCAN_API_KEY } from 'src/utils/constants'

// No longer used after migrating config to store
// export const getCurrentEnvironment = (): 'test' | 'production' | 'dev' => {
//   switch (APP_ENV) {
//     case 'test': {
//       return 'test'
//     }
//     case 'production': {
//       return 'production'
//     }
//     case 'dev':
//     default: {
//       // We need to check NODE_ENV calling jest outside of scripts
//       return NODE_ENV === 'test' ? 'test' : 'dev'
//     }
//   }
// }

const fetchContractABI = memoize(
  async (url: ChainInfo['blockExplorerUriTemplate']['api'], contractAddress: string, apiKey?: string) => {
    const apiUrl = url
      .replace('{{module}}', 'contract')
      .replace('{{action}}', 'getAbi')
      .replace('{{address}}', contractAddress)
      .replace(apiKey ? '{{apiKey}}' : '&apiKey={{apiKey}}', apiKey || '')

    const response = await fetch(apiUrl)

    if (!response.ok) {
      return { status: 0, result: [] }
    }

    return response.json()
  },
  (url, contractAddress) => `${url}_${contractAddress}`,
)

const getExplorerApiKey = (blockExplorer: string): string | undefined =>
  blockExplorer.includes('etherscan') ? ETHERSCAN_API_KEY : undefined

export const getContractABI = async (contractAddress: string): Promise<any> => {
  const blockExplorerUriTemplate = currentExporerUriTemplate(store.getState())

  if (!blockExplorerUriTemplate) return undefined

  const { api } = blockExplorerUriTemplate

  const apiKey = getExplorerApiKey(api)

  try {
    const { result, status } = await fetchContractABI(api, contractAddress, apiKey)

    if (status === '0') {
      return []
    }

    return result
  } catch (e) {
    console.error('Failed to retrieve ABI', e)
    return undefined
  }
}