function removeEmpty(obj) {
  const newObj = {};
  Object.keys(obj).forEach(function (k) {
    if (obj[k] && typeof obj[k] === "object") {
      newObj[k] = removeEmpty(obj[k]);
    } else if (obj[k] !== null && obj[k] !== "" && obj[k] !== []) {
      newObj[k] = obj[k];
    }
  });
  return newObj;
}

module.exports = removeEmpty;
