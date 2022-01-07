import path from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import minimist from 'minimist'
import chalk from 'chalk'
import validateProjectName from 'validate-npm-package-name'
import Generator from '../../utils/generator.js'

// create命令的执行方法
async function actionFunc (projectName, options) {
  if (minimist(process.argv.slice(3))._.length > 1) {
    console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the project name, the rest are ignored.'))
  }

  const cwd = process.cwd()
  // 需要创建的目录地址
  const targetDir = path.resolve(cwd, projectName || '.')

  // 判断输入的项目名是否合法
  const result = validateProjectName(projectName)
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${projectName}"`))
    result.errors && result.errors.forEach(err => {
      console.error(chalk.red.dim('Error: ' + err))
    })
    result.warnings && result.warnings.forEach(warn => {
      console.error(chalk.red.dim('Warning: ' + warn))
    })

    process.exit(1)
  }

  // 如果有同名项目（目录），那么根据用户配置/选择 移除它
  const isContinue = await removeExistsDir(targetDir, options)

  // 如果上一步继续了才往下执行
  if (isContinue) {
    const generator = new Generator(projectName, targetDir)
    // 开始创建
    generator.create()
  }
}

/**
 * 移除已存在的文件夹
 * @param {String} targetDir 创建项目所在的目录
 * @param {Object} options 用户配置
 * @returns {Boolean} 是否继续往下操作
 */
async function removeExistsDir (targetDir, options) {
  // 目录是否已经存在？
  if (fs.existsSync(targetDir)) {
    // 是否为强制创建？
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      // 询问用户是否确定要覆盖
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: 'Target directory already exists Pick an action:',
          choices: [
            {
              name: 'Overwrite',
              value: 'overwrite'
            },
            {
              name: 'Cancel',
              value: false
            }
          ]
        }
      ])

      if (action === 'overwrite') {
        // 移除已存在的目录
        console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
        await fs.remove(targetDir)
      } else {
        // 选了cancel就返回不继续往下了
        return false
      }
    }
  }

  return true
}

export default actionFunc
