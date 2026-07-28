import { motion } from "framer-motion";

export default function ScoreBug() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="scorebug"
    >
      <div className="team">
        <img src="/logos/teamA.png" alt="Team A" />
        <span>IND</span>
        <strong>145/3</strong>
      </div>
      <div className="overs">16.4 Overs</div>
      <div className="team">
        <img src="/logos/teamB.png" alt="Team B" />
        <span>AUS</span>
      </div>
    </motion.div>
  );
}
