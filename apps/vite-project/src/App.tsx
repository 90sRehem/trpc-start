import { useState } from 'react'

import reactLogo from './assets/react.svg'
import './App.css'
import { trpc } from './lib/trpc'

function App() {
  const [count, setCount] = useState(0)
  const hello = trpc.greeting.hello.useQuery({ name: 'teste'})

  return (
    <>

      <div className="App">
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" className="logo" alt="Vite logo" />
          </a>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
        {hello.isLoading ? <div>Loading...</div> : <div>{hello.data?.message}</div>}
      </div>
    </>
  )
}

export default App
