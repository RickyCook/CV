'use strict'

const _ = require('lodash')
const CSS = require('css')
const MIME = require('mime')
const Mustache = require('mustache')
const Promise = require('promise')
const SASS = require('node-sass')
const Tmp = require('tmp')
const URL = require('url')

const child_process = require('child_process')
const fs = require('fs')
const process = require('process')

function readRST() {
    return new Promise((resolve, reject) => {
        child_process.exec(
            'pandoc --to html README.rst',
            (err, stdout, stderr) => {
                if (err) {
                    reject([err, stderr])
                } else {
                    resolve(stdout)
                }
            }
        )
    })
}
function readParams() {
    return new Promise((resolve, reject) => {
        fs.readFile('params.json', (err, data) => {
            if (err) {
                reject(err)
                return
            }
            try {
                resolve(JSON.parse(data))
            } catch(ex) { reject(ex) }
        })
    })
}
function renderSASS() {
    return new Promise((resolve, reject) => {
        SASS.render({
            file: 'style.scss'
        }, (err, data) => {
            if (err) {
                reject(err)
                return
            } else {
                resolve(data.css.toString())
            }
        })
    })
}
function renderFullCSS() {
    return new Promise((resolve, reject) => {
        renderSASS()
            .then(cssData => {
                const ast = CSS.parse(cssData)
                if (!_.isEmpty(ast.stylesheet.parsingErrors)) {
                    reject(ast.stylesheet.parsingErrors)
                    return
                }
                const fontSrcs = _.flatten(_.map(
                    _.filter(
                        ast.stylesheet.rules,
                        rule => rule.type === 'font-face'
                    ),
                    rule => _.filter(
                        rule.declarations,
                        decl => decl.property === 'src'
                    )
                ))

                const urlRegex = new RegExp(/^url\("([^"]+)"\)/)
                const formatRegex = new RegExp(/format\("woff2"\)/)
                const cssPath = 'node_modules/roboto-slab-fontface-kit/'

                const fontData = {}

                const declPromises = _.map(fontSrcs, decl => {
                    const valueParts = _.map(
                        decl.value.split(','),
                        _.trim
                    )

                    const matchedValues = _.map(
                        valueParts,
                        value => ({
                            value: value,
                            match: value.match(urlRegex)
                        })
                    )
                    const partitionedMatches = _.partition(
                        matchedValues,
                        matchObj => _.isNil(matchObj.match)
                    )
                    const otherValues = _.map(
                        partitionedMatches[0],
                        matchObj => matchObj.value
                    )
                    const matchUrlValues = _.filter(
                        partitionedMatches[1],
                        matchObj => matchObj.value.match(formatRegex)
                    )
                    const fileUrls = _.uniq(_.map(
                        matchUrlValues,
                        matchObj => matchObj.match[1]
                    ))
                    const files = _.map(
                        fileUrls,
                        url => ({
                            url: url,
                            path: URL.parse(url).pathname,
                            mime: MIME.lookup(URL.parse(url).pathname)
                        })
                    )
                    _.each(files, fileObj => {
                        if (_.has(fontData, fileObj.path)) {
                            return
                        } else {
                            fontData[fileObj.path] = new Promise(
                                (fResolve, fReject) => fs.readFile(
                                    cssPath + fileObj.path,
                                    (err, data) => {
                                        if (err) {
                                            fReject(err)
                                            return
                                        }
                                        fResolve(data.toString('base64'))
                                    }
                                )
                            )
                        }
                    })
                    return new Promise((vResolve, vReject) =>
                        Promise.all(_.map(
                            files,
                            fileObj => fontData[fileObj.path]
                        ))
                            .then(res => {
                                const dataPairs = _.zip(files, res)
                                _.each(_.zip(files, res), pair => {
                                    const fileObj = pair[0]
                                    const data = pair[1]
                                    const urlValues = _.map(
                                        matchUrlValues,
                                        matchObj => matchObj.value.replace(
                                            fileObj.url,
                                            'data:' + fileObj.mime + ';base64,' + data
                                        )
                                    )
                                    // replace path, in value
                                    decl.value = _.concat(
                                        otherValues, urlValues
                                    ).join(', ')
                                })
                                vResolve()
                                return res
                            })
                    )
                })

                Promise.all(declPromises)
                    .then(res => {
                        Tmp.file((cErr, path, fd, cleanup) => {
                            if (cErr) {
                                reject(cErr)
                                return
                            }
                            fs.writeFile(fd, CSS.stringify(ast), wErr => {
                                if (wErr) {
                                    reject(wErr)
                                    return
                                }
                                resolve([fd, cleanup])
                            })
                        })
                        return res
                    })
                    .catch(reject)
            })
            .catch(reject)
    })
}
function render() {
    return new Promise(
        (resolve, reject) => Promise.all([
            readRST(),
            readFile('header.html'),
            readFile('footer.html'),
            readParams(),
            renderFullCSS(),
        ]).then(res => {
            const rstData = res[0]
            const headerData = res[1]
            const footerData = res[2]
            const params = res[3]
            const cssFd = res[4][0]
            const cssDone = res[4][1]

            fs.readFile(cssFd, (rErr, cssData) => {
                cssDone()

                if (rErr) {
                    reject(rErr)
                    return
                }
                try {
                    resolve(Mustache.render(
                        headerData + rstData + footerData,
                        _.merge(params, {css: cssData})
                    ))
                } catch(mErr) { reject(mErr) }
            })
        }).catch(reject)
    )
}

render()
    .then(console.log)
    .catch(res => {
        console.error(res)
        process.exit(1)
    })
