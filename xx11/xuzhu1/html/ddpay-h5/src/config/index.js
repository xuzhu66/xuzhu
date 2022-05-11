const cli = require('./cli.config')
const network = require('./net.config')
module.exports = {
  ...cli,
  ...network
}
