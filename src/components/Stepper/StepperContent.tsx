import StepContent from '@material-ui/core/StepContent'
import StepLabel from '@material-ui/core/StepLabel'
import Step from '@material-ui/core/Step'
import Stepper from '@material-ui/core/Stepper'
import { makeStyles } from '@material-ui/core/styles'
import { useFormState } from 'react-final-form'

import Hairline from 'src/components/layout/Hairline'

import Controls from './Controls'

const transitionProps = {
  timeout: {
    enter: 350,
    exit: 0,
  },
}

type Props = {
  disabledWhenValidating?: boolean
  buttonLabels?: string[]
  steps: string[]
  onPageChange: (page: number) => void
  penultimate: boolean
  page: number
  lastPage: boolean
  onPrevious: () => void
  activePage: any
}

function StepperContent({
  disabledWhenValidating = false,
  onPageChange,
  steps,
  penultimate,
  page,
  lastPage,
  buttonLabels,
  onPrevious,
  activePage,
}: Props): React.ReactElement {
  const { submitting, validating, ...rest } = useFormState()
  const classes = useStyles()

  const disabled = disabledWhenValidating ? submitting || validating : submitting
  const controls = (
    <>
      <Hairline />
      <Controls
        buttonLabels={buttonLabels}
        currentStep={page}
        disabled={disabled}
        firstPage={page === 0}
        lastPage={lastPage}
        onPrevious={onPrevious}
        penultimate={penultimate}
      />
    </>
  )

  return (
    <Stepper activeStep={page} classes={{ root: classes.root }} orientation="vertical">
      {steps.map((label, index) => {
        const labelProps: { onClick?: () => void; className?: string } = {}
        const isClickable = index < page

        if (isClickable) {
          labelProps.onClick = () => {
            onPageChange(index)
          }
          labelProps.className = classes.pointerCursor
        }
        console.log('step render')
        return (
          <Step key={label}>
            <StepLabel {...labelProps}>{label}</StepLabel>
            <StepContent TransitionProps={transitionProps}>{activePage(controls, rest)}</StepContent>
          </Step>
        )
      })}
    </Stepper>
  )
}

const useStyles = makeStyles({
  root: {
    flex: '1 1 auto',
    backgroundColor: 'transparent',
  },
  pointerCursor: {
    '& > .MuiStepLabel-iconContainer': {
      cursor: 'pointer',
    },
    '& > .MuiStepLabel-labelContainer': {
      cursor: 'pointer',
    },
  },
})

export { StepperContent }
