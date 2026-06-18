// Sample data so the app is immediately playable. All editable on the setup screen.

export const SEED_PLAYERS = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Morgan']

// Base field that seeds directly into the bracket. With the 4 play-in winners below
// this totals 64. People, things, and concepts — deliberately mixed, dark-humor energy.
export const SEED_ENTRIES_BASE = [
  'Donald Trump', 'Jeffrey Epstein', 'Taylor Swift', 'Zohran Mamdani',
  'Natural Disasters', 'Artificial Intelligence', 'The Stock Market', 'Ozempic',
  'Kendrick Lamar', 'Elon Musk', 'The Supreme Court', 'TikTok',
  'Climate Change', 'Beyoncé', 'The Federal Reserve', 'Crypto',
  'The Kansas City Chiefs', 'Barbie', 'NATO', 'Gen Z',
  'The Roman Empire', 'Labubu', 'The WNBA', 'Diddy',
  'Vladimir Putin', 'ChatGPT', 'Pop Music', 'The Housing Market',
  'Caitlin Clark', 'The Olympics', 'Brat Summer', 'Inflation',
  'The Pope', 'Sabrina Carpenter', 'Gambling Apps', 'The Border',
  'Greenland', 'Tariffs', 'Luigi Mangione', 'The Eras Tour',
  'College Football', 'Pickleball', 'The Met Gala', 'Wildfires',
  'Hurricane Season', 'The Gen Z Stare', 'Costco', 'Matcha',
  'The Dodgers', 'Severance', 'Drones', 'Student Loans',
  'The Oscars', 'Bitcoin', 'Hawk Tuah', 'Mustard',
  'The IRS', 'Nepo Babies', 'Gas Prices', 'The Eclipse',
]

// Optional play-in pairs — topical, fight-for-a-spot matchups. Winners join the 64.
export const SEED_PLAYIN_PAIRS: [string, string][] = [
  ['Antifa', 'Proud Boys'],
  ['The Metaverse', 'The Multiverse'],
  ['Threads', 'Bluesky'],
  ['Quiet Quitting', 'Loud Budgeting'],
]
