import { Route, Routes } from 'react-router-dom'
import Index from './page/index/Index'
import Room from './page/room/Room'
import ProtectRoute from './components/protectRoute/ProtectRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route element={<ProtectRoute />}>
        <Route path="/call" element={<Room />} />
      </Route>
    </Routes>
  )
}

export default App
