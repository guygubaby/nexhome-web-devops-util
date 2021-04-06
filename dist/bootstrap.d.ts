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
export declare const bootstrap: (config: BuildConfig) => Promise<string>;
