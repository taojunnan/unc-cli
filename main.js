#! /usr/bin/env node 

import { program } from 'commander'
import chalk from 'chalk'
import enhanceErrorMessages from './lib/utils/enhanceErrorMessages.js'
import { getPackageJson, suggestCommands } from './lib/utils/index.js'
// 引入所有命令
import allCommand from './lib/core/index.js'

// package.json对象
const packageJson = await getPackageJson()

const name = packageJson.commandName

// 定义名称，只是用于commander在控制台展示的name
program.name(name)

// 支持的所有命令
allCommand()

// 版本信息
program.version(`${name}-cli ${packageJson.version}`)

// 对于一些未知命令，输出帮助提示
program.on('command:*', ([cmd]) => {
  program.outputHelp()
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
  console.log()
  suggestCommands(cmd)
  process.exitCode = 1
})

program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`${name} <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program.commands.forEach(c => c.on('--help', () => console.log()))

enhanceErrorMessages('missingArgument', argName => {
  return `Missing required argument ${chalk.yellow(`<${argName}>`)}.`
})

enhanceErrorMessages('unknownOption', optionName => {
  return `Unknown option ${chalk.yellow(optionName)}.`
})

enhanceErrorMessages('optionMissingArgument', (option, flag) => {
  return `Missing required argument for option ${chalk.yellow(option.flags)}` + (flag ? `, got ${chalk.yellow(flag)}` : ``)
})

// 写在最后，固定写法，必须
program.parse()