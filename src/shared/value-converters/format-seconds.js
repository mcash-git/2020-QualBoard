import moment from 'moment-timezone';

function padLeftZeroes(input, places) {
  let str = `${input}`;
  
  while (str.length < places) {
    str = `0${str}`;
  }
  
  return str;
}

export const formatSeconds = (seconds) => {
  const duration = moment.duration(Math.round(seconds) * 1000);
  
  return `${padLeftZeroes(duration.minutes(), 2)}:${padLeftZeroes(duration.seconds(), 2)}`;
};
