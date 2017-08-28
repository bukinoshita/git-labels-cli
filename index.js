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

const labels = require('./labels')

const saveLocal = new SaveLocal('git-labels-store')

const cli = meow(
  `
  Usage:
    $ git-labels <project-name>     create new labels to github project
    $ git-labels --auth             github authentication

  Example:
    $ save-me bukinoshita/git-labels
    $ save-me --auth

  Options:
    -a, --auth                      github authentication to be able to create labels

    -h, --help                      Show help options
    -v, --version                   Show version
`,
  {
    alias: {
      a: 'auth',
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
    return saveLocal.get('token').then(token => {
      if (!token) {
        return shoutError(
          `You don't have an access token. Please, create at https://github.com/settings/tokens/new and run ${chalk.bold(
            '$ git-labels --auth'
          )}.`
        )
      }

      return gitLabels(cli.input[0], labels, token)
        .then(() => shoutSuccess('Labels created!'))
        .catch(err => shoutError(err))
    })
  }

  cli.showHelp()
}

run()
