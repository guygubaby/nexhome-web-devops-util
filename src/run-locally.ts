import {
  generateDockerTag,
  packAndBuildDockerImage,
  log,
  runLocally as runLocallyFunc,
} from './utils';
import { RunLocallyConfig } from './utils/types';

/**
 *  @param config 本地运行的配置信息
 */
export const runLocally = async (config: RunLocallyConfig): Promise<void> => {
  const {
    env,
    appName,
    version,
    buildCommand,
    dockerfile,
    deployedPort,
    dockerHubPrefix,
    containerName,
  } = config;

  const tag = generateDockerTag({ name: appName, version });
  const dockerImageName = `${dockerHubPrefix}${appName}-${env}:${tag}`;
  log(dockerImageName);
  await packAndBuildDockerImage(dockerImageName, dockerfile, buildCommand);
  await runLocallyFunc(deployedPort, dockerImageName, containerName);
};
