// Turns raw call records from parser.js into a WrappedStats object.
// record shape: { date: Date, duration: number, address: string, name: string|null, answered: boolean }

const PERSON_EMOJIS = ['💚', '💜', '💙', '🧡', '❤️', '💛', '🩷']

const ACHIEVEMENTS = [
  { id: 'night-owl',  emoji: '🦉', label: 'Night Owl',        test: s => s.lateNightCalls >= 30  },
  { id: 'marathon',   emoji: '🏃', label: 'Marathon Caller',  test: s => s.longestCall.seconds >= 7200   },
  { id: 'butterfly',  emoji: '🦋', label: 'Social Butterfly', test: s => s.uniquePeople >= 20    },
  { id: 'loyal',      emoji: '🔥', label: 'Streak Keeper',    test: s => s.longestStreak.days >= 14 },
  { id: 'chatterbox', emoji: '💬', label: 'Chatterbox',       test: s => s.totalCalls >= 300     },
  { id: 'globetrotter', emoji: '✈️', label: 'Globe Trotter',  test: s => s.places.length >= 4    },
]

export function processRecords(records, year) {
  const calls = records.filter(r => r.answered && r.duration > 10)
  if (calls.length === 0) return null

  const totalSeconds = calls.reduce((s, r) => s + r.duration, 0)
  const totalCalls = calls.length

  // Group by person
  const byPerson = {}
  for (const c of calls) {
    const key = c.name || c.address || 'Unknown'
    if (!byPerson[key]) byPerson[key] = { name: key, calls: 0, seconds: 0, dates: [] }
    byPerson[key].calls++
    byPerson[key].seconds += c.duration
    byPerson[key].dates.push(c.date)
  }

  const people = Object.values(byPerson).sort((a, b) => b.seconds - a.seconds)
  const uniquePeople = people.length

  const topPeople = people.slice(0, 5).map(p => ({ name: p.name, calls: p.calls, seconds: p.seconds }))
  const topPerson = { ...topPeople[0], emoji: PERSON_EMOJIS[0] }

  // Longest single call
  const longest = calls.reduce((best, r) => r.duration > best.duration ? r : best)
  const longestCall = {
    name: longest.name || longest.address || 'Unknown',
    seconds: Math.floor(longest.duration),
    date: longest.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
  }

  // Busiest day of week + full weekly pattern for bar chart
  const dayCounts = Array(7).fill(0)
  for (const c of calls) dayCounts[c.date.getDay()]++
  const DAY_NAMES       = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const DAY_NAMES_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const busiestIdx = dayCounts.indexOf(Math.max(...dayCounts))
  const busiestDay = { label: DAY_NAMES[busiestIdx], calls: dayCounts[busiestIdx] }
  const weeklyPattern = DAY_NAMES_SHORT.map((day, i) => ({ day, calls: dayCounts[i] }))

  // Late night calls (midnight–5 am)
  const lateNightCalls = calls.filter(c => { const h = c.date.getHours(); return h < 5 }).length

  // Longest streak (consecutive days calling the same person)
  let longestStreak = { name: 'Unknown', days: 1 }
  for (const p of people) {
    const uniqueDates = [...new Set(p.dates.map(d => d.toISOString().slice(0, 10)))].sort()
    let streak = 1, best = 1
    for (let i = 1; i < uniqueDates.length; i++) {
      const gap = (new Date(uniqueDates[i]) - new Date(uniqueDates[i - 1])) / 86400000
      streak = gap === 1 ? streak + 1 : 1
      if (streak > best) best = streak
    }
    if (best > longestStreak.days) longestStreak = { name: p.name, days: best }
  }

  // Places — ZLOCATIONIDENTIFIER if available, else empty
  const places = []

  const stats = {
    year,
    name: 'You',
    totalSeconds,
    totalCalls,
    uniquePeople,
    longestCall,
    topPerson,
    topPeople,
    places,
    longestStreak,
    busiestDay,
    weeklyPattern,
    lateNightCalls,
    achievements: [],
  }

  stats.achievements = ACHIEVEMENTS.filter(a => a.test(stats)).map(({ id, emoji, label }) => ({ id, emoji, label }))

  return stats
}
