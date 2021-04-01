# nexhome devops util

## brief intro

这是 `nexhome` 用于 `jenkins(CI/CD)` 打包的工具库

## install

```bash
yarn add nexhome-web-devops-util -D
# or 
npm i nexhome-web-devops-util -D
```

## usage

### 1. dev env

①. `devops-dev.ts`

```typescript
  import {
    EnvName,
    setEnv,
    packAndBuildDockerImage,
    generateDockerTag,
    DOCKER_IMAGE_PREFIX,
    runLocally
  } from 'nexhome-web-devops-util'
  import pkg from '../package.json'

  /**
   * 1. set env
   * 2. pack frontend and build docker image
   * 3. run locally
   * 4. remove env
   */
  const run = async () => {
    const env: EnvName = 'dev'
    const { name: appName } = pkg
    setEnv(env)
    const tag = generateDockerTag(pkg)
    // registry.cn-shanghai.aliyuncs.com/nexhome/yango-web-management-dev:1.0.1-20210326-56fe5cc0
    const dockerImageName = `${DOCKER_IMAGE_PREFIX}${appName}-${env}:${tag}`
    console.log('dockerImageName: ', dockerImageName)
    await packAndBuildDockerImage(dockerImageName, 'Dockerfile.dev', 'yarn build') // 此处应是 dockerfile 的位置
    await runLocally(28896, dockerImageName, 'yango-web-' + env)
  }

  run()

  ```

②. `package.json`

```json
{
  "scripts":{
    "build-for-dev": "yarn && npx ts-node -O '{\"module\":\"commonjs\"}' scripts/devops-dev.ts || exit -1",
  }
}
```

③. set jenkins `config`

```bash
yarn build-for-dev
```

### 2. test env

①. `devops-test.ts`

```typescript
import {
  EnvName,
  setEnv,
  unSetEnv,
  packAndBuildDockerImage,
  generateDockerTag,
  DOCKER_IMAGE_PREFIX,
  loginAndPushDockerImage
} from 'nexhome-web-devops-util'
import pkg from '../package.json'
import { dockerAccountInfo } from './constants'

/**
 * 1. set env
 * 2. pack frontend and build docker image
 * 3. push docker image
 * 4. generate docker-compose.yml and upload to qiniu
 * 5. remove env
 */
const run = async () => {
  const env: EnvName = 'test'
  const { name: appName } = pkg
  setEnv(env)
  const tag = generateDockerTag(pkg)
  // registry.cn-shanghai.aliyuncs.com/nexhome/yango-web-management-dev:1.0.1-20210326-56fe5cc0
  
  const dockerImageName = `${DOCKER_IMAGE_PREFIX}${appName}-${env}:${tag}`
  console.log('dockerImageName: ', dockerImageName)
  await packAndBuildDockerImage(dockerImageName, 'Dockerfile.' + env)
  await loginAndPushDockerImage(dockerAccountInfo, dockerImageName)


  const deployPort = 8089 // server side deploy port
  const dockerComposeStr = generateDockerComposeStr(dockerImageName, deployPort);

  const accessKey = process.env.ACCESS_KEY
  const secretKey = process.env.SECRET_KEY
  const qiniuAccount: QiniuAccountInfo = {
    accessKey,
    secretKey,
  };
  const dockerComposeFileName = `docker-compose-${appName}-${env}.yml`
  await uploadToQiniu(dockerComposeStr, qiniuAccount, dockerComposeFileName);

  console.log("dockerComposeFileName :", dockerComposeFileName)

  unSetEnv()
}

run()
```

②. `package.json`

```json
{
  "scripts":{
    "build-for-test": "yarn && npx ts-node -O '{\"module\":\"commonjs\"}' scripts/devops-test.ts || exit -1",
  }
}
```

③. set jenkins `config`

```bash
yarn build-for-test
```

④. server shell script

```bash
DATE=`date "+%s"`
dockerComposeFileName='your docker-compose name here.yml'

curl https://foo.bar.com/${dockerComposeFileName}?time=$DATE -o docker-compose.yml || exit -1

docker-compose up -d
```

## All done 🙈
