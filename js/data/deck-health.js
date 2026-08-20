export const RECOMMENDED_DECK_SHAPE = Object.freeze({
  size: 60,
  leadOff: 5,
  copyCap: 5,
  momentumCopyCap: 12
});

export function deckBucket(card) {
  if (!card) return "other";
  if (card.kind === "momentum") return "momentum";
  if (["action", "support", "manager"].includes(card.kind)) return "utility";
  if (card.kind !== "move") return "other";
  if (card.finisher || card.trademark) return "signature";
  const cost = Number(card.cost ?? 0);
  if (cost <= 3) return "low";
  if (cost <= 6) return "mid";
  return "high";
}

export function deckComposition(cards = []) {
  const counts = {
    momentum: 0,
    low: 0,
    mid: 0,
    high: 0,
    signature: 0,
    utility: 0,
    counters: 0,
    finishers: 0,
    trademarks: 0
  };
  for (const card of cards) {
    const bucket = deckBucket(card);
    if (bucket in counts) counts[bucket] += 1;
    if (card?.kind === "move" && (card.defensiveOnly || card.moveType === "counter" || card.counters?.length || card.counterStates?.length || card.counterSubmissionTargets?.length || card.countersCardIds?.length)) counts.counters += 1;
    if (card?.finisher) counts.finishers += 1;
    if (card?.trademark) counts.trademarks += 1;
  }
  return counts;
}

export function evaluateDeckHealth(cards = []) {
  const countsById = new Map();
  const familyCounts = new Map();
  const violations = [];
  for (const card of cards) {
    countsById.set(card.id, (countsById.get(card.id) ?? 0) + 1);
    if (card?.copyFamily) familyCounts.set(card.copyFamily, (familyCounts.get(card.copyFamily) ?? 0) + 1);
  }

  if (cards.length !== RECOMMENDED_DECK_SHAPE.size) {
    violations.push(`Deck must contain ${RECOMMENDED_DECK_SHAPE.size} pages (${cards.length}/${RECOMMENDED_DECK_SHAPE.size}).`);
  }
  for (const [id, count] of countsById) {
    const card = cards.find(c => c.id === id);
    const defaultCap = card?.kind === "momentum" ? RECOMMENDED_DECK_SHAPE.momentumCopyCap : RECOMMENDED_DECK_SHAPE.copyCap;
    const cap = Math.min(defaultCap, Number.isFinite(card?.maxCopies) ? card.maxCopies : defaultCap);
    if (count > cap) violations.push(`${card?.name ?? id} exceeds copy cap (${count}/${cap}).`);
  }

  for (const [family, count] of familyCounts) {
    if (count > RECOMMENDED_DECK_SHAPE.copyCap) violations.push(`${family === "german-suplex" ? "German Suplex family" : family} exceeds combined copy cap (${count}/${RECOMMENDED_DECK_SHAPE.copyCap}).`);
  }

  const comp = deckComposition(cards);
  return {
    healthy: violations.length === 0,
    score: Math.max(0, 100 - violations.length * 20),
    violations,
    counts: {
      momentum: comp.momentum,
      lowCostMoves: comp.low,
      midCostMoves: comp.mid,
      highCostMoves: comp.high,
      counters: comp.counters,
      utility: comp.utility,
      finishers: comp.finishers,
      trademarks: comp.trademarks,
      signatures: comp.signature
    }
  };
}
