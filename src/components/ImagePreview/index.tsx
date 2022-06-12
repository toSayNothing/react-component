import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { WithChildren } from "../../types"
import ActionContext from "./context"
import { Icon } from '@iconify/react'
import { saveAs } from 'file-saver'
import './index.css'

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

const M_LIST = [.2, .5, .8, 1, 1.2, 1.5, 1.8, 2, 2.2, 2.5, 2.8, 3]
const DEFAULT_SCALE_INDEX = M_LIST.findIndex(i => i === 1)

const CENTER_ORIGIN = { x: '50%', y: '50%' }

export default function ImagePreview({ list }: ImagePreviewProps) {
  const toolSet: ToolSetItem[] = [
    'prev',
    'next',
    'resource',
    'zoomIn',
    'zoomOut',
    'resetScale',
    'rotate',
    'download',
  ]

  const [index, setIndex] = useState(0)
  const [isImgLoading, setIsImgLoading] = useState(true)
  const [deg, setDeg] = useState(0)
  const [scaleIndex, setScaleIndex] = useState(DEFAULT_SCALE_INDEX)
  const [scaleOrigin, setScaleOrigin] = useState<{ x: string, y: string }>(CENTER_ORIGIN)
  // 下一次放大缩小的原点 
  const [nextScaleOrigin, setNextScaleOrigin] = useState<{ x: string, y: string }>(CENTER_ORIGIN)
  const [isImgBiggerThanParent, setIsImgBiggerThanParent] = useState(false)

  const onPrev = () => {
    console.log('onPrev')
    if (index === 0) return
    setIndex(i => --i)
    setIsImgLoading(true)
  }
  const onNext = () => {
    console.log('onNext')
    if (index === list.length - 1) return
    setIndex(i => ++i)
    setIsImgLoading(true)
  }
  const onResource = () => {
    console.log('onResource')
  }
  const onZoomIn = () => {
    console.log('onZoomIn')
    // setScale(v => v * M)
    if (scaleIndex === M_LIST.length - 1) return
    setScaleIndex(i => ++i)
    setScaleOrigin({ ...nextScaleOrigin })
  }
  const onZoomOut = () => {
    console.log('onZoomOut')
    // setScale(v => v / M)
    if (scaleIndex === 0) return
    setScaleIndex(i => --i)
    setScaleOrigin({ ...nextScaleOrigin })
  }
  const onWheel: React.WheelEventHandler = (e) => {
    const delta = Math.sign(e.deltaY);
    delta > 0 ? onZoomOut() : onZoomIn()
  }
  const onResetScale = () => {
    console.log('onResetScale')
    setScaleIndex(DEFAULT_SCALE_INDEX)
    setScaleOrigin(CENTER_ORIGIN)
    setNextScaleOrigin(CENTER_ORIGIN)
  }
  const onRotate = () => {
    console.log('onRotate')
    setDeg(d => d + 90)
  }
  const onDownload = () => {
    console.log('onDownload')
    const imgSrc = list[index]
    saveAs(imgSrc, imgSrc.split('/').at(-1) ?? 'img.jpg')
  }

  const onImgLoad = () => {
    setScaleIndex(DEFAULT_SCALE_INDEX)
    setScaleOrigin(CENTER_ORIGIN)
    setDeg(0)
    setIsImgLoading(false)
  }

  const onImgDoubleClick = () => {
    setScaleIndex(DEFAULT_SCALE_INDEX)
    setScaleOrigin(CENTER_ORIGIN)
  }

  const onImgMouseMove: React.MouseEventHandler = (e) => {
    const { offsetX, offsetY } = e.nativeEvent
    console.log('onImgMouseMove', offsetX, offsetY)
    setNextScaleOrigin({ x: `${offsetX}px`, y: `${offsetY}px` })
  }

  // 拦截组合键
  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      const isWin32 = true;
      // https://developer.mozilla.org/zh-TW/docs/Web/API/KeyboardEvent
      // mac 的 command key 是 meta key 
      const mainKey = isWin32 ? e.ctrlKey : e.metaKey;
      if (mainKey && e.key === '-') {
        e.preventDefault()
        onZoomOut()
      }
      if (mainKey && e.key === '+') {
        e.preventDefault()
        onZoomIn()
      }
    }
    // 107 +  109 -
    document.addEventListener('keydown', onKeydown)
    return () => {
      document.removeEventListener('keydown', onKeydown)
    }
  }, [])

  // 判断图片是否超出
  useEffect(() => {
    const img = document.getElementById('realImg')
    if (!img) return;
    const { width, height } = img.getBoundingClientRect()
    const { clientWidth, clientHeight } = img.parentElement!
    console.log('---',
      width, clientWidth, height, clientHeight
    )
    setIsImgBiggerThanParent(
      width > clientWidth || height > clientHeight
    )
  }, [scaleIndex])

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
        <div className="imgWrapper relative px-2 flex-1 flex items-center justify-center overflow-hidden overflow-x-scroll overflow-y-scroll" onWheel={onWheel}
          style={{ backgroundColor: '#242526' }}
        >
          <img id="realImg" src={list[index]} alt="real-img" style={{
            transform: `scale(${M_LIST[scaleIndex]}) rotate(${deg}deg)`,
            transformOrigin: `${scaleOrigin.x} ${scaleOrigin.y}`,
            cursor: isImgBiggerThanParent ? 'grab' : 'auto'
          }}
            onLoad={onImgLoad}
            onDoubleClick={onImgDoubleClick}
            onMouseMove={onImgMouseMove}
          />
          {
            isImgLoading && <div className="absolute inset-0 flex items-center justify-center bg-gray-200 opacity-20">
              <img className="w-20" src="/spiner.gif" alt="" />
            </div>
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
    <div className="border-b-1 flex items-center px-2"
      style={{ height: 46 }}
    >
      {/* s-move 像微信那样显示移动的 */}
      {config.prev && <ActionBarButton onClick={onPrev} title="上一张"><Icon icon="bi:arrow-left-square" /></ActionBarButton>}
      {config.next && <ActionBarButton onClick={onNext} title="下一张"><Icon icon="bi:arrow-right-square" /></ActionBarButton>}
      {/* {config.resource && <ActionBarButton onClick={onResource}>R</ActionBarButton>} */}
      {config.zoomIn && <ActionBarButton onClick={onZoomIn} title="放大"><Icon icon="bi:zoom-in" /></ActionBarButton>}
      {config.zoomOut && <ActionBarButton onClick={onZoomOut} title="缩小"><Icon icon="bi:zoom-out" /></ActionBarButton>}
      {config.resetScale && <ActionBarButton onClick={onResetScale} title="重置大小"><Icon icon="bi:aspect-ratio" /></ActionBarButton>}
      {config.rotate && <ActionBarButton onClick={onRotate} title="向右旋转"><Icon icon="bi:arrow-90deg-right" /></ActionBarButton>}
      {config.download && <ActionBarButton onClick={onDownload} title="下载"><Icon icon="bi:download" /></ActionBarButton>}
    </div>
  )
}

function ActionBarButton(
  { onClick, title = "", children }: WithChildren<{ onClick?: () => void, title?: string }>
) {
  return (<button className="w-6 h-6 text-lg flex items-center justify-center hover:bg-gray-200 cursor-pointer rounded mr-2"
    type="button"
    title={title}
    onClick={() => onClick?.()}
  >{children}</button>)
}