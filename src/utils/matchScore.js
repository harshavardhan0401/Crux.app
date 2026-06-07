export function calculateMatchScore(userSkills, projectTechStack) {
  const userSkillNames = userSkills.map(s => s.name.toLowerCase())
  const matched = projectTechStack.filter(t => userSkillNames.includes(t.toLowerCase()))
  const missing = projectTechStack.filter(t => !userSkillNames.includes(t.toLowerCase()))
  const score = projectTechStack.length === 0 ? 0 : Math.round((matched.length / projectTechStack.length) * 100)
  return { score, matched, missing }
}
