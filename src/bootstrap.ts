import {
  generateDockerTag,
  loginAndPushDockerImage,
  packAndBuildDockerImage,
  log,
} from './utils';
import { generateDockerComposeStr, uploadToQiniu } from './utils/others';
import { BuildConfig } from './utils/types';

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
export const bootstrap = async (config: BuildConfig): Promise<string> => {
  const {
    env,
    appName,
    version,
    buildCommand,
    dockerfile,
    dockerAccountInfo,
    deployedPort,
    qiniuAccountInfo,
    dockerHubPrefix,
    cicdType = 'jenkins'
  } = config;

  const tag = generateDockerTag({ name: appName, version }, cicdType);
  const dockerImageName = `${dockerHubPrefix}${appName}-${env}:${tag}`;
  log(dockerImageName);

  await packAndBuildDockerImage(dockerImageName, dockerfile, buildCommand);

  await loginAndPushDockerImage(dockerAccountInfo, dockerImageName);

  const dcStr = generateDockerComposeStr(
    dockerImageName,
    deployedPort,
    appName
  );
  const dockerComposeFileName = `${appName}/${env}/docker-compose.yml`;
  await uploadToQiniu(dcStr, qiniuAccountInfo, dockerComposeFileName);
  const url = `https://data.silkprint.v-ju.com.cn/${dockerComposeFileName}?hash=${Date.now()}`;
  log(url);

  return url;
};
