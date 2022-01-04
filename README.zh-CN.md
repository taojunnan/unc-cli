# unc-cli

通过命令行从gitlab某个组下拉取模板创建项目。

[![Version][version-badge]][package]   [![MIT License][license-badge]][license]

[English](./README.md) | 简体中文

## 安装

```sh
npm i unc-cli -g
```

## 使用

### 在使用前，你必须完成以下设置

+ 配置你的gitlab地址

  ```sh
  unc config --set gitlab.url <gitlab host>
  # 例如
  unc config --set gitlab.url https://gitlab.xxxx.com
  ```
  
+ 配置[gitlab groupId](https://docs.gitlab.com/ee/user/group/) (将通过这个组选择和下载模板)
  
  ```sh
  unc config --set gitlab.groupId <groupId>
  ```
  
+ 配置gitlab access token ([如何创建gitlab access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#create-a-personal-access-token))

  ```
  unc config --set gitlab.token <your token>
  ```

### 现在你可以用下面的命令来创建项目了👇
```sh
unc create <project-name>
```

## 本地开发

- 第一步，克隆代码

```sh
git clone git@github.com:taojunnan/unc-cli.git
```

- 第二部，安装依赖

```sh
cd unc-cli
npm install
```

- 第三步，[可选]修改命令名称  

	打开 `package.json`, 替换 `commandName` 和 `bin.unc` 为你的命令名称  

- 第四步，[链接包](https://docs.npmjs.com/cli/v6/commands/npm-link)

```sh
npm link
```

- 第五步，开始运行

```sh
unc -V
# or
<your command name> -V
```

## License

[MIT](./LICENSE)


<!-- badges -->
[version-badge]: https://img.shields.io/npm/v/unc-cli?style=flat-square
[package]: https://www.npmjs.com/package/unc-cli
[license-badge]: https://img.shields.io/npm/l/unc-cli?style=flat-square
[license]: https://opensource.org/licenses/MIT