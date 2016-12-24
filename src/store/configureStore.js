if (__DEV__) {
  module.exports = require('./configureStore.development').default;
}
else {
  module.exports = require('./configureStore.production').default;
}
