
import { PredictionData } from '../types';

const BASE_PERIOD_PREFIX = "202512191000";
const START_ID = 50000;
const END_ID = 52880;

// Deterministic random based on period index
const getSeed = (index: number) => {
  const x = Math.sin(index) * 10000;
  return x - Math.floor(x);
};

export const generatePrediction = (periodId: string): PredictionData => {
  const index = parseInt(periodId.slice(-5));
  const seed = getSeed(index);
  const num = Math.floor(seed * 10);
  
  let size: 'Big' | 'Small' = num >= 5 ? 'Big' : 'Small';
  let color: PredictionData['color'] = 'Red';

  if (num === 0) color = 'Red+Violet';
  else if (num === 5) color = 'Green+Violet';
  else if ([1, 3, 7, 9].includes(num)) color = 'Green';
  else if ([2, 4, 6, 8].includes(num)) color = 'Red';

  return {
    period: periodId,
    number: num,
    size,
    color
  };
};

export const getCurrentPeriodId = (durationSeconds: number = 60): string => {
  const now = new Date();
  const totalSeconds = Math.floor(now.getTime() / 1000);
  const cycleIndex = Math.floor(totalSeconds / durationSeconds) % (END_ID - START_ID);
  const currentId = START_ID + cycleIndex;
  return `${BASE_PERIOD_PREFIX}${currentId}`;
};

export const getHistory = (count: number, durationSeconds: number = 60): PredictionData[] => {
  const current = getCurrentPeriodId(durationSeconds);
  const baseId = parseInt(current.slice(-5));
  const history: PredictionData[] = [];
  
  for (let i = 1; i <= count; i++) {
    const historicalId = `${BASE_PERIOD_PREFIX}${baseId - i}`;
    history.push(generatePrediction(historicalId));
  }
  return history;
};
