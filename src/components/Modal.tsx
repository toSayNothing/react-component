import { useState } from "react";
import { WithChildren } from "../types";

type ModalProps = WithChildren<{ visible: boolean }>

export default function Modal({ visible, children }: ModalProps) {
  const [isShow, setIsShow] = useState(visible)

  return (
    <>
      {
        isShow && { children }
      }
    </>
  )
}