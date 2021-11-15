import { Text } from '@gnosis.pm/safe-react-components'
import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement } from 'react'

import { formatDateTime } from 'src/utils/date'
import { ExpandedTxDetails, isMultiSigExecutionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { InlineEthHashInfo } from './styled'
import { NOT_AVAILABLE } from './utils'
import { useSelector } from 'react-redux'
import { AppReduxState } from 'src/store'
import { currentBlockExplorerInfo } from 'src/logic/config/store/selectors'

export const TxSummary = ({ txDetails }: { txDetails: ExpandedTxDetails }): ReactElement => {
  const { txHash, detailedExecutionInfo, executedAt, txData } = txDetails
  const explorerUrl = useSelector((state: AppReduxState) => currentBlockExplorerInfo(state, txHash || ''))
  const nonce = isMultiSigExecutionDetails(detailedExecutionInfo) ? detailedExecutionInfo.nonce : undefined
  const created = isMultiSigExecutionDetails(detailedExecutionInfo) ? detailedExecutionInfo.submittedAt : undefined
  const safeTxHash = isMultiSigExecutionDetails(detailedExecutionInfo) ? detailedExecutionInfo.safeTxHash : undefined

  return (
    <>
      <div className="tx-hash">
        <Text size="xl" strong as="span">
          Transaction hash:{' '}
        </Text>
        {txHash ? (
          <InlineEthHashInfo textSize="xl" hash={txHash} shortenHash={8} showCopyBtn explorerUrl={explorerUrl} />
        ) : (
          <Text size="xl" as="span">
            {NOT_AVAILABLE}
          </Text>
        )}
      </div>
      {safeTxHash !== undefined && (
        <div className="tx-hash">
          <Text size="xl" strong as="span">
            SafeTxHash:{' '}
          </Text>
          <InlineEthHashInfo textSize="xl" hash={safeTxHash} shortenHash={8} showCopyBtn />
        </div>
      )}
      {nonce !== undefined && (
        <div className="tx-nonce">
          <Text size="xl" strong as="span">
            Nonce:{' '}
          </Text>
          <Text size="xl" as="span">
            {nonce}
          </Text>
        </div>
      )}
      {created && (
        <div className="tx-created">
          <Text size="xl" strong as="span">
            Created:{' '}
          </Text>
          <Text size="xl" as="span">
            {formatDateTime(created)}
          </Text>
        </div>
      )}
      <div className="tx-executed">
        <Text size="xl" strong as="span">
          Executed:{' '}
        </Text>
        <Text size="xl" as="span">
          {executedAt ? formatDateTime(executedAt) : NOT_AVAILABLE}
        </Text>
      </div>
      {txData?.operation === Operation.DELEGATE && (
        <div className="tx-operation">
          <Text size="xl" strong as="span">
            Delegate Call
          </Text>
        </div>
      )}
    </>
  )
}
