interface DockerInfo {
    dockerImageName: string;
    dockerFileName: string;
    dockerContainerName: string;
}
declare type CICD_TYPE = 'jenkins' | 'gitlab-ci';
declare type EnvName = 'dev' | 'test' | 'prod';
interface PkgType {
    name: string;
    version: string;
}
interface DockerAccountType {
    username: string;
    password: string;
}
interface QiniuAccountInfo {
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
interface BuildConfig {
    env: string | EnvName;
    appName: string;
    version: string;
    buildCommand: string;
    dockerfile: string;
    dockerAccountInfo: DockerAccountType;
    deployedPort: number;
    qiniuAccountInfo: QiniuAccountInfo;
    dockerHubPrefix: string;
    cicdType?: CICD_TYPE;
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
interface RunLocallyConfig {
    env: string | EnvName;
    appName: string;
    version: string;
    buildCommand: string;
    dockerfile: string;
    deployedPort: number;
    dockerHubPrefix: string;
    containerName: string;
}

/**
 * 生成 docker tag
 * @param pkg 当前项目的 package.json 文件
 * @returns
 */
declare const generateDockerTag: (pkg: PkgType, cicdType?: CICD_TYPE) => string;
/**
 * 本地运行
 * @param port 本地运行 的端口号
 * @returns
 */
declare const runLocally$1: (port: number, dockerImageName: string, dockerContainerName: string) => Promise<void>;
/**
 * 打包 前端资源 ，并且打包 docker镜像
 * @param dockerImageName 当前环境 的 docker 镜像名称
 * @param dockerFileName 当前环境 的 dockerfile 文件名称
 * @param packCommand 当前环境 的 打包命令
 * @returns
 */
declare const packAndBuildDockerImage: (dockerImageName: string, dockerFileName: string, packCommand?: string) => Promise<void>;
/**
 * 登录、推送镜像,设置当前 tag 环境变量 DOCKER_TAG_LABEL=’tag-xxxx‘ > env-file
 * @param account docker 账号信息
 * @returns
 */
declare const loginAndPushDockerImage: (account: DockerAccountType, dockerImageName: string) => Promise<void>;
declare const log: (...args: any[]) => void;

declare const ENV_LABEL = "MY_WEB_BUILD_ENV";
declare const ENV_FILE_NAME = "env-file";
declare const DOCKER_IMAGE_NAME_LABEL = "DOCKER_IMAGE_NAME_LABEL";
declare const DOCKER_IMAGE_PREFIX = "registry.cn-shanghai.aliyuncs.com/nexhome/";

/**
 * 生成 '------' 的字符串
 *
 * eg: repeatDash(2) => '--'
 *
 * @param count 数量
 * @returns 返回的 '------'
 */
declare const repeatDash: (count?: number) => string;
/**
 * 设置 打包环境变量
 * @param envName 环境名称 ，dev test prod
 */
declare const setEnv: (envName: EnvName) => void;
/**
 * 清除 打包环境变量
 * @param envName 环境名称 ，dev test prod
 */
declare const unSetEnv: () => void;
/**
 * 获取 打包环境变量
 * @returns 环境名称 ，dev test prod
 */
declare const getEnvName: () => EnvName;
/**
 * exec shell scripts
 * @param {string} command process to run
 * @param {string[]} args commandline arguments
 * @returns {Promise<void>} promise
 */
declare const runShell: (command: string) => Promise<void>;
declare const getTimeStamp: () => string;
/**
 * 生成 docker-compose.yml
 * @param dockerImageName docker 镜像名称
 * @param deployPort 部署的端口号
 * @param containerName 部署的容器名称，可使用 appName 作为容器名称
 * @returns {Promise<string>} docker-compose.yml文件内容字符串
 */
declare const generateDockerComposeStr: (dockerImageName: string, deployPort: number, containerName: string) => string;
/**
 * 上传到七牛上
 * @param dockerComposeStr docker-compose文件内容
 * @param qiniuAccountInfo 七牛的账号信息
 * @returns
 */
declare const uploadToQiniu: (dockerComposeStr: string, qiniuAccountInfo: QiniuAccountInfo, remoteFileName: string) => Promise<any>;

/**
 * 1. 生成 docker image tag
 * 2. 生成 docker 镜像名称
 * 3. 打包前端资源、build docker 镜像
 * 4. 登录 docker hub 、推送 docker 镜像
 * 5. 生成 docker-compose.yml
 * 6. 上传 docker-compose.yml
 *
 * @param config 打包的配置信息
 * @return docker-compose.yml 链接（用于部署）
 */
declare const bootstrap: (config: BuildConfig) => Promise<string>;

/**
 *  @param config 本地运行的配置信息
 */
declare const runLocally: (config: RunLocallyConfig) => Promise<void>;

export { BuildConfig, CICD_TYPE, DOCKER_IMAGE_NAME_LABEL, DOCKER_IMAGE_PREFIX, DockerAccountType, DockerInfo, ENV_FILE_NAME, ENV_LABEL, EnvName, PkgType, QiniuAccountInfo, RunLocallyConfig, bootstrap, generateDockerComposeStr, generateDockerTag, getEnvName, getTimeStamp, log, loginAndPushDockerImage, packAndBuildDockerImage, repeatDash, runLocally as runAppLocally, runLocally$1 as runLocally, runShell, setEnv, unSetEnv, uploadToQiniu };
