export namespace development {
    let username: string;
    let password: string;
    let database: string;
    let host: string;
    let port: string | number;
    let dialect: string;
    let timezone: string;
    let logging: (message?: any, ...optionalParams: any[]) => void;
    namespace pool {
        let max: number;
        let min: number;
        let acquire: number;
        let idle: number;
    }
}
export namespace test {
    let username_1: string;
    export { username_1 as username };
    let password_1: string;
    export { password_1 as password };
    let database_1: string;
    export { database_1 as database };
    let host_1: string;
    export { host_1 as host };
    let port_1: string | number;
    export { port_1 as port };
    let dialect_1: string;
    export { dialect_1 as dialect };
    let timezone_1: string;
    export { timezone_1 as timezone };
    let logging_1: boolean;
    export { logging_1 as logging };
    export namespace pool_1 {
        let max_1: number;
        export { max_1 as max };
        let min_1: number;
        export { min_1 as min };
        let acquire_1: number;
        export { acquire_1 as acquire };
        let idle_1: number;
        export { idle_1 as idle };
    }
    export { pool_1 as pool };
}
export namespace production {
    let username_2: string | undefined;
    export { username_2 as username };
    let password_2: string | undefined;
    export { password_2 as password };
    let database_2: string | undefined;
    export { database_2 as database };
    let host_2: string | undefined;
    export { host_2 as host };
    let port_2: string | number;
    export { port_2 as port };
    let dialect_2: string;
    export { dialect_2 as dialect };
    let timezone_2: string;
    export { timezone_2 as timezone };
    let logging_2: boolean;
    export { logging_2 as logging };
    export namespace pool_2 {
        let max_2: number;
        export { max_2 as max };
        let min_2: number;
        export { min_2 as min };
        let acquire_2: number;
        export { acquire_2 as acquire };
        let idle_2: number;
        export { idle_2 as idle };
    }
    export { pool_2 as pool };
}
