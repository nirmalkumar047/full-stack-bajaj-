
exports.isValid = (str) => /^[A-Z]->[A-Z]$/.test(str) && str[0] !== str[3];
