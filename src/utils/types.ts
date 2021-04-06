export interface DockerInfo {
  dockerImageName: string;
  dockerFileName: string;
  dockerContainerName: string;
}

export type EnvName = 'dev' | 'test' | 'prod';

export interface PkgType {
  name: string;
  version: string;
}

export interface DockerAccountType {
  username: string;
  password: string;
}

export interface QiniuAccountInfo {
  accessKey: string;
  secretKey: string;
}

/**
 * 打包所有需要的配置信息
 * @param env (必须) 环境变量 eg: 'test'
 * @param appName (必须) 应用名称 eg: 'xxx-web-management'
 * @param version (必须) 应用版本 eg: '1.0.1'
 * @param buildCommand (必须) 打包命令 eg: 'yarn build'
 * @param dockerfile (必须) dockerfile 所在的路径 eg: 根目录 'Dockerfile', 子路径 'xxx/Dockerfile.dev'
 * @param dockerAccountInfo (必须) 用于上传 docker image eg: {username:'xxx',password:'xxx'}
 * @param deployedPort (必须) 服务端部署的端口号，用于 docker-compose 启动服务 eg: 8080
 * @param qiniuAccountInfo (必须) 用于上传 docker-compose.yml eg: {accessKey: 'xxx', secretKey: 'xxx'}
 * @param dockerHubPrefix (必须) docker image name 的前缀，默认值 'registry.cn-shanghai.aliyuncs.com/nexhome/'
 */
export interface BuildConfig {
  env: string | EnvName;
  appName: string;
  version: string;
  buildCommand: string;
  dockerfile: string;
  dockerAccountInfo: DockerAccountType;
  deployedPort: number;
  qiniuAccountInfo: QiniuAccountInfo;
  dockerHubPrefix: string;
}

/**
 * 本地运行所有需要的配置信息
 * @param env (必须) 环境变量 eg: 'test'
 * @param appName (必须) 应用名称 eg: 'xxx-web-management'
 * @param version (必须) 应用版本 eg: '1.0.1'
 * @param buildCommand (必须) 打包命令 eg: 'yarn build'
 * @param dockerfile (必须) dockerfile 所在的路径 eg: 根目录 'Dockerfile', 子路径 'xxx/Dockerfile.dev'
 * @param deployedPort (必须) 服务端部署的端口号，用于 docker-compose 启动服务 eg: 8080
 * @param dockerHubPrefix (必须) docker image name 的前缀，默认值 'registry.cn-shanghai.aliyuncs.com/nexhome/'
 * @param containerName (必须) 本地运行的容器名称
 */
export interface RunLocallyConfig {
  env: string | EnvName;
  appName: string;
  version: string;
  buildCommand: string;
  dockerfile: string;
  deployedPort: number;
  dockerHubPrefix: string;
  containerName: string;
}
