import { useGame } from './store/gameStore'
import SetupScreen from './screens/SetupScreen'
import PlayScreen from './screens/PlayScreen'
import ChampionScreen from './screens/ChampionScreen'

export default function App() {
  const { state } = useGame()

  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-edge px-4 py-3 flex items-center justify-between sticky top-0 bg-ink/95 backdrop-blur z-10">
        <h1 className="font-black tracking-tight text-lg sm:text-xl">
          <span className="text-accent">Who Won</span> The Year
        </h1>
        <span className="text-xs text-white/40 hidden sm:inline">
          host-driven bracket
        </span>
      </header>

      <main className="flex-1">
        {state.phase === 'setup' && <SetupScreen />}
        {state.phase === 'play' && <PlayScreen />}
        {state.phase === 'champion' && <ChampionScreen />}
      </main>
    </div>
  )
}
