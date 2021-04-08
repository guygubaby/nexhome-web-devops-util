"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
/**
 *  @param config 本地运行的配置信息
 */
exports.runLocally = async (config) => {
    const { env, appName, version, buildCommand, dockerfile, deployedPort, dockerHubPrefix, containerName, } = config;
    const tag = utils_1.generateDockerTag({ name: appName, version });
    const dockerImageName = `${dockerHubPrefix}${appName}-${env}:${tag}`;
    utils_1.log(dockerImageName);
    await utils_1.packAndBuildDockerImage(dockerImageName, dockerfile, buildCommand);
    await utils_1.runLocally(deployedPort, dockerImageName, containerName);
};
