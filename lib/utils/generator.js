import ora from 'ora'
import inquirer from 'inquirer'
import chalk from 'chalk'
import downloadUrl from 'download'
import { getRepoList, getRepoBranches } from './http.js'
import { getGitlabGroupId, getToken, getGitlabBaseUrl } from './store.js'

/**
 * 处理项目创建逻辑
 */
class Generator {
  constructor (projectName, targetDir) {
    // 项目名称
    this.projectName = projectName
    // 创建位置 （绝对路径）
    this.targetDir = targetDir
  }

  // 从gitlab 某个group下获取项目模板
  async getRepo () {
    // 获取配置的gitlab groupId
    const groupId = getGitlabGroupId()

    // 调用loading 请求模板数据
    const repoList = await wrapLoading(getRepoList, 'waiting fetch template', groupId)
    if (!repoList) return

    // 修改成需要的字段
    const repoItems = repoList.map(item => {
      return {
        name: item.name,
        value: item.id
      }
    })

    // 用户选择自己需要下载的模板/项目
    const { repoId } = await inquirer.prompt({
      name: 'repoId',
      type: 'list',
      choices: repoItems,
      message: 'Please choose a template to create project'
    })

    // 返回用户选择的项目id
    return repoId
  }

  // 获取项目所有分支
  async getBranch (repoId) {
    // 调用loading 请求分支数据
    const branches = await wrapLoading(getRepoBranches, 'waiting fetch branches', repoId)
    if (!branches) return

    // 修改成需要的字段
    const branchItems = branches.map(item => {
      return {
        name: item.name,
        value: item.commit.id
      }
    })

    // 用户选择自己分支
    const { branchId } = await inquirer.prompt({
      name: 'branchId',
      type: 'list',
      choices: branchItems,
      message: 'Please choose a branch'
    })

    // 返回用户选择的分支的最后一次提交的commit id
    return branchId
  }

  /**
   * 下载远程模板到本地
   * @param {Number} repoId 项目/仓库id
   * @param {String} sha SHA值，具体见👇，概括的来说它可以用来下载某次提交，某个tag，某个分支，这里我们作下载分支用
   * @see https://docs.gitlab.com/ee/api/repositories.html#get-file-archive
   */
  async download (repoId, sha) {
    const token = getToken()
    const baseUrl = getGitlabBaseUrl()

    // 下载的一些配置，具体可以看 https://github.com/kevva/download#readme
    const downloadOptions = {
      extract: true,
      strip: 1,
      mode: '666',
      headers: {
        accept: 'application/zip',
        'PRIVATE-TOKEN': token
      }
    }

    // 拼接下载地址
    let requestUrl = `${baseUrl}/api/v4/projects/${repoId}/repository/archive.zip`
    // 如果没传sha那么就是下载的默认分支
    if (sha) {
      requestUrl += `?sha=${sha}`
    }

    // 调用下载方法
    await wrapLoading(
      downloadUrl,
      'waiting download template',
      requestUrl, // 参数1: 下载地址
      this.targetDir, // 参数2: 创建位置
      downloadOptions // 参数3：配置项
    )
  }

  // 核心创建逻辑
  async create () {
    // 1，获取项目模板
    const repoId = await this.getRepo()

    // 正确返回才继续
    if (repoId) {
      // console.log('选择的 repoId = ' + repoId)

      // 2，获取选中项目的所有分支
      const branchCommitId = await this.getBranch(repoId)
      // console.log('branchCommitId = ', branchCommitId)

      // 选好了才继续
      if (branchCommitId) {
        // 3，拿到项目id和分支commitid，开始下载
        await this.download(repoId, branchCommitId)

        // 成功后的一些提示
        console.log(`\r\nSuccessfully created project ${chalk.yellow(this.projectName)}`)
      }
    }
  }
}

/**
 * 加载动画
 * @param {Function} fn 执行的方法
 * @param {String} message loading时提示的文本信息
 * @param  {...any} args 执行方法的传参
 * @returns 如果执行成功，返回执行的方法结果，否则返回undefined
 */
async function wrapLoading (fn, message, ...args) {
  // 使用 ora 初始化，传入提示信息 message
  const spinner = ora(message)
  // 开始加载动画
  spinner.start()

  try {
    // 执行传入方法 fn
    const result = await fn(...args)

    // 状态为修改为成功
    spinner.succeed(`${message} succeed`)

    return result
  } catch (error) {
    console.error(error)

    // 状态为修改为失败
    spinner.fail(`${message} failed`)
  }
}

export default Generator
