import { makeStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import { FormApi } from 'final-form'

import GnoForm from 'src/components/forms/GnoForm'
import Hairline from 'src/components/layout/Hairline'
import { history } from 'src/store'
import { LoadFormValues } from 'src/routes/load/container/Load'
import { StepperContent } from './StepperContent'
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
  const lastPage = isLastPage(page, props.steps.length)
  const penultimate = isLastPage(page + 1, props.steps.length)

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

  const validate = (values: V) => {
    const { children } = props

    const activePage: any = React.Children.toArray(children)[page]
    return activePage.props.validate ? activePage.props.validate(values) : {}
  }

  const next = async (formValues: V) => {
    const { children } = props
    const activePageProps = getPageProps(children, page)
    const { prepareNextInitialProps } = activePageProps

    let pageInitialProps
    if (prepareNextInitialProps) {
      pageInitialProps = await prepareNextInitialProps(formValues)
    }

    const finalValues = { ...formValues, ...pageInitialProps }

    setValues(finalValues)
    setPage(Math.min(page + 1, React.Children.count(children) - 1))
  }

  const previous = () => {
    const firstPage = page === 0
    if (firstPage) {
      return history.goBack()
    }

    return setPage(Math.max(page - 1, 0))
  }

  const handleSubmit = async (formValues: V) => {
    const { onSubmit } = props
    if (lastPage) {
      return onSubmit(formValues)
    }
    await next(formValues)
    return
  }

  const { buttonLabels, children, disabledWhenValidating = false, mutators, steps, testId } = props
  const activePage = getActivePageFrom(children)

  return (
    <GnoForm
      formMutators={mutators}
      initialValues={values}
      onSubmit={handleSubmit}
      testId={testId}
      validation={validate}
    >
      <StepperContent
        disabledWhenValidating={disabledWhenValidating}
        buttonLabels={buttonLabels}
        onPageChange={setPage}
        steps={steps}
      />
    </GnoForm>
  )
}

export default GnoStepper
