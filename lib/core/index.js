import createCommand from "./create/index.js"
import configCommand from "./config/index.js"

// 所有命令在这注册
export default () => {
  createCommand()
  configCommand()
}
