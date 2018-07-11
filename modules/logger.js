var log4js = require('log4js');


log4js.configure({
    appenders: {
      out: { type: 'stdout' },
      router: { type: 'file', filename: 'logs/router.log' }
    },
    categories: {
      default: { appenders: [ 'out' ], level: 'debug' },
      router: { appenders: ['router', 'out'], level: 'debug' }
    }
  });

  module.exports.routerLogger = log4js.getLogger('router')


