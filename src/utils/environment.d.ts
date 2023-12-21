declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_SECRET: string,
            GITHUB_AUTH_TOKEN: string;
            NODE_ENV: 'development' | 'production';
            PORT?: string;
            PWD: string;
        }
    }
}

export {}