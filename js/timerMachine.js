const { createMachine, createActor } = XState;


export const timerMachine = createMachine({
  id: "pomodoro",
  initial: "idle",
  context: {
    duration: 1500, // 25 min
    remaining: 1500
  },
  states: {
    idle: {
      on: {
        START: "running"
      }
    },
    running: {
      on: {
        PAUSE: "paused",
        RESET: "idle",
        FINISH: "finished"
      }
    },
    paused: {
      on: {
        START: "running",
        RESET: "idle"
      }
    },
    finished: {
      on: {
        RESET: "idle"
      }
    }
  }
});

import { timerMachine } from "./timerMachine.js";

const timerService = createActor(timerMachine);

timerService.subscribe((state) => {
  console.log("Current state:", state.value);
});

timerService.start();

startBtn.addEventListener("click", () => {
  timerService.send({ type: "START" });
});

pauseBtn.addEventListener("click", () => {
  timerService.send({ type: "PAUSE" });
});

resetBtn.addEventListener("click", () => {
  timerService.send({ type: "RESET" });
});