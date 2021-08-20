import React, { useEffect, useState, useMemo } from 'react'
import { FormApi } from 'final-form'

import GnoForm from 'src/components/forms/GnoForm'
import { history } from 'src/store'
import { LoadFormValues } from 'src/routes/load/container/Load'
import { StepperContent } from './StepperContent'
import { unstable_batchedUpdates } from 'react-dom'
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

  const getActivePageFrom = (pages, page) => {
    const activePageProps = getPageProps(pages, page)
    const { component, ...restProps } = activePageProps

    return component({ ...restProps })
  }

  const validate = (values: V) => {
    const { children } = props

    const activePage: any = React.Children.toArray(children)[page]
    return activePage.props.validate ? activePage.props.validate(values) : {}
  }

  const next = async (formValues: V) => {
    unstable_batchedUpdates(() => {
      setValues(formValues)
      setPage(Math.min(page + 1, React.Children.count(children) - 1))
    })
  }

  const goBack = () => {
    const firstPage = page === 0
    if (firstPage) {
      return history.goBack()
    } else {
      setPage(Math.max(page - 1, 0))
    }
  }

  const handleSubmit = async (formValues: V) => {
    const { onSubmit } = props
    if (lastPage) {
      return onSubmit(formValues)
    }
    next(formValues)
  }

  const { buttonLabels, children, disabledWhenValidating = false, mutators, steps, testId } = props
  const activePage = useMemo(() => getActivePageFrom(children, page), [page])

  return (
    <GnoForm
      formMutators={mutators}
      initialValues={values}
      onSubmit={handleSubmit}
      testId={testId}
      validation={validate}
      next={next}
    >
      <StepperContent
        disabledWhenValidating={disabledWhenValidating}
        buttonLabels={buttonLabels}
        onPageChange={setPage}
        steps={steps}
        penultimate={penultimate}
        page={page}
        lastPage={lastPage}
        onPrevious={goBack}
        activePage={activePage}
      />
    </GnoForm>
  )
}

export default GnoStepper
