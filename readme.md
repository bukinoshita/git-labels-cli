# git-labels-cli [![Build Status](https://travis-ci.org/bukinoshita/git-labels-cli.svg?branch=master)](https://travis-ci.org/bukinoshita/git-labels-cli)

> Creating Github issue labels


## Install

```bash
$ npm install -g git-labels-cli
```


## Usage

```bash
$ git-labels --help

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
```


## Demo

<img src="demo.gif"/>


## Related

- [git-labels](https://github.com/bukinoshita/git-labels) — API for this module
- [save-local](https://github.com/bukinoshita/save-local) — Save stuff locally


## License

MIT © [Bu Kinoshita](https://bukinoshita.io)
