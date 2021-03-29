# nexhome devops util

## brife intro

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
    await packAndBuildDockerImage(dockerImageName, 'Dockerfile.dev') // 此处应是 dockerfile 的位置
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

![Screen Shot 2021-03-29 at 15.42.16.png](https://i.loli.net/2021/03/29/iZsjUExePGp2QoS.png)

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
 * 4. remove env
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

![Screen Shot 2021-03-29 at 15.44.00.png](https://i.loli.net/2021/03/29/Wt9eVQwunyDPUjd.png)

![Screen Shot 2021-03-29 at 15.45.22.png](https://i.loli.net/2021/03/29/AuYbi2QZStkwW6v.png)

④. server shell script

```bash
imageName=$DOCKER_IMAGE_NAME_LABEL
containerName='xxx-web-test'

# login to docker service
docker login -u username -p password https://fake.rgister.com || exit -1

# pull image and run
docker pull $imageName
docker stop $containerName
sleep 2
docker rm $containerName
docker run -d --restart unless-stopped --name $containerName -p port:80 $imageName
```

## enjoy it 🙈
