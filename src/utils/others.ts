import { ENV_LABEL } from './constants';
import { EnvName } from './types';
import cp from 'child_process';
import dayjs from 'dayjs';

/**
 * 生成 '------' 的字符串
 *
 * eg: repeatDash(2) => '--'
 *
 * @param count 数量
 * @returns 返回的 '------'
 */
export const repeatDash = (count: number = 10): string => {
  return '-'.repeat(count) + '>' || '->';
};

/**
 * 设置 打包环境变量
 * @param envName 环境名称 ，dev test prod
 */
export const setEnv = (envName: EnvName) => {
  process.env[ENV_LABEL] = envName;
};

/**
 * 清除 打包环境变量
 * @param envName 环境名称 ，dev test prod
 */
export const unSetEnv = () => {
  delete process.env[ENV_LABEL];
};

/**
 * 获取 打包环境变量
 * @returns 环境名称 ，dev test prod
 */
export const getEnvName = (): EnvName => {
  const envName = process.env[ENV_LABEL] as EnvName;
  if (!envName) throw new Error(`${ENV_LABEL} is null ,请设置 ${ENV_LABEL}`);
  return envName;
};

/**
 * exec shell scripts
 * @param {string} command process to run
 * @param {string[]} args commandline arguments
 * @returns {Promise<void>} promise
 */
export const runShell = (command: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const executedCommand = cp.spawn(command, {
      stdio: 'inherit',
      shell: true,
    });

    executedCommand.on('error', (error) => {
      reject(error);
    });

    executedCommand.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

export const getTimeStamp = (): string => {
  return dayjs(new Date()).format('YYYYMMDD');
};
