import { program } from 'commander'
import actionFunc from './action.js'

// 这里是配置（config）命令
const configCommand = () => {
  program
    .command('config [value]')
    .description('inspect and modify the config')
    .usage('[option] [value]')
    .option('-g, --get <path>', 'get value from option')
    .option('-s, --set <path> <value>', 'set option value')
    .option('-d, --delete <path>', 'delete option from config')
    .option('-e, --edit', 'open config with default editor')
    .option('--json', 'outputs JSON result only')
    .action(actionFunc)
}

export default configCommand
