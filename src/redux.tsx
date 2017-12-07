import { AnyAction, combineReducers } from 'redux';
import { DefaultApiFactory } from './api/account/gen/api';

let accountApi = DefaultApiFactory(fetch, 'http://127.0.0.1:8083/private-api/v1/accounts' );

export interface RootState {
}

export interface ApiError {
    status: number;
    code: string;
    message: string;
}

const ON_ERROR_MESSAGE = 'ON_ERROR_MESSAGE';
export function errorMessage( params: {message: string} ): AnyAction {
    return {
        type: ON_ERROR_MESSAGE,
        error: true,
        payload: {
            errorMessage: params.message
        },
    };
}

export function dispatchResponseError(dispatch: (action: AnyAction) => void , actionType: string, payload: {}) {
    dispatch({type: actionType, error: true, payload: payload});
    dispatch(errorMessage({message: JSON.stringify(payload)}));
}

export function errorFromResponse(response: {}): Promise<ApiError> {
    if (response instanceof Response) {
        return response.json().then((json: ApiError) => {
            return json;
        }).catch((err: {}) => {
            return {status: response.status, code: 'NetworkException', message: err.toString()};
        });
    } else if (response instanceof TypeError) {
        if (response.message === 'Failed to fetch') {
            return new Promise(function (resolve: (err: ApiError) => void) {
                resolve({status: 8193, code: 'NetworkException', message: '连接失败，请检查网络'});
            });
        } else {
            return new Promise(function (resolve: (err: ApiError) => void) {
                resolve({status: 8193, code: 'NetworkException', message: response.toString()});
            });
        }
    } else {
        return new Promise(function (resolve: (err: ApiError) => void) {
            resolve({status: 8193, code: 'NetworkException', message: '未知错误 response:' + response});
        });
    }
}

export interface SmsCodeParams {
    scene: string;
    phone: string;
    captchaId?: string;
    captchaCode?: string;
}
export const SMS_CODE_REQUEST = 'SMS_CODE_REQUEST';
export const SMS_CODE_SUCCESS = 'SMS_CODE_SUCCESS';
export const SMS_CODE_FAILURE = 'SMS_CODE_FAILURE';
export function apiSmsCode(params: SmsCodeParams,
                           onSuccess: () => void,
                           onError: (err: ApiError) => void): (dispatch: (action: AnyAction) => void) => void {
    console.log('apiSmsCode', params);
    return function (dispatch: (action: AnyAction) => void) {
        dispatch({type: SMS_CODE_REQUEST});
        return accountApi.smsCode(params).then(() => {
            dispatch({type: SMS_CODE_SUCCESS});
            onSuccess();
        }).catch((response) => {
            errorFromResponse(response).then((err) => {
                dispatchResponseError(dispatch, SMS_CODE_FAILURE, errorFromResponse(err));
                onError(err);
            });
        });
    };
}

export interface SmsSignupParams {
    phone: string;
    smsCode: string;
    password: string;
}
export const SMS_SIGNUP_REQUEST = 'SMS_SIGNUP_REQUEST';
export const SMS_SIGNUP_SUCCESS = 'SMS_SIGNUP_SUCCESS';
export const SMS_SIGNUP_FAILURE = 'SMS_SIGNUP_FAILURE';
export function apiSmsSignup(params: SmsSignupParams,
                             onSuccess: (jwt: string) => void,
                             onError: (err: ApiError) => void): (dispatch: (action: AnyAction) => void) => void {
    console.log('apiSmsSignup', params);
    return function (dispatch: (action: AnyAction) => void ) {
        dispatch({type: SMS_SIGNUP_REQUEST});
        return accountApi.smsSignup(params)
            .then((data) => {
                dispatch({type: SMS_SIGNUP_SUCCESS, payload: data});
                onSuccess(data);
            })
            .catch((response) => {
                errorFromResponse(response).then((err) => {
                    dispatchResponseError(dispatch, SMS_SIGNUP_FAILURE, err);
                    onError(err);
                });
            });
    };
}

export const rootReducer = combineReducers({

});