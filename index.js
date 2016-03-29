#!/usr/bin/env node
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

function rpad(str, padStr, length) {
    while (str.length < length) {
        str = str + padStr
    }

    return str
}

function tpl_pad60(text, render) {
    return rpad(render(text), ' ', 60)
}

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
            resolve({
                path: path,
                fd: fd,
                cleanup: cleanup
            })
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
function readParams(paramsPath) {
    return new Promise((resolve, reject) => {
        readFile(paramsPath)
            .then(data => {
                try {
                    resolve(JSON.parse(data))
                } catch(ex) { reject(ex) }
            })
            .catch(reject)
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
function renderRSTParams(paramsPath) {
    return new Promise((resolve, reject) => {
        Promise.all([
            readFile('README.rst'),
            readParams(paramsPath)
        ])
            .then(res => {
                const rstData = res[0]
                const params = res[1]
                try {
                    resolve(Mustache.render(
                        rstData.toString(),
                        _.merge(params, {
                            pad60: () => tpl_pad60
                        })
                    ))
                } catch(err) { reject(err) }
            })
    })
}
function renderedRSTParamsFile(paramsPath) {
    return new Promise((resolve, reject) =>
        renderRSTParams(paramsPath)
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
                                (fResolve, fReject) => {
                                    readFile(cssPath + fileObj.path)
                                        .then(data => fResolve(
                                            data.toString('base64')
                                        ))
                                        .catch(fReject)
                                }
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

function render(paramsPath) {
    return new Promise(
        (resolve, reject) => Promise.all([
            renderedRSTParamsFile(paramsPath),
            renderFullCSS()
        ]).then(res => {
            const rst = res[0]
            const css = res[1]

            child_process.exec(
                "rst2html.py --stylesheet '" + css.path + "' '" + rst.path + "'",
                (err, stdout, stderr) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    rst.cleanup()
                    css.cleanup()
                    resolve(stdout)
                }
            )
        }).catch(reject)
    )
}

render(process.argv[2])
    .then(console.log)
    .catch(res => {
        console.error(res)
        process.exit(1)
    })
