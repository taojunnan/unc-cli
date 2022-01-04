# unc-cli

Command line tools that create project from gitlab group template.

![npm](https://img.shields.io/npm/v/unc-cli?style=flat-square)  ![NPM](https://img.shields.io/npm/l/unc-cli?style=flat-square)

## Installation

```sh
npm i unc-cli -g
```

## Usage

### Before using, you must complete the following steps

+ set your gitlab host

  ```sh
  unc config --set gitlab.url <gitlab host>
  # example
  unc config --set gitlab.url https://gitlab.xxxx.com
  ```
  
+ set gitlab groupId (select and download template from this [gitlab group](https://docs.gitlab.com/ee/user/group/))
  
  ```sh
  unc config --set gitlab.groupId <groupId>
  ```
  
+ set gitlab access token ([how to create gitlab access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#create-a-personal-access-token))

  ```
  unc config --set gitlab.token <your token>
  ```

### Now you can run this command to create project👇
```sh
unc create <project-name>
```

## Development

- step1, clone code

```sh
git clone git@github.com:taojunnan/unc-cli.git
```

- step2, install dependencies

```sh
cd unc-cli
npm install
```

- step3, [option]change command name  

	open `package.json`, replace `commandName` and `bin.unc`to your command name  

- step4, [link package](https://docs.npmjs.com/cli/v6/commands/npm-link)

```sh
npm link
```

- step5, run

```sh
unc -V
# or
<your command name> -V
```

## License

[MIT](./LICENSE)
