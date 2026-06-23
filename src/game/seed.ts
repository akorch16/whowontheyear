// Sample data so the app is immediately playable. All editable on the setup screen.

export const SEED_PLAYERS = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Morgan']

// Base field that seeds directly into the bracket. With the 4 play-in winners below
// this totals 64. People, things, and concepts — deliberately mixed, dark-humor energy.
export const SEED_ENTRIES_BASE = [
  // geopolitics / politics
  "Maduro's capture", 'The Iran war', 'Strait of Hormuz', 'Greenland', 'Ukraine', 'Ebola',
  'Taiwan', 'Zohran Mamdani', 'America250', 'JD Vance', 'Signal Gate', 'Conclave',

  // AI
  'Claude Code', 'Agentic AI', 'Anthropic', 'Project Glasswing', 'Claude Mythos', 'Grok 5',
  'AI job loss', 'AI spend', 'Snap Specs', 'AI pushback', 'AI Slop', 'Elon Musk',

  // sports
  'The Winter Olympics', 'The World Cup', 'The Seahawks', 'The Knicks', 'Alysa Liu',

  // music
  'Bad Bunny', 'Kendrick Lamar', 'Taylor Swift', 'The Swift-Kelce wedding', 'Sabrina Carpenter',
  'Chappell Roan', 'The Chappell Roan Security Saga', 'Billie Eilish', 'Benson Boone',

  // film & TV
  'GTA VI', 'Lucia', 'K-Pop Demon Hunters', 'One Battle After Another', 'Sinners',
  'Michael B. Jordan', 'Stranger Things', 'Devil Wears Prada 2', 'The White Lotus', 'Squid Game Season 3',

  // culture, society & misc
  "Colbert's sign-off", '"2026 is the new 2016"', 'GLP-1s', 'Artemis II', 'El Niño',
  'Climate migration', 'RFK Jr.', 'Pete Hegseth', 'Pope Leo XIV', 'The LA Wildfires',
  'DOGE', 'The Oscars',
]

// Optional play-in pairs — topical fight-for-a-spot matchups. Winners join the 64.
export const SEED_PLAYIN_PAIRS: [string, string][] = [
  ['OpenAI', 'DeepSeek'],
  ['TikTok Banned', 'TikTok Unbanned'],
  ['The Sean Combs Trial', 'The Luigi Mangione Trial'],
  ['The Met Gala', 'The Cannes Film Festival'],
]
