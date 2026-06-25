// Pre-computed WrappedStats for the demo. Matches exactly the shape that
// processor.js produces from a real CallHistory.storedata parse.
export const demoStats = {
  year: 2025,
  name: 'You',

  totalSeconds: 387420,  // 107.6 hours
  totalCalls: 642,
  uniquePeople: 37,

  longestCall: { name: 'Mom', seconds: 17640, date: 'March 9' },

  topPerson: { name: 'Mom', calls: 188, seconds: 142800, emoji: '💚' },

  topPeople: [
    { name: 'Mom',     calls: 188, seconds: 142800 },
    { name: 'Jordan',  calls: 121, seconds: 88200  },
    { name: 'Alex',    calls: 76,  seconds: 51300  },
    { name: 'Sam',     calls: 54,  seconds: 33900  },
    { name: 'Grandma', calls: 41,  seconds: 29400  },
  ],

  places: [
    { name: 'Home',         calls: 402 },
    { name: 'The car',      calls: 96  },
    { name: 'Work',         calls: 71  },
    { name: 'Coffee shops', calls: 38  },
    { name: 'Airports',     calls: 19  },
    { name: 'The gym',      calls: 16  },
  ],

  longestStreak: { name: 'Jordan', days: 64 },

  busiestDay: { label: 'Sunday', calls: 134 },
  weeklyPattern: [
    { day: 'Sun', calls: 134 },
    { day: 'Mon', calls: 68  },
    { day: 'Tue', calls: 71  },
    { day: 'Wed', calls: 82  },
    { day: 'Thu', calls: 79  },
    { day: 'Fri', calls: 95  },
    { day: 'Sat', calls: 113 },
  ],
  lateNightCalls: 89,

  achievements: [
    { id: 'night-owl',  emoji: '🦉', label: 'Night Owl'       },
    { id: 'marathon',   emoji: '🏃', label: 'Marathon Caller'  },
    { id: 'butterfly',  emoji: '🦋', label: 'Social Butterfly' },
    { id: 'loyal',      emoji: '🔥', label: '64-Day Streak'    },
  ],
}
