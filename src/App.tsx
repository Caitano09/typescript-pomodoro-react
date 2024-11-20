import { PomodoroTimer } from "./components/pomodoro-timer";

function App() {
  return (
    <div className="container">
      <PomodoroTimer
        pomodoroTimer={10}
        shortRestTime={2}
        longRestTime={5}
        cycles={4}
      />
    </div>
  );
}

export default App;
