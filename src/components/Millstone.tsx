import { useForm, type SubmitHandler } from 'react-hook-form'
import classes from './CrushingWheel.module.css'
import { useState } from 'react'

type Inputs = {
  recipeDuration: number
  rpm: number
}

export const Millstone = () => {
  const [calculationResult, setCalculationResult] = useState('Press calculate')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = ({ recipeDuration, rpm }, event) => {
    event?.preventDefault()

    const MAX_MILLING_PROCESS_FACTOR = 512
    const MIN_MILLING_PROCESS_FACTOR = 1

    const millingProcessFactor = Math.min(
      Math.max(Math.abs(rpm / 16), MAX_MILLING_PROCESS_FACTOR),
      MIN_MILLING_PROCESS_FACTOR
    )
    const gameTicksPerRecipe =
      Math.ceil(recipeDuration / millingProcessFactor) + 1

    const howManySecondsPerSingleRecipe = gameTicksPerRecipe / 20
    const howManyRecipesPerSecond = 20 / gameTicksPerRecipe

    setCalculationResult(
      `${howManySecondsPerSingleRecipe.toFixed(
        2
      )} seconds per single recipe, ${howManyRecipesPerSecond.toFixed(
        2
      )} recipes per second`
    )
  }

  console.log(errors)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <label className={classes.label}>
        <span>Recipe duration</span>
        <input {...register('recipeDuration', { required: true })} />
        <span className={classes.disclaimer}>
          See{' '}
          <a href='https://create.fandom.com/wiki/Millstone#Recipe_Table'>
            recipe duration table
          </a>{' '}
          for reference
        </span>
      </label>
      <span>{errors.recipeDuration?.message}</span>
      <label className={classes.label}>
        <span>RPM</span>
        <input {...register('rpm', { required: true })} />
      </label>
      {errors.rpm?.message && errors.rpm.message}
      <button className={classes['button-85']}>Calculate</button>
      <h3>Result:</h3>
      <div className={classes.result}>{calculationResult}</div>
    </form>
  )
}
