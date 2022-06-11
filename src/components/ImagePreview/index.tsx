import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { WithChildren } from "../../types"
import ActionContext from "./context"

type ToolSetItem = 'prev' |
  'next' |
  'resource' |
  'zoomIn' |
  'zoomOut' |
  'resetScale' |
  'rotate' |
  'download'

const DEFAULT_TOOLSET: ToolSetItem[] = [
  'prev',
  'next',
  'resource',
  'zoomIn',
  'zoomOut',
  'resetScale',
  'rotate',
  'download',
]

type ImagePreviewProps = { list: string[] }

export default function ImagePreview({ list }: ImagePreviewProps) {
  const toolSet: ToolSetItem[] = [
    'prev',
    'next',
    'resource',
    'zoomIn',
    'zoomOut',
    'resetScale',
    // 'rotate',
    // 'download',
  ]
  const ref = useRef<HTMLImageElement>(null)

  const [index, setIndex] = useState(0)
  const [isShowRealImg, setIsShowRealImg] = useState(false)
  const [imgWidth, setImgWidth] = useState(-1)
  const [scale, setScale] = useState(1)

  const M = 1.2

  const onPrev = () => {
    console.log('onPrev')
    if (index === 0) return
    setScale(1)
    setIndex(i => --i)
  }
  const onNext = () => {
    console.log('onNext')
    if (index === list.length - 1) return
    setScale(1)
    setIndex(i => ++i)
  }
  const onResource = () => {
    console.log('onResource')
  }
  const onZoomIn = () => {
    console.log('onZoomIn')
    setScale(v => v * M)
  }
  const onZoomOut = () => {
    console.log('onZoomOut')
    setScale(v => v / M)
  }
  const onResetScale = () => {
    console.log('onResetScale')
    setScale(1)
  }
  const onRotate = () => {
    console.log('onRotate')
  }
  const onDownload = () => {
    console.log('onDownload')
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('load', () => {
        const w = ref.current!.width
        setImgWidth(w)
        setIsShowRealImg(true)
      }, { once: true })
    }
  }, [])

  return (
    <ActionContext.Provider value={
      {
        index,
        setIndex,
        onPrev,
        onNext,
        onResource,
        onZoomIn,
        onZoomOut,
        onResetScale,
        onRotate,
        onDownload,
      }
    }>
      <div className="fixed flex flex-col bottom-10 left-20 border-0 border-red-100"
        style={{
          width: '400px',
          height: '600px',
          backgroundColor: '#fff'
        }}
      >
        {/* header */}
        <ActionBar toolSet={toolSet} />
        {/* content */}
        <div className="px-2 flex-1 flex items-center justify-center overflow-hidden">
          {
            !isShowRealImg
              ? <img ref={ref} src={list[index]} alt="" />
              : <img width={imgWidth} src={list[index]} alt="real-img" style={{
                maxWidth: 'unset',
                transform: `scale(${scale})`
              }} />
          }
        </div>
      </div>
    </ActionContext.Provider>
  )
}

type ActionBarProps = WithChildren<{ toolSet: ToolSetItem[] }>

function ActionBar({ toolSet }: ActionBarProps) {

  const config = useMemo(() => DEFAULT_TOOLSET.reduce<{ [k in ToolSetItem]?: boolean }>((acc, cur) => {
    acc[cur] = toolSet.includes(cur)
    return acc;
  }, {}), [toolSet])

  const {
    onPrev,
    onNext,
    onResource,
    onZoomIn,
    onZoomOut,
    onResetScale,
    onRotate,
    onDownload,
  } = useContext(ActionContext)

  return (
    <div className="border-b-2 flex items-center px-2"
      style={{ height: 50 }}
    >
      {config.prev && <ActionBarButton onClick={onPrev}>P</ActionBarButton>}
      {config.next && <ActionBarButton onClick={onNext}>N</ActionBarButton>}
      {/* {config.resource && <ActionBarButton onClick={onResource}>R</ActionBarButton>} */}
      {config.zoomIn && <ActionBarButton onClick={onZoomIn}>I</ActionBarButton>}
      {config.zoomOut && <ActionBarButton onClick={onZoomOut}>O</ActionBarButton>}
      {config.resetScale && <ActionBarButton onClick={onResetScale}>E</ActionBarButton>}
      {config.rotate && <ActionBarButton onClick={onRotate}>T</ActionBarButton>}
      {config.download && <ActionBarButton onClick={onDownload}>D</ActionBarButton>}
    </div>
  )
}

function ActionBarButton(
  { onClick, children }: WithChildren<{ onClick?: () => void }>
) {
  return <button className="w-6 h-6 leading-6 text-center hover:bg-gray-200 cursor-pointer rounded"
    onClick={() => onClick?.()}
  >{children}</button>
}