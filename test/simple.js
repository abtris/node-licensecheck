var assert = require('assert')
var path = require('path')

var licensecheck = require('../index.js')
var normalizeText = require('../normtext.js')
var urltolicense = require('../urltolicense')

suite('Simple')

function testResult(result, name, license, filename) {
    assert.equal(name, result.name, "name mismatch for " + name)
    assert.equal(license, result.license, "license mismatch for " + name)
    if (filename) {
        assert.equal(filename, path.basename(result.licenseFile), "filename mismatch for " + name)
    }
}

test('licensecheck self', function () {
    var result = licensecheck('.', __dirname + "/../")

    testResult(result, "licensecheck", "zlib License (https://spdx.org/licenses/Zlib)", "package.json")

    assert.equal(5, result.deps.length)
    testResult(result.deps[0], "colors", "MIT License (https://spdx.org/licenses/MIT)", "MIT-LICENSE.txt")
    testResult(result.deps[1], "markdown", "MIT (http://www.opensource.org/licenses/mit-license.php)", "package.json")
    testResult(result.deps[2], "spdx-license-list", "MIT License (https://spdx.org/licenses/MIT)", "package.json")
    testResult(result.deps[3], "strip-json-comments", "MIT License (https://spdx.org/licenses/MIT)", "package.json")
    testResult(result.deps[4], "treeify", "MIT (http://lp.mit-license.org/)", "package.json")
})

test('licensecheck --dev', function() {
    var result = licensecheck('.', __dirname + "/../", null, true)

    testResult(result, "licensecheck", "zlib License (https://spdx.org/licenses/Zlib)", "package.json")

    assert.equal(6, result.deps.length)
    testResult(result.deps[0], "colors", "MIT License (https://spdx.org/licenses/MIT)", "MIT-LICENSE.txt")
    testResult(result.deps[1], "markdown", "MIT (http://www.opensource.org/licenses/mit-license.php)", "package.json")
    testResult(result.deps[2], "mocha", "unknown")
    assert.equal('Dev', result.deps[2].depLevel)
    testResult(result.deps[3], "spdx-license-list", "MIT License (https://spdx.org/licenses/MIT)", "package.json")
    testResult(result.deps[4], "strip-json-comments", "MIT License (https://spdx.org/licenses/MIT)", "package.json")
    testResult(result.deps[5], "treeify", "MIT (http://lp.mit-license.org/)", "package.json")
})

test('licensecheck mochajs', function () {
    var result = licensecheck('.', __dirname + "/../node_modules/mocha")

    testResult(result, "mocha", "unknown")

    assert.equal(7, result.deps.length)

    testResult(result.deps[0], "commander", "MIT License (https://spdx.org/licenses/MIT)", "Readme.md")
    testResult(result.deps[1], "debug", "MIT License (https://spdx.org/licenses/MIT)", "package.json")
    testResult(result.deps[2], "diff", "BSD (http://github.com/kpdecker/jsdiff/blob/master/LICENSE)", "package.json")
    testResult(result.deps[3], "glob", 'BSD 2-clause "Simplified" License (https://spdx.org/licenses/BSD-2-Clause)', "package.json")
    testResult(result.deps[4], "growl", "MIT License (https://spdx.org/licenses/MIT)", "Readme.md")
    testResult(result.deps[5], "jade", "MIT License (https://spdx.org/licenses/MIT)", "LICENSE")
    testResult(result.deps[6], "mkdirp", "MIT License (https://spdx.org/licenses/MIT)", "package.json")

})

test('normalizeText', function() {
    assert.equal(
      'my hybrid ambiguous made up uiuc ncsa apache 2.0 or apache 2.0 license',
      normalizeText(' My hybrid,  (ambiguous!) made-up UIUC/NCSA Apache 2.0 (or Apache-2.0) license.')
    )
})

test('urltolicense', function() {
  assert.equal("MIT", urltolicense("http://www.opensource.org/licenses/MIT"))
  assert.equal("APACHE-2.0", urltolicense("http://opensource.org/licenses/APACHE-2.0"))
  assert.equal("EPL-1.0", urltolicense("https://www.opensource.org/licenses/EPL-1.0"))
  assert.equal("Zlib", urltolicense("https://opensource.org/licenses/Zlib"))
  assert.equal("BSD-3-Clause", urltolicense("www.opensource.org/licenses/BSD-3-Clause"))
  assert.equal("ISC", urltolicense("opensource.org/licenses/ISC"))
  assert.equal("mit", urltolicense("http://www.opensource.org/licenses/mit-license.php"))
  assert.equal("lgpl", urltolicense("http://www.opensource.org/licenses/lgpl-license"))

  assert.equal("Apache-2.0", urltolicense("http://spdx.org/licenses/Apache-2.0.html"))
  assert.equal("Apache-2.0", urltolicense("https://spdx.org/licenses/Apache-2.0.html"))
  assert.equal("MIT", urltolicense("http://www.spdx.org/licenses/MIT.html"))
  assert.equal("MIT", urltolicense("https://www.spdx.org/licenses/MIT.html"))
  assert.equal("Apache-2.0", urltolicense("https://www.spdx.org/licenses/Apache-2.0"))
})
