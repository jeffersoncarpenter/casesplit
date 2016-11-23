var isFunction = function(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
};

var doCaseSplit = function (cases, obj) {
  if (!obj) {
    debugger;
  }
  for (var key in obj) {
	if (cases.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
      return cases[key](obj[key]);
    }
  }
  throw 'no case for ' + JSON.stringify(obj);
};

module.exports = function (cases, obj) {
  if (!obj) {
    // curried (recommended)
    return function (obj) {
      return doCaseSplit(cases, obj);
    };
  }
  // not curried
  return doCaseSplit(cases, obj);
};
