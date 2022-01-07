import { get } from './object.js'
import path from 'path'
import os from 'os'
import fs from 'fs-extra'
import chalk from 'chalk'
import { getPackageJson } from './index.js'

// package.json对象
const packageJson = await getPackageJson()
// 命令名称
const commandName = packageJson.commandName
// 读取配置对象
const config = await getConfig()

// 获取配置文件目录
export function getRcPath () {
  return path.resolve(os.homedir(), `.${commandName}rc`)
}

// 获取配置文件信息
export async function getConfig () {
  const rcPath = getRcPath()

  // 第一次运行的时候没有这个文件，那么创建一个空的
  if (!fs.existsSync(rcPath)) {
    const defaultConfig = {
      // gitlab: {
      //   url: 'https://gitlab.xxxxx.cn',
      //   groupId: 658
      // }
    }
    fs.writeFileSync(rcPath, JSON.stringify(defaultConfig, null, 2))
  }

  // 读取配置对象
  const config = await fs.readJson(rcPath)
  
  return config
}

// 获取gitlab的access token
export function getToken () {
  const token = get(config, 'gitlab.token')

  if (!token) {
    console.log(chalk.red('\nError: You haven\'t set gitlab access token.') + '\nPlease use: ' + chalk.cyan(`${commandName} config --set gitlab.token <your token>`))

    process.exit(1)
  }

  return token
}

// 获取gitlab base Url
export function getGitlabBaseUrl () {
  let baseUrl = get(config, 'gitlab.url')

  if (!baseUrl) {
    console.log(chalk.red('\nError: You haven\'t set gitlab baseUrl.') + '\nPlease use: ' + chalk.cyan(`${commandName} config --set gitlab.url <gitlab baseUrl>`))
    console.log('For example: ' + chalk.cyan(`${commandName} config --set gitlab.url https://gitlab.xxxx.com`))
    
    process.exit(1)
  }

  return baseUrl
}

// 获取从gitlab中哪个组下的模板
export function getGitlabGroupId () {
  let groupId = get(config, 'gitlab.groupId')

  if (!groupId) {
    console.log(chalk.red('\nError: You haven\'t set gitlab groupId.') + '\nPlease use: ' + chalk.cyan(`${commandName} config --set gitlab.groupId <default groupId>`))
    
    process.exit(1)
  }

  return groupId
}