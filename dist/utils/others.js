"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const child_process_1 = __importDefault(require("child_process"));
const dayjs_1 = __importDefault(require("dayjs"));
const process_1 = __importDefault(require("process"));
const qiniu_1 = __importDefault(require("qiniu"));
/**
 * 生成 '------' 的字符串
 *
 * eg: repeatDash(2) => '--'
 *
 * @param count 数量
 * @returns 返回的 '------'
 */
exports.repeatDash = (count = 10) => {
    return '-'.repeat(count) + '>' || '->';
};
/**
 * 设置 打包环境变量
 * @param envName 环境名称 ，dev test prod
 */
exports.setEnv = (envName) => {
    process_1.default.env[constants_1.ENV_LABEL] = envName;
};
/**
 * 清除 打包环境变量
 * @param envName 环境名称 ，dev test prod
 */
exports.unSetEnv = () => {
    delete process_1.default.env[constants_1.ENV_LABEL];
};
/**
 * 获取 打包环境变量
 * @returns 环境名称 ，dev test prod
 */
exports.getEnvName = () => {
    const envName = process_1.default.env[constants_1.ENV_LABEL];
    if (!envName)
        throw new Error(`${constants_1.ENV_LABEL} is null ,请设置 ${constants_1.ENV_LABEL}`);
    return envName;
};
/**
 * exec shell scripts
 * @param {string} command process to run
 * @param {string[]} args commandline arguments
 * @returns {Promise<void>} promise
 */
exports.runShell = (command) => {
    return new Promise((resolve, reject) => {
        const executedCommand = child_process_1.default.spawn(command, {
            stdio: 'inherit',
            shell: true,
        });
        executedCommand.on('error', (error) => {
            reject(error);
        });
        executedCommand.on('exit', (code) => {
            if (code === 0) {
                resolve();
            }
            else {
                reject();
            }
        });
    });
};
exports.getTimeStamp = () => {
    return dayjs_1.default(new Date()).add(8, 'hour').format('YYYYMMDD');
};
/**
 * 生成 docker-compose.yml
 * @param dockerImageName docker 镜像名称
 * @param deployPort 部署的端口号
 * @param containerName 部署的容器名称，可使用 appName 作为容器名称
 * @returns {Promise<string>} docker-compose.yml文件内容字符串
 */
exports.generateDockerComposeStr = (dockerImageName, deployPort, containerName) => {
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
const deleteFile = async (bucket, remoteFileName, config, mac) => {
    return new Promise((resolve, reject) => {
        const bucketManager = new qiniu_1.default.rs.BucketManager(mac, config);
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
exports.uploadToQiniu = async (dockerComposeStr, qiniuAccountInfo, remoteFileName) => {
    return new Promise(async (resolve, reject) => {
        const { accessKey, secretKey } = qiniuAccountInfo;
        const bucket = 'silkprint';
        const mac = new qiniu_1.default.auth.digest.Mac(accessKey, secretKey);
        const options = {
            scope: bucket,
        };
        const putPolicy = new qiniu_1.default.rs.PutPolicy(options);
        const config = new qiniu_1.default.conf.Config();
        config.zone = qiniu_1.default.zone.Zone_z2; // 华南
        const formUploader = new qiniu_1.default.form_up.FormUploader(config);
        const uploadToken = putPolicy.uploadToken(mac);
        const putExtra = new qiniu_1.default.form_up.PutExtra();
        putExtra.mimeType = 'text/yaml';
        deleteFile(bucket, remoteFileName, config, mac).then(() => {
            formUploader.put(uploadToken, remoteFileName, dockerComposeStr, putExtra, (err, res, resInfo) => {
                if (err)
                    return reject(err);
                if (resInfo.statusCode === 200) {
                    resolve(res);
                }
                else {
                    reject(res);
                }
            });
        });
    });
};
