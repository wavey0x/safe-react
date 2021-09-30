import { Breadcrumb, BreadcrumbElement, Loader, Icon, Menu } from '@gnosis.pm/safe-react-components'
import { LoadingContainer } from 'src/components/LoaderContainer'
import { makeStyles } from '@material-ui/core/styles'
import { useState, lazy } from 'react'
import { useSelector } from 'react-redux'
import { generatePath, Route, Switch, useRouteMatch } from 'react-router-dom'
import { styles } from './style'
import { SAFE_ROUTES, getNetworkSlug, BASE_SAFE_ROUTE } from 'src/routes/routes'
import Block from 'src/components/layout/Block'
import ButtonLink from 'src/components/layout/ButtonLink'
import Col from 'src/components/layout/Col'
import Span from 'src/components/layout/Span'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'

const Advanced = lazy(() => import('./Advanced'))
const SpendingLimitSettings = lazy(() => import('./SpendingLimit'))
const ManageOwners = lazy(() => import('./ManageOwners'))
const RemoveSafeModal = lazy(() => import('./RemoveSafeModal'))
const SafeDetails = lazy(() => import('./SafeDetails'))
const ThresholdSettings = lazy(() => import('./ThresholdSettings'))

export const OWNERS_SETTINGS_TAB_TEST_ID = 'owner-settings-tab'

const INITIAL_STATE = {
  showRemoveSafe: false,
}

const useStyles = makeStyles(styles)

const Settings = (): React.ReactElement => {
  const classes = useStyles()
  const [state, setState] = useState(INITIAL_STATE)
  const { address: safeAddress, owners, loadedViaUrl } = useSelector(currentSafeWithNames)
  const granted = useSelector(grantedSelector)
  const matchSafeWithAction = useRouteMatch({
    path: `${BASE_SAFE_ROUTE}/:safeAction/:safeSubaction?`,
  }) as {
    url: string
    params: Record<string, string>
  }

  const baseRouteSlugs = {
    network: getNetworkSlug(),
    safeAddress,
  }

  let settingsSection
  switch (matchSafeWithAction.url) {
    case generatePath(SAFE_ROUTES.SETTINGS_DETAILS, baseRouteSlugs):
      settingsSection = 'Safe Details'
      break
    case generatePath(SAFE_ROUTES.SETTINGS_OWNERS, baseRouteSlugs):
      settingsSection = 'Owners'
      break
    case generatePath(SAFE_ROUTES.SETTINGS_POLICIES, baseRouteSlugs):
      settingsSection = 'Policies'
      break
    case generatePath(SAFE_ROUTES.SETTINGS_SPENDING_LIMIT, baseRouteSlugs):
      settingsSection = 'Spending Limit'
      break
    case generatePath(SAFE_ROUTES.SETTINGS_ADVANCED, baseRouteSlugs):
      settingsSection = 'Advanced'
      break
    default:
      settingsSection = ''
  }

  const onShow = (action) => () => {
    setState((prevState) => ({ ...prevState, [`show${action}`]: true }))
  }

  const onHide = (action) => () => {
    setState((prevState) => ({ ...prevState, [`show${action}`]: false }))
  }

  const { showRemoveSafe } = state

  return !owners ? (
    <LoadingContainer>
      <Loader size="md" />
    </LoadingContainer>
  ) : (
    <>
      <Menu>
        <Col start="sm" sm={6} xs={12}>
          <Breadcrumb>
            <BreadcrumbElement iconType="settings" text="SETTINGS" />
            <BreadcrumbElement text={settingsSection} color="placeHolder" />
          </Breadcrumb>
        </Col>
        {!loadedViaUrl ? (
          <Col end="sm" sm={6} xs={12}>
            <ButtonLink className={classes.removeSafeBtn} color="error" onClick={onShow('RemoveSafe')} size="lg">
              <Span className={classes.links}>Remove Safe</Span>
              <Icon size="sm" type="delete" color="error" tooltip="Remove Safe" />
            </ButtonLink>
            <RemoveSafeModal isOpen={showRemoveSafe} onClose={onHide('RemoveSafe')} />
          </Col>
        ) : (
          <Col end="sm" sm={6} xs={12}></Col>
        )}
      </Menu>
      <Block className={classes.root}>
        <Col className={classes.contents} layout="column">
          <Block className={classes.container}>
            <Switch>
              <Route path={SAFE_ROUTES.SETTINGS_DETAILS} exact render={() => <SafeDetails />} />
              <Route
                path={SAFE_ROUTES.SETTINGS_OWNERS}
                exact
                render={() => <ManageOwners granted={granted} owners={owners} />}
              />
              <Route path={SAFE_ROUTES.SETTINGS_POLICIES} exact render={() => <ThresholdSettings />} />
              <Route path={SAFE_ROUTES.SETTINGS_SPENDING_LIMIT} exact render={() => <SpendingLimitSettings />} />
              <Route path={SAFE_ROUTES.SETTINGS_ADVANCED} exact render={() => <Advanced />} />
            </Switch>
          </Block>
        </Col>
      </Block>
    </>
  )
}

export default Settings
