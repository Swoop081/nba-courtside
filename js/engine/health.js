export const GREEN_HEALTH_MIN = 0.65;
export const AMBER_HEALTH_MIN = 0.25;
export const RED_HEALTH_DISPLAY_MAX = 0.24;

export function healthRatio(player) {
  if (!player?.maxHp) return 0;
  return Math.max(0, Math.min(1, player.hp / player.maxHp));
}

export function healthZone(player) {
  const ratio = healthRatio(player);
  if (ratio >= GREEN_HEALTH_MIN) return "green";
  if (ratio >= AMBER_HEALTH_MIN) return "amber";
  return "red";
}

export function healthOnlyPinChance(player) {
  const hp = Math.max(0, Math.floor(Number(player?.hp ?? 0)));
  if (hp <= 4) return 75;
  if (hp === 5) return 70;
  if (hp === 6) return 60;
  if (hp === 7) return 55;
  if (hp === 8) return 50;
  if (hp === 9) return 48;
  if (hp === 10) return 45;
  if (hp === 11) return 40;
  if (hp === 12) return 35;
  if (hp === 13) return 30;
  if (hp === 14) return 25;
  if (hp === 15) return 20;
  return 5;
}
