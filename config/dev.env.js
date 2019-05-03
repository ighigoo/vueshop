'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  APIPATH: '"https://vue-course-api.hexschool.io"',
  // DETAILAPIPATH: '"http://localhost:3000"',
  DETAILAPIPATH: '"https://protected-river-71754.herokuapp.com"',
  CUSTOMPATH: '"ighigoo"',
})
