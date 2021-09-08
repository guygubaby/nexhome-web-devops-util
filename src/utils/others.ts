import { ENV_LABEL } from './constants';
import { EnvName, QiniuAccountInfo } from './types';
import cp from 'child_process';
import dayjs from 'dayjs';
import process from 'process';
import qiniu from 'qiniu';

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
  return dayjs(new Date()).add(8,'hour').format('YYYYMMDD');
};

/**
 * 生成 docker-compose.yml
 * @param dockerImageName docker 镜像名称
 * @param deployPort 部署的端口号
 * @param containerName 部署的容器名称，可使用 appName 作为容器名称
 * @returns {Promise<string>} docker-compose.yml文件内容字符串
 */
export const generateDockerComposeStr = (
  dockerImageName: string,
  deployPort: number,
  containerName: string
): string => {
  return `
  version: '3'
  services:
    web-service:
      image: '${dockerImageName}'
      restart: unless-stopped
      container_name: '${containerName}'
      network_mode: 'bridge'
      ports: 
        - ${deployPort}:80`;
};

const deleteFile = async (
  bucket: string,
  remoteFileName: string,
  config: qiniu.conf.ConfigOptions,
  mac: qiniu.auth.digest.Mac
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const bucketManager = new qiniu.rs.BucketManager(mac, config);
    bucketManager.delete(bucket, remoteFileName, (e, res, info) => {
      if (info.statusCode === 200) {
        console.log('delete exists file', remoteFileName);
      }
      resolve();
    });
  });
};

/**
 * 上传到七牛上
 * @param dockerComposeStr docker-compose文件内容
 * @param qiniuAccountInfo 七牛的账号信息
 * @returns
 */
export const uploadToQiniu = async (
  dockerComposeStr: string,
  qiniuAccountInfo: QiniuAccountInfo,
  remoteFileName: string
): Promise<any> => {
  return new Promise<Error | undefined | any>(async (resolve, reject) => {
    const { accessKey, secretKey } = qiniuAccountInfo;
    const bucket = 'silkprint';

    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options: qiniu.rs.PutPolicyOptions = {
      scope: bucket,
    };

    const putPolicy = new qiniu.rs.PutPolicy(options);

    const config: qiniu.conf.ConfigOptions = new qiniu.conf.Config();
    config.zone = qiniu.zone.Zone_z2; // 华南

    const formUploader = new qiniu.form_up.FormUploader(config);
    const uploadToken = putPolicy.uploadToken(mac);

    const putExtra = new qiniu.form_up.PutExtra();
    putExtra.mimeType = 'text/yaml';

    deleteFile(bucket, remoteFileName, config, mac).then(() => {
      formUploader.put(
        uploadToken,
        remoteFileName,
        dockerComposeStr,
        putExtra,
        (err, res, resInfo) => {
          if (err) return reject(err);
          if (resInfo.statusCode === 200) {
            resolve(res);
          } else {
            reject(res);
          }
        }
      );
    });
  });
};
