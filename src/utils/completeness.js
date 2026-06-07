export function getCompleteness(user) {
  const checks = [
    { label: 'Name and photo', done: !!user.name },
    { label: 'College and year', done: !!user.college && !!user.year },
    { label: 'Skills added', done: user.skills?.length > 0 },
    { label: 'Roles selected', done: user.roles?.length > 0 },
    { label: 'GitHub linked', done: !!user.github },
    { label: 'LinkedIn linked', done: !!user.linkedin },
    { label: 'Portfolio linked', done: !!user.portfolio },
  ]
  const done = checks.filter(c => c.done).length
  return { checks, score: Math.round((done / checks.length) * 100) }
}
