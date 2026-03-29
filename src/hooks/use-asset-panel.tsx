"use client";

import { createContext, useContext, useReducer, ReactNode, Dispatch } from "react";
import type { ShowAssetOutput } from "@/types/tools";

interface AssetPanelState {
  assetId: string | null;
  data: ShowAssetOutput | null;
}

type AssetPanelAction =
  | { type: "SHOW"; id: string; data: ShowAssetOutput }
  | { type: "HIDE" };

function assetPanelReducer(state: AssetPanelState, action: AssetPanelAction): AssetPanelState {
  switch (action.type) {
    case "SHOW":
      return { assetId: action.id, data: action.data };
    case "HIDE":
      return { assetId: null, data: null };
    default:
      return state;
  }
}

interface AssetPanelContextValue {
  state: AssetPanelState;
  dispatch: Dispatch<AssetPanelAction>;
  showAsset: (id: string, data: ShowAssetOutput) => void;
  hideAsset: () => void;
}

const AssetPanelContext = createContext<AssetPanelContextValue | null>(null);

export function AssetPanelProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(assetPanelReducer, { assetId: null, data: null });

  const showAsset = (id: string, data: ShowAssetOutput) => {
    dispatch({ type: "SHOW", id, data });
  };

  const hideAsset = () => {
    dispatch({ type: "HIDE" });
  };

  return (
    <AssetPanelContext.Provider value={{ state, dispatch, showAsset, hideAsset }}>
      {children}
    </AssetPanelContext.Provider>
  );
}

export function useAssetPanel() {
  const context = useContext(AssetPanelContext);
  if (!context) {
    throw new Error("useAssetPanel must be used within an AssetPanelProvider");
  }
  return context;
}
