export const timeString = (timeInt) => {
  const now = Date.now();
  const diff = now - timeInt;
  const oneMinute = 60 * 1000;
  const oneHour = 60 * oneMinute;
  const oneDay = 24 * oneHour;
  // Less than a minute
  if (diff <= oneMinute) {
    return 'Just now';
  } else if (diff < oneHour) {
    return `${Math.floor(diff / oneMinute)}m`;
  } else if (diff < oneDay) {
    return `${Math.floor(diff / oneHour)}h`;
  } else {
    return `${Math.floor(diff / oneDay)}d`;
  }
};

export const countString = (count) => {
  if (count < 0) {
    throw new Error('Counts must be a positive integer');
  }
  if (count < 1000) {
    return count;
  } else if (count < 1000000) {
    return `${(count / 1000).toFixed(1)}k`;
  } else if (count < 1000000000) {
    return `${(count / 1000000).toFixed(2)}M`;
  } else {
    return `${(count / 1000000000).toFixed(2)}B`;
  }
};
