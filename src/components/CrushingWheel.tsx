import { useForm, type SubmitHandler } from 'react-hook-form'
import classes from './CrushingWheel.module.css'
import { useState } from 'react'

type Inputs = {
  recipeDuration: number
  inputDelay: number
  stackSize: number
  rpm: number
}

export const CrushingWheel = () => {
  const [calculationResult, setCalculationResult] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (
    { inputDelay, recipeDuration, rpm, stackSize },
    event
  ) => {
    event?.preventDefault()

    const duration = recipeDuration - 19.999999
    const rpmDivByLog = ((rpm / 50) * 4) / Math.log2(stackSize)
    const result =
      (duration / Math.min(Math.max(rpmDivByLog, 0.25), 20) + inputDelay) *
      stackSize

    setCalculationResult(result)
  }

  console.log(errors)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <label className={classes.label}>
        <span>Recipe duration</span>
        <input {...register('recipeDuration', { required: true })} />
        <span className={classes.disclaimer}>
          See{' '}
          <a href='https://create.fandom.com/wiki/Crushing_Wheel#Recipe_Duration_Table'>
            recipe duration table
          </a>{' '}
          for reference
        </span>
      </label>
      <span>{errors.recipeDuration?.message}</span>
      <label className={classes.label}>
        <span>Input delay</span>
        <input {...register('inputDelay', { required: true })} />
        <p className={classes.disclaimer}>
          The input delay is set by the component inputting the items, and is 1
          for any funnel, 3 for any chute, and 27 if thrown directly to the
          crushing wheel. Be aware that the use of belts to feed the funnel will
          add more delay.
        </p>
      </label>
      {errors.inputDelay?.message && errors.inputDelay.message}
      <label className={classes.label}>
        <span>Stack size</span>
        <input
          placeholder='1-64'
          {...register('stackSize', { required: true })}
        />
        <span className={classes.disclaimer}>
          The stack size is the amount of items inputted in the range of 1-64
        </span>
      </label>
      <label className={classes.label}>
        <span>RPM</span>
        <input {...register('rpm', { required: true })} />
      </label>
      {errors.rpm?.message && errors.rpm.message}
      <button>Calculate</button>
      <h3>Result:</h3>
      {calculationResult} ticks = {(calculationResult / 20).toFixed(2)} seconds
    </form>
  )
}
