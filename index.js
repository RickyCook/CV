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

function readFile(filename) {
    return new Promise((resolve, reject) =>
        fs.readFile(filename, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    )
}
function _writeTemp(resolve, reject, data) {
    Tmp.file((cErr, path, fd, cleanup) => {
        if (cErr) {
            reject(cErr)
            return
        }
        fs.writeFile(fd, data, wErr => {
            if (wErr) {
                reject(wErr)
                return
            }
            resolve([path, fd, cleanup])
        })
    })
}
function writeTemp(data) {
    return new Promise((resolve, reject) => {
        if (_.has(data, 'then')) {
            data.then(data => _writeTemp(resolve, reject, data))
            return
        }
        _writeTemp(resolve, reject, data)
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
function renderRSTParams() {
    return new Promise((resolve, reject) => {
        Promise.all([
            readFile('README.rst'),
            readParams()
        ])
            .then(res => {
                const rstData = res[0]
                const params = res[1]
                try {
                    resolve(Mustache.render(
                        rstData.toString(), params
                    ))
                } catch(err) { reject(err) }
            })
    })
}
function renderedRSTParamsFile() {
    return new Promise((resolve, reject) =>
        renderRSTParams()
            .then(data =>
                writeTemp(data)
                    .then(resolve)
                    .catch(reject)
            )
    )
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
                        writeTemp(CSS.stringify(ast))
                            .then(resolve)
                            .catch(reject)
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
            renderedRSTParamsFile(),
            renderFullCSS()
        ]).then(res => {
            const rstPath = res[0][0]
            const rstDone = res[0][2]
            const cssPath = res[1][0]
            const cssDone = res[1][2]

            child_process.exec(
                "rst2html.py --stylesheet '" + cssPath + "' '" + rstPath + "'",
                (err, stdout, stderr) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    rstDone()
                    cssDone()
                    resolve(stdout)
                }
            )
        }).catch(reject)
    )
}

render()
    .then(console.log)
    .catch(res => {
        console.error(res)
        process.exit(1)
    })
