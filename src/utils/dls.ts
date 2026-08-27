// Duckworth-Lewis-Stern (DLS) Standard Edition Mathematical Model
// Relies on exponential decay parameters to calculate resource percentages.

const b = 0.0305; // Standard decay constant

// F(w) represents resource fraction remaining for w wickets lost (0 to 10)
const F = [
  1.0,      // 0 wickets down
  0.934,    // 1 wicket down
  0.851,    // 2 wickets down
  0.749,    // 3 wickets down
  0.627,    // 4 wickets down
  0.490,    // 5 wickets down
  0.349,    // 6 wickets down
  0.220,    // 7 wickets down
  0.119,    // 8 wickets down
  0.047,    // 9 wickets down
  0.0       // 10 wickets down (all out)
];

/**
 * Calculates resource percentage remaining (0 to 100).
 * @param oversRemaining - Overs remaining to be faced
 * @param wicketsLost - Wickets already lost
 */
export function getResourcesRemaining(oversRemaining: number, wicketsLost: number): number {
  if (wicketsLost >= 10 || oversRemaining <= 0) return 0;
  
  const fw = F[Math.min(10, Math.max(0, wicketsLost))];
  if (fw === 0) return 0;
  
  const exponent = (-b * oversRemaining) / fw;
  const normalizationExponent = (-b * 50) / fw;
  
  const resource = fw * (1 - Math.exp(exponent)) / (1 - Math.exp(normalizationExponent)) * 100;
  return Math.min(100, Math.max(0, resource));
}

/**
 * Calculates DLS target and par scores.
 * @param team1Score - Team 1 total score
 * @param r1 - Team 1 total resource percentage (0 to 100)
 * @param r2 - Team 2 total resource percentage (0 to 100)
 * @param g50 - Average 50-over score (default 245 for T20/ODIs)
 */
export function calculateDLSTarget(
  team1Score: number,
  r1: number,
  r2: number,
  g50: number = 245
): { target: number; parScore: number } {
  if (r1 <= 0) return { target: team1Score + 1, parScore: team1Score };
  
  let parScore = 0;
  if (r2 <= r1) {
    parScore = Math.floor(team1Score * (r2 / r1));
  } else {
    parScore = Math.floor(team1Score + (g50 * (r2 - r1) / 100));
  }
  
  return {
    target: parScore + 1,
    parScore
  };
}
