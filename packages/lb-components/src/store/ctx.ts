import React from "react";
import { createDispatchHook, createSelectorHook } from "react-redux";

export const LabelBeeContext = React.createContext(undefined) as any;
export const useDispatch = createDispatchHook(LabelBeeContext);
export const useSelector = createSelectorHook(LabelBeeContext);