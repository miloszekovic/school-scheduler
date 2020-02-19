export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const urlSpecEndAt = reader.result.indexOf(',');
      resolve(reader.result.slice(urlSpecEndAt + 1));
    };
    reader.onerror = error => reject(error);
  });
}

export function dateify(target, ...fields) {
  for (const field of fields) {
    if (target[field] && typeof target[field] !== 'object') {
      target[field] = new Date(target[field]);
    }
  }
}

export function shortDate(date) {
  return `${date.getFullYear()}/${date.getMonth() +
    1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}

/**
 * Join all arguments into a className string
 */
export function classes() {
  const results = [];
  for (let i = 0; i < arguments.length; i++) {
    let arg = arguments[i];
    if (!arg) {
      continue;
    }
    if (Array.isArray(arg)) {
      arg = classes.apply(null, arg);
    }
    results.push(String(arg));
  }
  return results.join(' ');
}

export function hmToMinutes(hours, minutes = 0) {
  return hours * 60 + minutes;
}

/**
 * @return {{hours, minutes}}
 */
export function minutesToHm(minutes) {
  const hours = Math.floor(minutes / 60);
  return {
    hours,
    minutes: minutes - hours * 60,
  };
}

/**
 * @param {{hours, minutes}|number} hours
 * @param {number} minutes
 */
export function hmToString(hours, minutes = undefined) {
  if (typeof hours === 'object') {
    minutes = hours.minutes;
    hours = hours.hours;
  }
  return `${hours}:${String(minutes).padStart(2, '0')}`;
}

export function minutesToString(minutes) {
  return hmToString(minutesToHm(minutes));
}
