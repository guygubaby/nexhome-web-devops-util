import { PkgType, DockerAccountType } from './types';
/**
 * 生成 docker tag
 * @param pkg 当前项目的 package.json 文件
 * @returns
 */
export declare const generateDockerTag: (pkg: PkgType) => string;
/**
 * 本地运行
 * @param port 本地运行 的端口号
 * @returns
 */
export declare const runLocally: (port: number, dockerImageName: string, dockerContainerName: string) => Promise<void>;
/**
 * 打包 前端资源 ，并且打包 docker镜像
 * @param dockerImageName 当前环境 的 docker 镜像名称
 * @param dockerFileName 当前环境 的 dockerfile 文件名称
 * @param packCommand 当前环境 的 打包命令
 * @returns
 */
export declare const packAndBuildDockerImage: (dockerImageName: string, dockerFileName: string, packCommand?: string) => Promise<void>;
/**
 * 登录、推送镜像,设置当前 tag 环境变量 DOCKER_TAG_LABEL=’tag-xxxx‘ > env-file
 * @param account docker 账号信息
 * @returns
 */
export declare const loginAndPushDockerImage: (account: DockerAccountType, dockerImageName: string) => Promise<void>;
