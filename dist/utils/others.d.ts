import { EnvName, QiniuAccountInfo } from './types';
/**
 * 生成 '------' 的字符串
 *
 * eg: repeatDash(2) => '--'
 *
 * @param count 数量
 * @returns 返回的 '------'
 */
export declare const repeatDash: (count?: number) => string;
/**
 * 设置 打包环境变量
 * @param envName 环境名称 ，dev test prod
 */
export declare const setEnv: (envName: EnvName) => void;
/**
 * 清除 打包环境变量
 * @param envName 环境名称 ，dev test prod
 */
export declare const unSetEnv: () => void;
/**
 * 获取 打包环境变量
 * @returns 环境名称 ，dev test prod
 */
export declare const getEnvName: () => EnvName;
/**
 * exec shell scripts
 * @param {string} command process to run
 * @param {string[]} args commandline arguments
 * @returns {Promise<void>} promise
 */
export declare const runShell: (command: string) => Promise<void>;
export declare const getTimeStamp: () => string;
/**
 * 生成 docker-compose.yml
 * @param dockerImageName docker 镜像名称
 * @param deployPort 部署的端口号
 * @returns {Promise<string>} docker-compose.yml文件内容字符串
 */
export declare const generateDockerComposeStr: (dockerImageName: string, deployPort: number) => string;
/**
 * 上传到七牛上
 * @param dockerComposeStr docker-compose文件内容
 * @param qiniuAccountInfo 七牛的账号信息
 * @returns
 */
export declare const uploadToQiniu: (dockerComposeStr: string, qiniuAccountInfo: QiniuAccountInfo, remoteFileName: string) => Promise<any>;
