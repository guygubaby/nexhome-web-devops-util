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

### tsconfig.json

```json
{
  "include": ["./**/*.ts"],
  "compilerOptions": {
    "resolveJsonModule": true,
    "target": "es5",
    "module": "commonjs",
    "lib": [
      "DOM"
    ],
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true ,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 1. dev env

①. `devops-dev.ts`

```typescript
  const config = {}
  runLocally(config)
  ```

②. `package.json`

```json
{
  "scripts":{
    "build-for-dev": "yarn && npx ts-node  --dir ${scripts-path} devops-dev.ts || exit -1",
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
import { bootstrap, BuildConfig } from 'nexhome-web-devops-util'
import {
  dockerAccountInfo,
  qiniuAccountInfo,
  dockerHubPrefix
} from './constants'
import pkg from '../package.json'

const run = async () => {
  const { name, version } = pkg
  const config: BuildConfig = {
    env: 'test',
    appName: name,
    version,
    buildCommand: 'yarn build',
    dockerfile: 'Dockerfile.test',
    dockerAccountInfo,
    qiniuAccountInfo,
    deployedPort: 8080,
    dockerHubPrefix
  }

  bootstrap(config)
}

run()
```

②. `package.json`

```json
{
  "scripts":{
    "build-for-test": "yarn && npx ts-node --dir ${scripts-path} devops-test.ts || exit -1",
  }
}
```

③. set jenkins `config`

```bash
yarn build-for-test
```

④. server shell script

```bash
# 1. login to docker service
docker login -u ${u} -p ${p} registry.cn-shanghai.aliyuncs.com || exit -1

# 2. stop previous service
docker-compose stop

# 3. set some vars to download latest docker-compose.yml
dockerComposeUrl='https://some-where.com/docker-compose.yml'

_hash=`date "+%s"`

curl $dockerComposeUrl?_hash=$_hash -o docker-compose.yml || exit -1

# 4. start service
docker-compose up -d --remove-orphans

# All done :)
```

## All done 🙈
