"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
const utils_1 = require("./utils");
const others_1 = require("./utils/others");
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
const bootstrap = async (config) => {
    const { env, appName, version, buildCommand, dockerfile, dockerAccountInfo, deployedPort, qiniuAccountInfo, dockerHubPrefix, } = config;
    const tag = utils_1.generateDockerTag({ name: appName, version });
    const dockerImageName = `${dockerHubPrefix}${appName}-${env}:${tag}`;
    utils_1.log(dockerImageName);
    await utils_1.packAndBuildDockerImage(dockerImageName, dockerfile, buildCommand);
    await utils_1.loginAndPushDockerImage(dockerAccountInfo, dockerImageName);
    const dcStr = others_1.generateDockerComposeStr(dockerImageName, deployedPort, appName);
    const dockerComposeFileName = `${appName}/${env}/docker-compose.yml`;
    await others_1.uploadToQiniu(dcStr, qiniuAccountInfo, dockerComposeFileName);
    const url = `https://data.silkprint.v-ju.com.cn/${dockerComposeFileName}?hash=${Date.now()}`;
    utils_1.log(url);
    return url;
};
exports.bootstrap = bootstrap;
