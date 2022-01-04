import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import leven from 'leven'

// 获取packageJson对象
export async function getPackageJson() {
  // package.json绝对路径地址
  const packageJsonDir = fileURLToPath(new URL('../../package.json', import.meta.url))
  // 在ES module中读取json文件的一种方式
  // const packageJson = JSON.parse(await fs.readFile(packageJsonDir))
  const packageJson = await fs.readJson(packageJsonDir)

  return packageJson
}

// 命令建议
export function suggestCommands (unknownCommand) {
  const availableCommands = program.commands.map(cmd => cmd._name)

  let suggestion

  availableCommands.forEach(cmd => {
    const isBestMatch = leven(cmd, unknownCommand) < leven(suggestion || '', unknownCommand)
    if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
      suggestion = cmd
    }
  })

  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`))
  }
}