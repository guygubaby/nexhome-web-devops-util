import { EnvName } from './types';
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