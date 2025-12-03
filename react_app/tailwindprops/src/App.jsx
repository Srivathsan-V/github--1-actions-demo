import { use, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Card } from './components/card'
function App() {
  const [length, setLength] = useState(8)
  const [numberAllowed, setNumberAllowed] = useState(false)
  const[charAllowed,setCharAllowed] = useState(false);
  const [password,setPassword] = useState('')


  return (
      <div className="min-h-screen bg-cyan-500 flex items-center justify-center text-white text-2xl">
        card
      </div>
  )
}

export default App
