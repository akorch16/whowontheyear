import { useGame } from './store/gameStore'
import LandingScreen from './screens/LandingScreen'
import SetupScreen from './screens/SetupScreen'
import PlayScreen from './screens/PlayScreen'
import ChampionScreen from './screens/ChampionScreen'

export default function App() {
  const { state } = useGame()

  return (
    <div className="min-h-full flex flex-col bg-white text-gray-900">
      <header className="border-b-2 border-gold sticky top-0 bg-white z-10 px-5 py-4 flex items-center justify-between">
        <h1 className="font-serif font-black text-xl tracking-tight leading-none">
          <span className="text-gold">Who Won</span> The Year
        </h1>
        {state.phase === 'play' && (
          <span className="text-xs font-bold tracking-widest uppercase text-gray-600">
            {state.currentRound === 'play-in' ? 'Play-In'
              : state.currentRound === 'r64' ? 'Round of 64'
              : state.currentRound === 'r32' ? 'Round of 32'
              : state.currentRound === 'sweet16' ? 'Sweet 16'
              : state.currentRound === 'elite8' ? 'Elite 8'
              : state.currentRound === 'final4' ? 'Final 4'
              : 'Championship'}
          </span>
        )}
      </header>

      <main className="flex-1">
        {state.phase === 'landing'   && <LandingScreen />}
        {state.phase === 'setup'     && <SetupScreen />}
        {state.phase === 'play'      && <PlayScreen />}
        {state.phase === 'champion'  && <ChampionScreen />}
      </main>
    </div>
  )
}
