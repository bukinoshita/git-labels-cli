#!/usr/bin/env node

// Packages
const SaveLocal = require('save-local')
const gitLabels = require('git-labels')
const meow = require('meow')
const shoutSuccess = require('shout-success')
const shoutError = require('shout-error')
const chalk = require('chalk')
const inquirer = require('inquirer')
const updateNotifier = require('update-notifier')
const loadJsonFile = require('load-json-file')

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

async function run() {
  const { flags, input } = cli

  if (flags.auth) {
    const { token } = await inquirer.prompt([
      {
        message: 'Your access token',
        name: 'token'
      }
    ])

    return saveLocal.set({ name: 'token', value: token })
  }

  const project = input[0]

  if (project) {
    const token = await saveLocal.get('token')

    if (!token) {
      return shoutError(
        `You don't have an access token. Please, create at https://github.com/settings/tokens/new and run ${chalk.bold(
          '$ git-labels --auth'
        )}.`
      )
    }

    const labels = flags.file ? loadJsonFile.sync(flags.file) : undefined

    try {
      await gitLabels({ project, labels, token })

      return shoutSuccess(
        `Labels created. Check on https://github.com/${project}/labels`
      )
    } catch (error) {
      return shoutError(error)
    }
  }

  cli.showHelp()
}

run()
