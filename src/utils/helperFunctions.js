// Validate Latitude and Longitude
// eslint-disable-next-line consistent-return
export function validateCordinate(key, val, maxLengths) {
  if (val.length > 0 && val.length <= maxLengths[key]) {
    const cordinate = parseFloat(val);
    if (!cordinate) return { error: true, message: `${key} must be a valid digit` };

    // Check for valid Latitude
    if (key === 'Latitude') {
      if (val >= -90 && val <= 90) {
        return { error: false };
      }
      return {
        error: true,
        message: `${key} value must be between -90 and +90`,
      };
    }
    // Check for valid Longitude
    if (key === 'Longitude') {
      if (val >= -180 && val <= 180) {
        return { error: false };
      }
      return {
        error: true,
        message: `${key} value must be between -180 and +180`,
      };
    }
  } else {
    return {
      error: true,
      message: `${key} must be a valid cordianate and cannot be more than 12 digits long (including decimal)`,
    };
  }
}

// Validate required fields
export function validateRequired(key, value, maxLengths) {
  if (value) {
    if (value.length <= maxLengths[key]) return { error: false };
    return {
      error: true,
      message: `${key} must be less than ${maxLengths[key]} characters`,
    };
  }
  return { error: true, message: `${key} is required` };
}

// Capitilize first letter
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
}

// Convert date to desired UTC offset
export function convertDate(utcoffSet, timestamp) {
  const newtime = new Date(parseFloat(timestamp));

  newtime.setHours(newtime.getHours() + parseFloat(utcoffSet));
  const convertedTime = newtime.toLocaleString('en-GB', { timeZone: 'UTC' });

  return convertedTime;
}
