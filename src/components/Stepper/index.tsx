import FormStep from '@material-ui/core/Step'
import StepContent from '@material-ui/core/StepContent'
import StepLabel from '@material-ui/core/StepLabel'
import Stepper from '@material-ui/core/Stepper'
import { makeStyles } from '@material-ui/core/styles'
import React, { useCallback, useEffect, useState } from 'react'
import { FormApi } from 'final-form'

import Controls from './Controls'

import GnoForm from 'src/components/forms/GnoForm'
import Hairline from 'src/components/layout/Hairline'
import { history } from 'src/store'
import { LoadFormValues } from 'src/routes/load/container/Load'

const transitionProps = {
  timeout: {
    enter: 350,
    exit: 0,
  },
}

export interface StepperPageFormProps {
  values: LoadFormValues
  errors: Record<string, string>
  form: FormApi
}

interface StepperPageProps {
  validate?: (...args: unknown[]) => undefined | Record<string, string> | Promise<undefined | Record<string, string>>
  component: (
    ...args: unknown[]
  ) => (controls: React.ReactElement, formProps: StepperPageFormProps) => React.ReactElement
  [key: string]: unknown
}

// TODO: Remove this magic
/* eslint-disable */
// @ts-ignore
export const StepperPage = ({}: StepperPageProps): null => null
/* eslint-enable */

type StepperFormValues = Record<string, string>

interface Mutators {
  [key: string]: (...args: unknown[]) => void
}

interface GnoStepperProps<V = StepperFormValues> {
  initialValues?: Partial<V>
  onSubmit: (formValues: V) => void
  steps: string[]
  buttonLabels?: string[]
  children: React.ReactNode
  disabledWhenValidating?: boolean
  mutators?: Mutators
  testId?: string
}

const getPageProps = (pages, page: number) => {
  const aux = React.Children.toArray(pages)[page]
  return (aux as React.ReactElement).props
}

const isLastPage = (pageNumber: number, steps: number): boolean => {
  return pageNumber === steps - 1
}

function GnoStepper<V>(props: GnoStepperProps<V>): React.ReactElement {
  const [page, setPage] = useState(0)
  const [values, setValues] = useState({})
  const classes = useStyles()

  useEffect(() => {
    if (props.initialValues) {
      setValues((prevState) => {
        return { ...prevState, ...props.initialValues }
      })
    }
  }, [props.initialValues])

  const getActivePageFrom = (pages) => {
    const activePageProps = getPageProps(pages, page)
    const { component, ...restProps } = activePageProps
    console.log('getting active page)')

    return component({ ...restProps, updateInitialProps: setValues })
  }

  const validate = (values) => {
    const { children } = props

    const activePage: any = React.Children.toArray(children)[page]
    return activePage.props.validate ? activePage.props.validate(values) : {}
  }

  const next = (formValues) => {
    const { children } = props
    const activePageProps = getPageProps(children, page)
    const { prepareNextInitialProps } = activePageProps

    let pageInitialProps
    // if (prepareNextInitialProps) {
    //   pageInitialProps = await prepareNextInitialProps(formValues)
    // }

    const finalValues = { ...formValues, ...pageInitialProps }

    setValues(finalValues)
    setPage(Math.min(page + 1, React.Children.count(children) - 1))

    // await sleep(5000)
  }

  const previous = () => {
    const firstPage = page === 0
    if (firstPage) {
      return history.goBack()
    }

    return setPage(Math.max(page - 1, 0))
  }

  const handleSubmit = async (formValues) => {
    const { children, onSubmit } = props
    const isLastPage = page === React.Children.count(children) - 1
    if (isLastPage) {
      return onSubmit(formValues)
    }
    await next(formValues)
    return
  }

  const { buttonLabels, children, disabledWhenValidating = false, mutators, steps, testId } = props
  const activePage = getActivePageFrom(children)

  const lastPage = isLastPage(page, props.steps.length)
  const penultimate = isLastPage(page + 1, props.steps.length)

  return (
    <GnoForm
      formMutators={mutators}
      initialValues={values}
      onSubmit={handleSubmit}
      testId={testId}
      validation={validate}
    >
      {(submitting, validating, ...rest) => {
        console.log({ submitting, rest })
        if (typeof submitting === 'undefined') {
          return <div />
        }

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
              onPrevious={previous}
              penultimate={penultimate}
            />
          </>
        )

        return (
          <Stepper activeStep={page} classes={{ root: classes.root }} orientation="vertical">
            {steps.map((label, index) => {
              const labelProps: any = {}
              const isClickable = index < page

              if (isClickable) {
                labelProps.onClick = () => {
                  setPage(index)
                }
                labelProps.className = classes.pointerCursor
              }
              console.log('step render')
              return (
                <FormStep key={label}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                  <StepContent TransitionProps={transitionProps}>{activePage(controls, ...rest)}</StepContent>
                </FormStep>
              )
            })}
          </Stepper>
        )
      }}
    </GnoForm>
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

export default GnoStepper
