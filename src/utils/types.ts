export interface DockerInfo {
  dockerImageName: string;
  dockerFileName: string;
  dockerContainerName: string;
}

export type EnvName = 'dev' | 'test' | 'prod';

export interface PkgType {
  name: string;
  version: string;
}

export interface DockerAccountType {
  username: string;
  password: string;
}