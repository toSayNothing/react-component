import { createContext } from "react";

export type ActionContext = {
  index: number;
  setIndex: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onResource: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetScale: () => void;
  onRotate: () => void;
  onDownload: () => void;
}

const ActionContext = createContext<ActionContext>(null as any)

export default ActionContext