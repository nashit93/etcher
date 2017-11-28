/*
 * Copyright 2017 resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

const Bluebird = require('bluebird')
const spectron = require('spectron')
const EXIT_CODES = require('../../lib/shared/exit-codes')
const entrypoint = process.env.ETCHER_SPECTRON_ENTRYPOINT

if (!entrypoint) {
  console.error('You need to properly configure ETCHER_SPECTRON_ENTRYPOINT')
  process.exit(EXIT_CODES.GENERAL_ERROR)
}

describe('Spectron', function () {
  // Mainly for CI jobs, Appveyor CI in particular
  // times out even on >30 seconds timeouts.
  this.timeout(120000)

  beforeEach(function () {
    this.app = new spectron.Application({
      path: entrypoint,
      args: [ '.' ]
    })

    return this.app.start()
  })

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }

    return Bluebird.resolve()
  })

  require('./browser-window')()
})
