# snack-bar
A command line interface to give you better controls over [TestCafe](https://devexpress.github.io/testcafe/) scenarios.

# Install

```sh
$ yarn add @andoshin11/snack-bar
```

# Running Test
When you run `snack-bar` command, it automatically detects the test files and target browsers from your local `.testcaferc.json`. (or you can select them later on cli manually.)

Once it completes scanning your test files, you can chose ones you wish to run by using the displayed multi-select input.

![example](https://media.giphy.com/media/S8x1b1kNqYLeRnWOht/giphy.gif)

# CLI Options

```
Usage: snack-bar [options] [command]

Generate type definitions from swagger specs

Options:
  -V, --version              output the version number
  -h, --help                 output usage information
```

# License
MIT
