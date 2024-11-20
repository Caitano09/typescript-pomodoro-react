import { useCallback, useEffect, useState } from "react"
import { useInterval } from "../hooks/use-interval"
import { Button } from "./button"
import { Timer } from "./timer"
import { secondsToMinutes } from "../utils/seconds-to-minutes"
import { secondsToTime } from "../utils/seconds-to-time"

const bellStart = require('../sounds/bell-start.mp3')
const bellFinish = require('../sounds/bell-finish.mp3')

const audioStartWorking = new Audio(bellStart)
const audioStopWorking = new Audio(bellFinish)

interface Props {
  pomodoroTimer: number
  shortRestTime: number
  longRestTime: number
  cycles: number
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.pomodoroTimer)
  const [timeCounting, setTimeCounting] = useState(false)
  const [working, setWorking] = useState(false)
  const [resting, setResting] = useState(false)
  const [cyclesQtdManager, setCyclesQtdManager] = useState(new Array(props.cycles - 1).fill(true))

  const [completedCycles, setCompletedCycles] = useState(0)
  const [fullWorkingTime, setFullWorkingTime] = useState(0)
  const [numberOfPomodoros, setNumberOfPomodoros] = useState(0)

  const configureWork = useCallback(() => {
    setTimeCounting(true)
    setWorking(true)
    setResting(false)
    setMainTime(props.pomodoroTimer)
    audioStartWorking.play()
  }, [
    setTimeCounting,
    setWorking,
    setResting,
    setMainTime,
    props.pomodoroTimer,
  ]);

  const configureRest = useCallback((long: boolean) => {
    setTimeCounting(true)
    setWorking(false)
    setResting(true)

    if (long) {
      setMainTime(props.longRestTime)
    } else {
      setMainTime(props.shortRestTime)
    }
    audioStopWorking.play()
  }, [
    setTimeCounting,
    setWorking,
    setResting,
    setMainTime,
    props.longRestTime,
    props.shortRestTime,
  ],);

  useEffect(() => {
    if (working) document.body.classList.add('working')
    if (resting) document.body.classList.remove('working')

    if (mainTime > 0) return;

    if (working && cyclesQtdManager.length > 0) {
      configureRest(false)
      cyclesQtdManager.pop()
    }
    else if (working && cyclesQtdManager.length <= 0) {
      configureRest(true)
      setCyclesQtdManager(new Array(props.cycles - 1).fill(true))
      setCompletedCycles(prev => prev + 1)
    }

    if (working) setNumberOfPomodoros(prev => prev + 1)
    if (resting) configureWork()

  }, [
    working,
    resting,
    mainTime,
    cyclesQtdManager,
    numberOfPomodoros,
    completedCycles,
    configureRest,
    setCyclesQtdManager,
    configureWork,
    props.cycles,
  ]);

  useInterval(() => {
    setMainTime(mainTime - 1)
    if (working) setFullWorkingTime(prev => prev + 1)
  }, timeCounting ? 1000 : null)

  return (
    <div className="pomodoro">
      <h2>Você está: {working ? 'Trabalhando' : 'Descansando'}!</h2>
      <Timer mainTime={mainTime} />

      <div className="controls">
        <Button text="Work" onClick={() => configureWork()} />
        <Button text="Rest" onClick={() => configureRest(false)} />
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timeCounting ? "Pause" : "Play"}
          onClick={() => setTimeCounting(prev => !prev)} />
      </div>

      <div className="details">
        <p>Ciclos concluídos: {completedCycles}</p>
        <p>Horas Trabalhadas: {secondsToTime(fullWorkingTime)}</p>
        <p>Pomodoros concluídos: {numberOfPomodoros}</p>
      </div>
    </div>
  )
}
