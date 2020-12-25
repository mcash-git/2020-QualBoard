// parameter should be a moment.js Duration instance
export function humanizeMomentDuration(duration) {
  if (duration.asMilliseconds() < 0) {
    throw new Error('negative durations are not yet supported by humanizeMomentDuration()');
  }
  
  const days = duration.days();
  const dayStr = `${days >= 10 ? days : `0${days}`}`;
  const hours = duration.hours();
  const hourStr = `${hours >= 10 ? hours : `0${hours}`}`;
  const minutes = duration.minutes();
  const minuteStr = `${minutes >= 10 ? minutes : `0${minutes}`}`;
  const seconds = duration.seconds();
  const secondStr = `${seconds >= 10 ? seconds : `0${seconds}`}`;
  
  if (days === 0) {
    if (hours === 0) {
      if (minutes === 0) {
        return `${seconds} seconds`;
      }
      
      return `${minuteStr}:${secondStr}`;
    }
    
    return `${hourStr}:${minuteStr}:${secondStr}`;
  }
  
  return `${dayStr}:${hourStr}:${minuteStr}:${secondStr}`;
}
