export interface FetchAPI {
    (url: string, init?: any): Promise<any>;
}
export interface FetchArgs {
    url: string;
    options: any;
}
export declare class BaseAPI {
    basePath: string;
    fetch: FetchAPI;
    constructor(fetch?: FetchAPI, basePath?: string);
}
export interface InlineResponseDefault {
    "status"?: string;
    /**
     * Error code
     */
    "code"?: string;
    /**
     * Error message
     */
    "message"?: string;
    /**
     * Errors
     */
    "errors"?: Array<InlineResponseDefaultErrors>;
}
export interface InlineResponseDefaultErrors {
    /**
     * field name
     */
    "field"?: string;
    /**
     * error code
     */
    "code"?: string;
    /**
     * error message
     */
    "message"?: string;
}
/**
 * DefaultApi - fetch parameter creator
 */
export declare const DefaultApiFetchParamCreator: {
    login(params: {
        "name": string;
        "password": string;
    }, options?: any): FetchArgs;
    logout(params: {
        "jwt": string;
    }, options?: any): FetchArgs;
    smsCode(params: {
        "scene": string;
        "phone": string;
        "captchaId"?: string;
        "captchaCode"?: string;
    }, options?: any): FetchArgs;
    smsLogin(params: {
        "phone": string;
        "smsCode": string;
    }, options?: any): FetchArgs;
    smsSignup(params: {
        "phone": string;
        "smsCode": string;
        "password": string;
    }, options?: any): FetchArgs;
};
/**
 * DefaultApi - functional programming interface
 */
export declare const DefaultApiFp: {
    login(params: {
        "name": string;
        "password": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<string>;
    logout(params: {
        "jwt": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<any>;
    smsCode(params: {
        "scene": string;
        "phone": string;
        "captchaId"?: string;
        "captchaCode"?: string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<any>;
    smsLogin(params: {
        "phone": string;
        "smsCode": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<string>;
    smsSignup(params: {
        "phone": string;
        "smsCode": string;
        "password": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<string>;
};
/**
 * DefaultApi - object-oriented interface
 */
export declare class DefaultApi extends BaseAPI {
    /**
     *
     * @summary
     * @param name
     * @param password
     */
    login(params: {
        "name": string;
        "password": string;
    }, options?: any): Promise<string>;
    /**
     *
     * @summary
     * @param jwt
     */
    logout(params: {
        "jwt": string;
    }, options?: any): Promise<any>;
    /**
     *
     * @summary
     * @param scene
     * @param phone
     * @param captchaId
     * @param captchaCode
     */
    smsCode(params: {
        "scene": string;
        "phone": string;
        "captchaId"?: string;
        "captchaCode"?: string;
    }, options?: any): Promise<any>;
    /**
     *
     * @summary sms login
     * @param phone
     * @param smsCode
     */
    smsLogin(params: {
        "phone": string;
        "smsCode": string;
    }, options?: any): Promise<string>;
    /**
     *
     * @summary sms signup
     * @param phone
     * @param smsCode
     * @param password
     */
    smsSignup(params: {
        "phone": string;
        "smsCode": string;
        "password": string;
    }, options?: any): Promise<string>;
}
/**
 * DefaultApi - factory interface
 */
export declare const DefaultApiFactory: (fetch?: FetchAPI, basePath?: string) => {
    login(params: {
        "name": string;
        "password": string;
    }, options?: any): Promise<string>;
    logout(params: {
        "jwt": string;
    }, options?: any): Promise<any>;
    smsCode(params: {
        "scene": string;
        "phone": string;
        "captchaId"?: string;
        "captchaCode"?: string;
    }, options?: any): Promise<any>;
    smsLogin(params: {
        "phone": string;
        "smsCode": string;
    }, options?: any): Promise<string>;
    smsSignup(params: {
        "phone": string;
        "smsCode": string;
        "password": string;
    }, options?: any): Promise<string>;
};
