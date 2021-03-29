"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeStamp = exports.runShell = exports.getEnvName = exports.unSetEnv = exports.setEnv = exports.repeatDash = void 0;
const constants_1 = require("./constants");
const child_process_1 = __importDefault(require("child_process"));
const dayjs_1 = __importDefault(require("dayjs"));
/**
 * 生成 '------' 的字符串
 *
 * eg: repeatDash(2) => '--'
 *
 * @param count 数量
 * @returns 返回的 '------'
 */
const repeatDash = (count = 10) => {
    return '-'.repeat(count) + '>' || '->';
};
exports.repeatDash = repeatDash;
/**
 * 设置 打包环境变量
 * @param envName 环境名称 ，dev test prod
 */
const setEnv = (envName) => {
    process.env[constants_1.ENV_LABEL] = envName;
};
exports.setEnv = setEnv;
/**
 * 清除 打包环境变量
 * @param envName 环境名称 ，dev test prod
 */
const unSetEnv = () => {
    delete process.env[constants_1.ENV_LABEL];
};
exports.unSetEnv = unSetEnv;
/**
 * 获取 打包环境变量
 * @returns 环境名称 ，dev test prod
 */
const getEnvName = () => {
    const envName = process.env[constants_1.ENV_LABEL];
    if (!envName)
        throw new Error(`${constants_1.ENV_LABEL} is null ,请设置 ${constants_1.ENV_LABEL}`);
    return envName;
};
exports.getEnvName = getEnvName;
/**
 * exec shell scripts
 * @param {string} command process to run
 * @param {string[]} args commandline arguments
 * @returns {Promise<void>} promise
 */
const runShell = (command) => {
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
exports.runShell = runShell;
const getTimeStamp = () => {
    return dayjs_1.default(new Date()).format('YYYYMMDD');
};
exports.getTimeStamp = getTimeStamp;
