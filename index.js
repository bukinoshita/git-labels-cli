#!/usr/bin/env node
'use strict'

const SaveLocal = require('save-local')
const gitLabels = require('git-labels')
const meow = require('meow')
const shoutSuccess = require('shout-success')
const shoutError = require('shout-error')
const chalk = require('chalk')
const inquirer = require('inquirer')
const updateNotifier = require('update-notifier')
const loadJsonFile = require('load-json-file')

const labels = require('./labels')

const saveLocal = new SaveLocal('git-labels-store')

const cli = meow(
  `
  Usage:
    $ git-labels <project-name>           create new labels to github project
    $ git-labels --auth                   github authentication
    $ git-labels --file labels.json       import custom labels

  Example:
    $ git-labels bukinoshita/git-labels
    $ git-labels --auth
    $ git-labels --file labels.json

  Options:
    -a, --auth                            github authentication to be able to create labels
    -f, --file                            import custom labels
    -h, --help                            show help options
    -v, --version                         show version
`,
  {
    alias: {
      a: 'auth',
      f: 'file',
      h: 'help',
      v: 'version'
    }
  }
)

updateNotifier({ pkg: cli.pkg }).notify()

const run = () => {
  if (cli.flags.auth) {
    return inquirer
      .prompt([
        {
          message: 'Your access token',
          name: 'token'
        }
      ])
      .then(({ token }) => saveLocal.set({ name: 'token', value: token }))
  }

  if (cli.input[0]) {
    return saveLocal
      .get('token')
      .then(token => {
        if (!token) {
          return shoutError(
            `You don't have an access token. Please, create at https://github.com/settings/tokens/new and run ${chalk.bold(
              '$ git-labels --auth'
            )}.`
          )
        }

        const labelList = cli.flags.file
          ? loadJsonFile.sync(cli.flags.file)
          : labels

        return gitLabels(cli.input[0], labelList, token)
          .then(res => {
            if (res) {
              return shoutError(`${res.statusCode} — ${res.statusMessage}.`)
            }

            shoutSuccess(
              `Labels created. Check on https://github.com/${cli
                .input[0]}/labels`
            )
          })
          .catch(err => err)
      })
      .catch(err => shoutError(err))
  }

  cli.showHelp()
}

run()
