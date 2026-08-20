import { cardsForSet } from './collection.js?v=0.13.72';
import { ownedCount } from './profile.js?v=0.13.72';

export const SET_LIFECYCLES = ['featured','vaulted','returning'];
export const COLLECTION_MILESTONES = [
  { percent: 25, reward: 1 }, { percent: 50, reward: 2 }, { percent: 75, reward: 3 }, { percent: 100, reward: 5 }
];
export const FOIL_MILESTONES = [
  { percent: 25, reward: 1 }, { percent: 50, reward: 2 }, { percent: 75, reward: 3 }, { percent: 100, reward: 5 }
];

function ensure(profile, setId = 'summerslam-series-1') {
  profile.setProgress ??= {};
  profile.setProgress[setId] ??= { lifecycle: 'featured', claimedCollection: [], claimedFoil: [] };
  return profile.setProgress[setId];
}
export function setProgressState(profile, setId = 'summerslam-series-1') { return ensure(profile, setId); }
export function setLifecycle(profile, lifecycle, setId = 'summerslam-series-1') {
  if (!SET_LIFECYCLES.includes(lifecycle)) throw new Error('Invalid set lifecycle');
  ensure(profile,setId).lifecycle = lifecycle; return lifecycle;
}
export function collectionProgress(profile, setId = 'summerslam-series-1') {
  const collectionCards = cardsForSet(setId);
  const total = collectionCards.length;
  const ownedUnique = collectionCards.filter(c => ownedCount(profile, c.id, 'normal') + ownedCount(profile, c.id, 'foil') > 0).length;
  const foilUnique = collectionCards.filter(c => ownedCount(profile, c.id, 'foil') > 0).length;
  return { setId, total, ownedUnique, foilUnique, percent: total ? Math.floor((ownedUnique/total)*100) : 0, foilPercent: total ? Math.floor((foilUnique/total)*100) : 0 };
}
export function availableMilestoneRewards(profile, setId = 'summerslam-series-1') {
  const state = ensure(profile,setId), progress = collectionProgress(profile,setId);
  return {
    collection: COLLECTION_MILESTONES.filter(m => progress.percent >= m.percent && !state.claimedCollection.includes(m.percent)),
    foil: FOIL_MILESTONES.filter(m => progress.foilPercent >= m.percent && !state.claimedFoil.includes(m.percent))
  };
}
export function claimMilestone(profile, type, percent, setId = 'summerslam-series-1') {
  const state = ensure(profile,setId), list = type === 'foil' ? FOIL_MILESTONES : COLLECTION_MILESTONES;
  const claimed = type === 'foil' ? state.claimedFoil : state.claimedCollection;
  const progress = collectionProgress(profile,setId);
  const actual = type === 'foil' ? progress.foilPercent : progress.percent;
  const milestone = list.find(m => m.percent === Number(percent));
  if (!milestone) throw new Error('Milestone not found');
  if (actual < milestone.percent) throw new Error('Milestone not reached');
  if (claimed.includes(milestone.percent)) throw new Error('Milestone already claimed');
  claimed.push(milestone.percent);
  profile.boosterCreditsBySet ??= {};
  profile.boosterCreditsBySet[setId] = (profile.boosterCreditsBySet[setId] ?? 0) + milestone.reward;
  if (setId === 'summerslam-series-1') profile.boosterCredits = profile.boosterCreditsBySet[setId];
  return milestone.reward;
}
export function boosterSetAvailable(profile, setId = 'summerslam-series-1') { return ensure(profile,setId).lifecycle !== 'vaulted'; }
