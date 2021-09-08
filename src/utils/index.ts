import { DOCKER_IMAGE_NAME_LABEL, ENV_FILE_NAME } from './constants';
import { getTimeStamp, runShell, repeatDash } from './others';
import { PkgType, DockerAccountType, CICD_TYPE } from './types';

/**
 * 生成 docker tag
 * @param pkg 当前项目的 package.json 文件
 * @returns
 */
export const generateDockerTag = (pkg: PkgType, cicdType: CICD_TYPE = 'jenkins'): string => {
  const { version } = pkg;
  const prop = cicdType === 'jenkins' ? 'GIT_COMMIT' : 'CI_COMMIT_SHORT_SHA'
  const { [prop]: sha } = process.env;
  // 版本 - 日期 - 环境名称 - git commit hash
  const tags: string[] = [version, getTimeStamp(), (sha || 'noopnoop').substr(0, 8)];
  const tag: string = tags.join('-');
  return tag;
};

/**
 * 本地运行
 * @param port 本地运行 的端口号
 * @returns
 */
export const runLocally = (
  port: number,
  dockerImageName: string,
  dockerContainerName: string
): Promise<void> => {
  const scripts = `
    docker stop ${dockerContainerName}
    sleep 3
    docker rm ${dockerContainerName}
    docker run -d --restart unless-stopped --name ${dockerContainerName} -p ${port}:80 ${dockerImageName} || exit -1
  `;
  return runShell(scripts);
};

/**
 * 打包 前端资源 ，并且打包 docker镜像
 * @param dockerImageName 当前环境 的 docker 镜像名称
 * @param dockerFileName 当前环境 的 dockerfile 文件名称
 * @param packCommand 当前环境 的 打包命令
 * @returns
 */
export const packAndBuildDockerImage = (
  dockerImageName: string,
  dockerFileName: string,
  packCommand: string = 'yarn build'
): Promise<void> => {
  const scripts = `
    yarn config set registry https://registry.npm.taobao.org -g
    yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g

    ${packCommand} || exit -1

    docker build -t ${dockerImageName} -f ${dockerFileName} . || exit -1
    `;
  return runShell(scripts);
};

/**
 * 登录、推送镜像,设置当前 tag 环境变量 DOCKER_TAG_LABEL=’tag-xxxx‘ > env-file
 * @param account docker 账号信息
 * @returns
 */
export const loginAndPushDockerImage = (
  account: DockerAccountType,
  dockerImageName: string
): Promise<void> => {
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

    echo '${repeatDash(10)}'
    echo 'docker image name is ${dockerImageName}'
    echo '${repeatDash(10)}'

    docker push ${dockerImageName} || exit -1

    echo ${DOCKER_IMAGE_NAME_LABEL}='${dockerImageName}' > ${ENV_FILE_NAME}
  `;

  return runShell(scripts);
};

export const log = (...args: any[]) => {
  console.log(repeatDash(10));
  console.log(...args);
  console.log(repeatDash(10));
};
