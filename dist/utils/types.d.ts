export interface DockerInfo {
    dockerImageName: string;
    dockerFileName: string;
    dockerContainerName: string;
}
export declare type EnvName = 'dev' | 'test' | 'prod';
export interface PkgType {
    name: string;
    version: string;
}
export interface DockerAccountType {
    username: string;
    password: string;
}
export interface QiniuAccountInfo {
    accessKey: string;
    secretKey: string;
}
