import { useGame } from './store/gameStore'
import LandingScreen from './screens/LandingScreen'
import SetupScreen from './screens/SetupScreen'
import PlayScreen from './screens/PlayScreen'
import ChampionScreen from './screens/ChampionScreen'

export default function App() {
  const { state } = useGame()

  return (
    <div className="min-h-full flex flex-col bg-white text-gray-900">
      <main className="flex-1">
        {state.phase === 'landing'   && <LandingScreen />}
        {state.phase === 'setup'     && <SetupScreen />}
        {state.phase === 'play'      && <PlayScreen />}
        {state.phase === 'champion'  && <ChampionScreen />}
      </main>
    </div>
  )
}
