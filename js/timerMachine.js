import { createMachine } from "xstate";

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
