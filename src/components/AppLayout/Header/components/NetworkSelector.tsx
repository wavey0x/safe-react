import { ReactElement, useRef, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import List from '@material-ui/core/List'
import Popper from '@material-ui/core/Popper'
import IconButton from '@material-ui/core/IconButton'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { Divider, Icon } from '@gnosis.pm/safe-react-components'

import NetworkLabel from './NetworkLabel'
import Col from 'src/components/layout/Col'
import { screenSm, sm } from 'src/theme/variables'
import { ReturnValue } from 'src/logic/hooks/useStateHandler'
import { NETWORK_ROOT_ROUTES } from 'src/routes/routes'
import { useSelector } from 'react-redux'
import { currentNetworkId, getNetworkById } from 'src/logic/config/store/selectors'
import { ETHEREUM_NETWORK } from 'src/types/network.d'
import { AppReduxState } from 'src/store'

const styles = {
  root: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',

    [`@media (min-width: ${screenSm}px)`]: {
      flexBasis: '180px',
      marginRight: '20px',
    },
  },
  networkList: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    flex: '1 1 auto',
    justifyContent: 'space-between',
    [`@media (min-width: ${screenSm}px)`]: {
      paddingRight: sm,
    },
  },
  expand: {
    height: '30px',
    width: '30px',
  },
  popper: {
    zIndex: 1301,
  },
  network: {
    backgroundColor: 'white',
    borderRadius: sm,
    boxShadow: '0 0 10px 0 rgba(33, 48, 77, 0.1)',
    marginTop: '11px',
    minWidth: '180px',
    padding: '0',
  },
}

const useStyles = makeStyles(styles)

const StyledLink = styled.a`
  margin: 0;
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  padding: 14px 16px 14px 0;

  :hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`
const StyledDivider = styled(Divider)`
  margin: 0;
`

type NetworkSelectorProps = ReturnValue

const NetworkSelector = ({ open, toggle, clickAway }: NetworkSelectorProps): ReactElement => {
  const networkRef = useRef(null)
  const classes = useStyles()

  return (
    <>
      <div className={classes.root} ref={networkRef}>
        <Col className={classes.networkList} end="sm" middle="xs" onClick={toggle}>
          <NetworkLabel />
          <IconButton className={classes.expand} disableRipple>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Col>
        <Divider />
      </div>
      <Popper
        anchorEl={networkRef.current}
        className={classes.popper}
        open={open}
        placement="bottom"
        popperOptions={{ positionFixed: true }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <>
              <ClickAwayListener mouseEvent="onClick" onClickAway={clickAway} touchEvent={false}>
                <List className={classes.network} component="div">
                  {NETWORK_ROOT_ROUTES.map((route) => (
                    <Network key={route.id} route={route} clickAway={clickAway} />
                  ))}
                </List>
              </ClickAwayListener>
            </>
          </Grow>
        )}
      </Popper>
    </>
  )
}

const Network = ({
  route,
  clickAway,
}: { route: typeof NETWORK_ROOT_ROUTES[number] } & Pick<NetworkSelectorProps, 'clickAway'>) => {
  const history = useHistory()
  const networkId = useSelector(currentNetworkId)
  const routeChainInfo = useSelector((state: AppReduxState) => getNetworkById(state, route.id))

  const onNetworkSwitch = useCallback(
    (e: React.SyntheticEvent, networkId: ETHEREUM_NETWORK) => {
      e.preventDefault()
      clickAway()

      const newRoute = NETWORK_ROOT_ROUTES.find(({ id }) => id === networkId)
      if (newRoute) {
        history.push(newRoute.route)
      }
    },
    [clickAway, history],
  )

  return (
    <>
      <StyledLink onClick={(e) => onNetworkSwitch(e, route.id)} href={route.route}>
        <NetworkLabel chainInfo={routeChainInfo} />
        {networkId === route.id && <Icon type="check" size="md" color="primary" />}
      </StyledLink>
      <StyledDivider />
    </>
  )
}

export default NetworkSelector
