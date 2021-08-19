import { Form } from 'react-final-form'

const stylesBasedOn = (padding: number) => ({
  padding: `0 ${padding}%`,
  flexDirection: 'column' as const,
  flex: '1 0 auto',
})

const GnoForm = ({
  children,
  decorators,
  formMutators,
  initialValues,
  onSubmit,
  padding = 0,
  subscription,
  testId = '',
  validation,
  next,
}: any) => (
  <Form
    decorators={decorators}
    initialValues={initialValues}
    mutators={formMutators}
    onSubmit={onSubmit}
    render={({ handleSubmit, values }) => (
      <form
        data-testid={testId}
        onSubmit={async (e) => {
          handleSubmit(e)?.then(() => {
            console.log('submit finished')
            next(values)
          })
        }}
        style={stylesBasedOn(padding)}
      >
        {children}
      </form>
    )}
    subscription={subscription}
    validate={validation}
  />
)

export default GnoForm
