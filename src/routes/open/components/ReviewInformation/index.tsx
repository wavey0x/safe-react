import TableContainer from '@material-ui/core/TableContainer'
import React, { ReactElement, useMemo, useRef, useEffect } from 'react'
import { getExplorerInfo, getNetworkInfo } from 'src/config'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import OpenPaper from 'src/components/Stepper/OpenPaper'
import {
  CreateSafeValues,
  getAccountsFrom,
  getNamesFrom,
  getSafeCreationSaltFrom,
} from 'src/routes/open/utils/safeDataExtractor'

import { FIELD_CONFIRMATIONS, FIELD_NAME, getNumOwnersFrom } from '../fields'
import { useStyles } from './styles'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import { useEstimateSafeCreationGas } from 'src/logic/hooks/useEstimateSafeCreationGas'
import { FormApi } from 'final-form'
import { StepperPageFormProps } from 'src/components/Stepper'
import { LoadFormValues } from 'src/routes/load/container/Load'

type ReviewComponentProps = {
  values: LoadFormValues
  form: FormApi
}

const { nativeCoin } = getNetworkInfo()
function useWhyDidYouUpdate(name, props) {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.
  const previousProps = useRef({})
  useEffect(() => {
    if (previousProps.current) {
      // Get all keys from previous and current props
      const allKeys = Object.keys({ ...previousProps.current, ...props })
      // Use this object to keep track of changed props
      const changesObj = {}
      // Iterate through keys
      allKeys.forEach((key) => {
        // If previous is different from current
        if (previousProps.current[key] !== props[key]) {
          // Add to changesObj
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          }
        }
      })
      // If changesObj not empty then output to console
      if (Object.keys(changesObj).length) {
        console.log('[why-did-you-update]', name, changesObj)
      }
    }
    // Finally update previousProps with current props for next hook call
    previousProps.current = props
  })
}

const ReviewComponent = (props: ReviewComponentProps): ReactElement => {
  const { values } = props
  const classes = useStyles()
  // debugger
  useWhyDidYouUpdate('ReviewComponent', props)

  const names = getNamesFrom(values)
  const addresses = useMemo(() => {
    console.log('calculating addresses') // logs 5 times
    return getAccountsFrom(values)
  }, [values])

  const numOwners = getNumOwnersFrom(values)
  const safeCreationSalt = getSafeCreationSaltFrom(values as CreateSafeValues)
  const { gasCostFormatted } = useEstimateSafeCreationGas({ addresses, numOwners, safeCreationSalt })

  return (
    <>
      <Row className={classes.root}>
        <Col className={classes.detailsColumn} layout="column" xs={4}>
          <Block className={classes.details}>
            <Block margin="lg">
              <Paragraph color="primary" noMargin size="lg" data-testid="create-safe-step-three">
                Details
              </Paragraph>
            </Block>
            <Block margin="lg">
              <Paragraph color="disabled" noMargin size="sm">
                Name of new Safe
              </Paragraph>
              <Paragraph
                className={classes.name}
                color="primary"
                noMargin
                size="lg"
                weight="bolder"
                data-testid="create-safe-review-name"
              >
                {values[FIELD_NAME]}
              </Paragraph>
            </Block>
            <Block margin="lg">
              <Paragraph color="disabled" noMargin size="sm">
                Any transaction requires the confirmation of:
              </Paragraph>
              <Paragraph
                color="primary"
                noMargin
                size="lg"
                weight="bolder"
                data-testid={`create-safe-review-req-owners-${values[FIELD_CONFIRMATIONS]}`}
              >
                {`${values[FIELD_CONFIRMATIONS]} out of ${numOwners} owners`}
              </Paragraph>
            </Block>
          </Block>
        </Col>
        <Col className={classes.ownersColumn} layout="column" xs={8}>
          <TableContainer>
            <Block className={classes.owners}>
              <Paragraph color="primary" noMargin size="lg">
                {`${numOwners} Safe owners`}
              </Paragraph>
            </Block>
            <Hairline />
            {names.map((name, index) => (
              <React.Fragment key={`name${index}`}>
                <Row className={classes.owner}>
                  <Col align="center" xs={12} data-testid={`create-safe-owner-details-${index}`}>
                    <EthHashInfo
                      data-testid={`create-safe-owner-name-${index}`}
                      hash={addresses[index]}
                      name={name}
                      showAvatar
                      showCopyBtn
                      explorerUrl={getExplorerInfo(addresses[index])}
                    />
                  </Col>
                </Row>
                <Hairline />
              </React.Fragment>
            ))}
          </TableContainer>
        </Col>
      </Row>
      <Row align="center" className={classes.info}>
        <Paragraph color="primary" noMargin size="lg">
          You&apos;re about to create a new Safe and will have to confirm a transaction with your currently connected
          wallet. The creation will cost approximately {gasCostFormatted} {nativeCoin.name}. The exact amount will be
          determined by your wallet.
        </Paragraph>
      </Row>
    </>
  )
}

export const Review = () =>
  function ReviewPage(controls: React.ReactNode, props: StepperPageFormProps): React.ReactElement {
    return (
      <>
        <OpenPaper controls={controls} padding={false}>
          <ReviewComponent {...props} />
        </OpenPaper>
      </>
    )
  }
