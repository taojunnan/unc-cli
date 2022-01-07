import { program } from 'commander'
import actionFunc from './action.js'

// 这里是创建（create）命令
const createCommand = () => {
  program
    .command('create <projectName>')
    .alias('c')
    .description('create a project')
    .usage('[options] <projectName>')
    .option('-f, --force', 'overwrite target directory if it exist')
    .action(actionFunc)
}

export default createCommand
