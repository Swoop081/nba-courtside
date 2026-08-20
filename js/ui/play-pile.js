// One physical card play must occupy exactly one Play Pile slot. Exchange-state
// events update the existing slot rather than manufacturing duplicate cards.
export function reconstructCurrentPlayPile(state, {
  cardById,
  playedCardFromEvent = () => null,
  humanId = "p1",
  cpuId = "p2",
  limit = 8
} = {}) {
  if (!state || !cardById) return [];
  let startIndex = 0;
  for (let i = (state.log?.length ?? 0) - 1; i >= 0; i--) {
    if (state.log[i]?.type === "CONTROL_PASSED") { startIndex = i + 1; break; }
  }
  const lookup = id => typeof cardById.get === "function" ? cardById.get(id) : cardById[id];
  const items = [];
  const moveItems = [];
  const addMove = (cardId, playerId, event, resolved = false) => {
    const card = cardId ? lookup(cardId) : null;
    if (!card) return null;
    const item = { card, playerId, event, isMovePlay: true, resolved };
    items.push(item);
    moveItems.push(item);
    return item;
  };
  const latestMove = (playerId, cardId, { unresolvedOnly = false } = {}) => {
    for (let i = moveItems.length - 1; i >= 0; i--) {
      const item = moveItems[i];
      if (item.playerId !== playerId || item.card?.id !== cardId) continue;
      if (unresolvedOnly && item.resolved) continue;
      return item;
    }
    return null;
  };
  const utilityTypes = new Set(["MOMENTUM_PLAYED","ACTION_PLAYED","SUPPORT_PLAYED","MANAGER_PLAYED","SPECIAL_PLAYED","PIN_ESCAPED_SPECIAL"]);

  for (let i = startIndex; i < (state.log?.length ?? 0); i++) {
    const event = state.log[i];
    if (!event) continue;
    if (event.type === "MOVE_DECLARED") {
      addMove(event.cardId, event.playerId, event, false);
      continue;
    }
    if (event.type === "MOVE_COUNTERED") {
      const incomingPlayerId = event.attackerId ?? (event.defenderId === humanId ? cpuId : humanId);
      const incoming = latestMove(incomingPlayerId, event.incomingCardId, { unresolvedOnly: true })
        ?? latestMove(incomingPlayerId, event.incomingCardId);
      if (incoming) { incoming.event = { ...event, type: "MOVE_COUNTERED" }; incoming.resolved = true; }
      addMove(event.counterCardId, event.defenderId, { ...event, type: "MOVE_COUNTERED" }, event.counterAttack === false);
      continue;
    }
    if (event.type === "MOVE_CONNECTED") {
      const playerId = event.playerId ?? event.attackerId;
      const existing = latestMove(playerId, event.cardId, { unresolvedOnly: true })
        ?? latestMove(playerId, event.cardId);
      if (existing) { existing.event = event; existing.resolved = true; }
      else addMove(event.cardId, playerId, event, true);
      continue;
    }
    // COUNTER_ATTACK_DECLARED is intentionally ignored: it is a state update
    // for the counter card already added by MOVE_COUNTERED.
    if (utilityTypes.has(event.type)) {
      const found = playedCardFromEvent(event);
      if (found) items.push(found);
    }
  }

  const proposed = state.proposedMove?.card;
  if (proposed) {
    const playerId = state.proposedMove.attackerId;
    const existing = latestMove(playerId, proposed.id, { unresolvedOnly: true });
    if (existing) existing.event = { type: "MOVE_DECLARED", cardId: proposed.id, playerId };
    else addMove(proposed.id, playerId, { type: "MOVE_DECLARED", cardId: proposed.id, playerId }, false);
  }
  return items.slice(-limit).reverse();
}
