import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Home from './pages/Home'
import CheckIn from './pages/CheckIn'
import Analysis from './pages/Analysis'
import Lexicon from './pages/Lexicon'
import Progress from './pages/Progress'
import Settings from './pages/Settings'
import RelationshipMode from './pages/RelationshipMode'
import GoalForge from './pages/GoalForge'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/lexicon" element={<Lexicon />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/relationship" element={<RelationshipMode />} />
        <Route path="/goals" element={<GoalForge />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
