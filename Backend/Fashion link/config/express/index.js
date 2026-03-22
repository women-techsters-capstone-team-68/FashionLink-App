// central place to configure Express-specific settings
// you can require this from src/app.js if you decide to split responsibilities

module.exports = (app) => {
  // example: change default JSON limit
  app.set('json spaces', 2);
  // add any global middleware or configuration here
  // e.g. app.use(require('helmet')());
  // e.g. app.use(require('compression')());
};
