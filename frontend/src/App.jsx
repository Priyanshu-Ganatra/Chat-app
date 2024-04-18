import './App.css'
import Login from './pages/login/Login'
import SignUp from './pages/signup/SignUp'
import Home from './pages/home/Home'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthContext } from './context/AuthContext'

function App() {

  const {authUser} = useAuthContext()

  return (
    <>
      <main className='flex items-center justify-center h-screen p-4'>
        <Routes>
          <Route path='/' element={!authUser ? <Navigate to={'/login'}/> : <Home/>}/>
          <Route path='/login' element={authUser ? <Navigate to={'/'}/> : <Login/>}/>
          <Route path='/signup' element={authUser ? <Navigate to={'/'}/> : <SignUp/>}/>
        </Routes>
        <Toaster/>
      </main>
    </>
  )
}

export default App
