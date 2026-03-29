"use client";

import { createContext, useContext, useReducer, ReactNode, Dispatch } from "react";
import type { ShowTaskOutput } from "@/types/tools";

interface TaskPanelState {
  taskId: string | null;
  data: ShowTaskOutput | null;
}

type TaskPanelAction =
  | { type: "SHOW"; id: string; data: ShowTaskOutput }
  | { type: "HIDE" };

function taskPanelReducer(state: TaskPanelState, action: TaskPanelAction): TaskPanelState {
  switch (action.type) {
    case "SHOW":
      return { taskId: action.id, data: action.data };
    case "HIDE":
      return { taskId: null, data: null };
    default:
      return state;
  }
}

interface TaskPanelContextValue {
  state: TaskPanelState;
  dispatch: Dispatch<TaskPanelAction>;
  showTask: (id: string, data: ShowTaskOutput) => void;
  hideTask: () => void;
}

const TaskPanelContext = createContext<TaskPanelContextValue | null>(null);

export function TaskPanelProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskPanelReducer, { taskId: null, data: null });

  const showTask = (id: string, data: ShowTaskOutput) => {
    dispatch({ type: "SHOW", id, data });
  };

  const hideTask = () => {
    dispatch({ type: "HIDE" });
  };

  return (
    <TaskPanelContext.Provider value={{ state, dispatch, showTask, hideTask }}>
      {children}
    </TaskPanelContext.Provider>
  );
}

export function useTaskPanel() {
  const context = useContext(TaskPanelContext);
  if (!context) {
    throw new Error("useTaskPanel must be used within a TaskPanelProvider");
  }
  return context;
}
