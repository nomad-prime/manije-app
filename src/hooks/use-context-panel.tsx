"use client";

import { createContext, useContext, useReducer, ReactNode, Dispatch } from "react";
import type { ShowAssetOutput, ShowTaskOutput } from "@/types/tools";

type ContextPanelType = "asset" | "task" | "none";

interface ContextPanelState {
  type: ContextPanelType;
  id: string | null;
  data: ShowAssetOutput | ShowTaskOutput | null;
}

type ContextPanelAction =
  | { type: "SHOW_ASSET"; id: string; data: ShowAssetOutput }
  | { type: "SHOW_TASK"; id: string; data: ShowTaskOutput }
  | { type: "HIDE" };

function contextPanelReducer(state: ContextPanelState, action: ContextPanelAction): ContextPanelState {
  switch (action.type) {
    case "SHOW_ASSET":
      return { type: "asset", id: action.id, data: action.data };
    case "SHOW_TASK":
      return { type: "task", id: action.id, data: action.data };
    case "HIDE":
      return { type: "none", id: null, data: null };
    default:
      return state;
  }
}

const initialState: ContextPanelState = {
  type: "none",
  id: null,
  data: null,
};

interface ContextPanelContextValue {
  state: ContextPanelState;
  dispatch: Dispatch<ContextPanelAction>;
  showAsset: (id: string, data: ShowAssetOutput) => void;
  showTask: (id: string, data: ShowTaskOutput) => void;
  hideContext: () => void;
}

const ContextPanelContext = createContext<ContextPanelContextValue | null>(null);

export function ContextPanelProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(contextPanelReducer, initialState);

  const showAsset = (id: string, data: ShowAssetOutput) => {
    dispatch({ type: "SHOW_ASSET", id, data });
  };

  const showTask = (id: string, data: ShowTaskOutput) => {
    dispatch({ type: "SHOW_TASK", id, data });
  };

  const hideContext = () => {
    dispatch({ type: "HIDE" });
  };

  return (
    <ContextPanelContext.Provider value={{ state, dispatch, showAsset, showTask, hideContext }}>
      {children}
    </ContextPanelContext.Provider>
  );
}

export function useContextPanel() {
  const context = useContext(ContextPanelContext);
  if (!context) {
    throw new Error("useContextPanel must be used within a ContextPanelProvider");
  }
  return context;
}
