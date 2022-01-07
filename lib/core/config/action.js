import fs from 'fs-extra'
import { get, set, unset } from '../../utils/object.js'
import launch from '../../utils/launch.js'
import { getConfig, getRcPath } from '../../utils/store.js'

async function actionFun (value, options) {
  // 获取配置文件路径
  const rcPath = getRcPath()

  // 得到配置文件信息对象
  const config = await getConfig()

  if (!options.delete && !options.get && !options.edit && !options.set) {
    if (options.json) {
      console.log(JSON.stringify({
        resolvedPath: rcPath,
        content: config
      }))
    } else {
      console.log('Resolved path: ' + rcPath + '\n', JSON.stringify(config, null, 2))
    }
  }

  if (options.get) {
    const value = get(config, options.get)

    if (options.json) {
      console.log(JSON.stringify({
        value
      }))
    } else {
      console.log(value)
    }
  }

  if (options.delete) {
    unset(config, options.delete)
    await fs.writeFile(rcPath, JSON.stringify(config, null, 2), 'utf-8')
    if (options.json) {
      console.log(JSON.stringify({
        deleted: options.delete
      }))
    } else {
      console.log(`You have removed the option: ${options.delete}`)
    }
  }

  if (options.edit) {
    launch(rcPath)
  }

  if (options.set && !value) {
    throw new Error(`Make sure you define a value for the option ${options.set}`)
  }

  if (options.set && value) {
    set(config, options.set, value)

    if (/^\d+$/.test(value)) {
      set(config, options.set, parseInt(value))
    }

    if (value === 'true') {
      set(config, options.set, true)
    }

    if (value === 'false') {
      set(config, options.set, false)
    }

    await fs.writeFile(rcPath, JSON.stringify(config, null, 2), 'utf-8')
    if (options.json) {
      console.log(JSON.stringify({
        updated: options.set
      }))
    } else {
      console.log(`You have updated the option: ${options.set} to ${value}`)
    }
  }
}

export default actionFun
