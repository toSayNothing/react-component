import { useState } from 'react'
import ImagePreview from './components/ImagePreview'
import { WithChildren } from './types'

const COMPONENT_LIST = ['image-preview']

const IMAGE_LIST = [
  'https://imgs.wiki/imgs/2022/06/11/7a0303c75c47510c.webp',
  'https://imgs.wiki/imgs/2022/06/11/22008969938bc339.webp',
  'https://imgs.wiki/imgs/2022/06/11/d3ddae70c6033b1c.webp'
]

function App() {
  const onClickNavItem = () => {
    console.log('onClickNavItem')
  }

  return (
    <div className='flex flex-col h-screen'>
      <header className='text-3xl p-2 border-b-2 border-slate-500'>
        react-components
      </header>
      <main className='flex-1 flex items-center'>
        <nav className='h-full border-r-2 border-slate-500'>
          {
            COMPONENT_LIST.map(i => <NavItem key={i} onClick={onClickNavItem}>{i}</NavItem>)
          }
        </nav>
        <article className='flex-1 h-full py-4'>
          {/* imageList */}
          <div className='px-2 flex gap-10'>
            {
              IMAGE_LIST.map(i => <img className='w-28 h-28 object-cover cursor-pointer hover:ring ring-offset-1' key={i} src={i} />)
            }
          </div>
        </article>
      </main>
      <ImagePreview list={IMAGE_LIST}/>
    </div>
  )
}

type NavItemProps = WithChildren<{ onClick: () => void }>

function NavItem({ onClick, children }: NavItemProps) {
  return <button className='p-2 transition-colors cursor-pointer hover:bg-slate-700 hover:text-violet-50' onClick={onClick}>{children}</button>
}

export default App
