import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { history } from 'src/routes/routes'
import { switchNetworkWithUrl } from '../history'

//TODO: Tests are breaking because now relying on dispatch
describe('switchNetworkWithUrl', () => {
  it.skip('does not switch the network when there is no shortName in the url', () => {
    // const setNetworkMock = jest.spyOn(utils, 'setNetwork')
    // history.push(`/rin:${ZERO_ADDRESS}`)
    // switchNetworkWithUrl({ pathname: '/welcome' })
    // expect(setNetworkMock).not.toHaveBeenCalled()
  })
  it.skip('does not switch the network when the shortName has not changed', () => {
    // const setNetworkMock = jest.spyOn(utils, 'setNetwork')
    // const pathname = `/rin:${ZERO_ADDRESS}`
    // history.push(pathname)
    // switchNetworkWithUrl({ pathname })
    // expect(setNetworkMock).not.toHaveBeenCalled()
  })
  it.skip('switches the network when the shortName changes', () => {
    // const setNetworkMock = jest.spyOn(utils, 'setNetwork')
    // history.push(`/eth:${ZERO_ADDRESS}`)
    // switchNetworkWithUrl({ pathname: `/xdai:${ZERO_ADDRESS}` })
    // expect(setNetworkMock).toHaveBeenCalled()
  })
})
