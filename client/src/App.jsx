import { Outlet } from 'react-router-dom'
import './App.css'
import MinimalNavbar from './components/Navigation'

function App() {

  return (
    <main className="">
      <div className="">
        <MinimalNavbar/>
      </div>
      <div className="">
        <Outlet/>
      </div>
    </main>
  )
}

export default App
