"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAndPushDockerImage = exports.packAndBuildDockerImage = exports.runLocally = exports.generateDockerTag = void 0;
const constants_1 = require("./constants");
const others_1 = require("./others");
/**
 * 生成 docker tag
 * @param pkg 当前项目的 package.json 文件
 * @returns
 */
const generateDockerTag = (pkg) => {
    const { version } = pkg;
    let { GIT_COMMIT } = process.env;
    GIT_COMMIT = GIT_COMMIT || 'GIT_COMMIT';
    // 版本 - 日期 - 环境名称 - git commit hash
    const tags = [version, others_1.getTimeStamp(), GIT_COMMIT.substr(0, 8)];
    const tag = tags.join('-');
    return tag;
};
exports.generateDockerTag = generateDockerTag;
/**
 * 本地运行
 * @param port 本地运行 的端口号
 * @returns
 */
const runLocally = (port, dockerImageName, dockerContainerName) => {
    const scripts = `
    docker stop ${dockerContainerName}
    sleep 3
    docker rm ${dockerContainerName}
    docker run -d --restart unless-stopped --name ${dockerContainerName} -p ${port}:80 ${dockerImageName} || exit -1
  `;
    return others_1.runShell(scripts);
};
exports.runLocally = runLocally;
/**
 * 打包 前端资源 ，并且打包 docker镜像
 * @param dockerImageName 当前环境 的 docker 镜像名称
 * @param dockerFileName 当前环境 的 dockerfile 文件名称
 * @param packCommand 当前环境 的 打包命令
 * @returns
 */
const packAndBuildDockerImage = (dockerImageName, dockerFileName, packCommand = 'yarn build') => {
    const scripts = `
    yarn config set registry https://registry.npm.taobao.org -g
    yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g

    ${packCommand} || exit -1

    docker build -t ${dockerImageName} -f ${dockerFileName} . || exit -1
    `;
    return others_1.runShell(scripts);
};
exports.packAndBuildDockerImage = packAndBuildDockerImage;
/**
 * 登录、推送镜像,设置当前 tag 环境变量 DOCKER_TAG_LABEL=’tag-xxxx‘ > env-file
 * @param account docker 账号信息
 * @returns
 */
const loginAndPushDockerImage = (account, dockerImageName) => {
    /**
     * 1. login to docker hub (or any other hub)
     * 2. push docker image
     * 3. set __TAG env var
     */
    const { username, password } = account;
    const scripts = `
    export docker_u=${username}
    export docker_p=${password}

    echo "$docker_p" | docker login --username $docker_u --password-stdin registry.cn-shanghai.aliyuncs.com || exit -1

    unset docker_u
    unset docker_p

    echo '${others_1.repeatDash(10)}'
    echo 'docker image name is ${dockerImageName}'
    echo '${others_1.repeatDash(10)}'

    docker push ${dockerImageName} || exit -1

    echo ${constants_1.DOCKER_IMAGE_NAME_LABEL}='${dockerImageName}' > ${constants_1.ENV_FILE_NAME}
  `;
    return others_1.runShell(scripts);
};
exports.loginAndPushDockerImage = loginAndPushDockerImage;
