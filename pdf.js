const system = require('system')
const webpage = require('webpage')

const renderEnv = system.args[1]

const page = webpage.create()
page.paperSize = 'A4'
page.open(renderEnv + '.html', function(status) {
    page.render(renderEnv + '.pdf')
    phantom.exit()
})
