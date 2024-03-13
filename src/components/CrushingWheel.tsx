import { useForm, type SubmitHandler, useWatch } from 'react-hook-form'
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
    control,
    formState: { errors },
  } = useForm<Inputs>()

  const rpmReactive = useWatch({
    control,
    name: 'rpm',
  })

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

  const animationRotationDuration = ((1 / rpmReactive) * 60).toPrecision(2)

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
        <span className={classes.error}>{errors.recipeDuration?.type}</span>
      </label>
      <label className={classes.label}>
        <span>Input delay</span>
        <input {...register('inputDelay', { required: true })} />
        <p className={classes.disclaimer}>
          The input delay is set by the component inputting the items, and is 1
          for any funnel, 3 for any chute, and 27 if thrown directly to the
          crushing wheel. Be aware that the use of belts to feed the funnel will
          add more delay.
        </p>
        <span className={classes.error}>{errors.inputDelay?.type}</span>
      </label>
      <label className={classes.label}>
        <span>Stack size</span>
        <input
          placeholder='1-64'
          {...register('stackSize', { required: true })}
        />
        <span className={classes.disclaimer}>
          The stack size is the amount of items inputted in the range of 1-64
        </span>
        <span className={classes.error}>{errors.stackSize?.type}</span>
      </label>
      <label className={classes.label}>
        <span>RPM</span>
        <input {...register('rpm', { required: true })} />
        {!isNaN(Number(animationRotationDuration)) && (
          <img
            className={classes.rotate}
            src='/create-processing-speed/favicon.svg'
            style={{
              width: '20px',
              animationDuration: `${animationRotationDuration}s`,
            }}
          />
        )}
        {errors.rpm?.type}
      </label>
      <button className={classes['button-85']}>Calculate</button>
      <h3>Result:</h3>
      <div className={classes.result}>
        {calculationResult} ticks = {(calculationResult / 20).toFixed(2)}{' '}
        seconds
      </div>
    </form>
  )
}
