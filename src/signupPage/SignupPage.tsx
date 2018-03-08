import { Button, TextField } from 'material-ui';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import TimedText, { TextTimestamp } from '../_common/TimedText';
import { smsCodeParams, smsSignupParams } from '../api/account-private/gen';
import { apiSmsCode, apiSmsSignup, RootState } from '../redux';

interface Props {
    errorMessage: TextTimestamp;
    smsCodeSentMessage: TextTimestamp;

    apiSmsCode: (params: smsCodeParams) => Dispatchable;
    apiSmsSignup: (params: smsSignupParams) => Dispatchable;
}

interface State {
    errorMessage: TextTimestamp;
    signupPhone: string;
    signupSmsCode: string;
    signupPassword: string;
}

class SignupPage extends React.Component<Props, State> {
    public componentWillMount() {
        this.setState({
            errorMessage: {text: '', timestamp: new Date()},
            signupPhone: '',
            signupSmsCode: '',
            signupPassword: ''
        });
    }

    public componentWillReceiveProps(nextProps: Props) {
        if (nextProps.errorMessage.text !== this.props.errorMessage.text
            || nextProps.errorMessage.timestamp !== this.props.errorMessage.timestamp) {
            this.setState({errorMessage: nextProps.errorMessage});
        }
    }

    public onError(message: string) {
        this.setState({errorMessage: {text: message, timestamp: new Date()}});
    }

    public renderSmsSignup() {
        return (
            <div>
                <TextField
                    margin="normal"
                    fullWidth={true}
                    label={'手机号'}
                    value={this.state.signupPhone}
                    onChange={(e) => {
                        this.setState({signupPhone: e.target.value});
                    }}
                />
                <TextField
                    margin="normal"
                    fullWidth={true}
                    type={'password'}
                    label={'密码'}
                    value={this.state.signupPassword}
                    onChange={(e) => {
                        this.setState({signupPassword: e.target.value});
                    }}
                />
                <div>
                    <TextField
                        margin="normal"
                        style={{width: '100px', float: 'left'}}
                        label={'验证码'}
                        value={this.state.signupSmsCode}
                        onChange={(e) => {
                            this.setState({signupSmsCode: e.target.value});
                        }}
                    />
                    <div style={{height: '20px'}}>
                        {
                            this.props.smsCodeSentMessage &&
                            <TimedText
                                text={this.props.smsCodeSentMessage}
                                intervalMillSec={3000}
                                style={{fontSize: 'x-small', color: '#BBB', float: 'right'}}
                            />
                        }
                    </div>
                    <Button
                        style={{float: 'right', marginTop: '10px', backgroundColor: '#86ce2f', color: '#FFF'}}
                        onClick={() => {
                            if (this.state.signupPhone == null || this.state.signupPhone === '') {
                                return this.onError('！请输入手机号');
                            }

                            this.props.apiSmsCode({scene: 'SMS_SIGNUP', phone: this.state.signupPhone});
                        }}
                    >
                        发送短信验证码
                    </Button>
                </div>
                <Button
                    style={{backgroundColor: '#86ce2f', color: '#FFF', width: '100%', marginTop: '20px'}}
                    onClick={() => {
                        if (this.state.signupPhone == null || this.state.signupPhone === '') {
                            return this.onError('！请输入手机号');
                        }

                        if (this.state.signupPassword == null || this.state.signupPassword === '') {
                            return this.onError('！请输入密码');
                        }

                        if (this.state.signupSmsCode == null || this.state.signupSmsCode === '') {
                            return this.onError('！请输入验证码');
                        }

                        this.props.apiSmsSignup({
                            phone: this.state.signupPhone,
                            smsCode: this.state.signupSmsCode,
                            password: this.state.signupPassword
                        });
                    }}
                >
                    <label style={{fontSize: 'large'}}>注 册</label>
                </Button>
            </div>
        );
    }

    public render() {
        return (
            <div>
                <div
                    id={'header'}
                    style={{
                        width: '100%',
                        height: '48px',
                        backgroundColor: '#444'
                    }}
                >
                    <label
                        style={{
                            display: 'block',
                            textAlign: 'center',
                            color: '#FFF',
                            fontSize: '200%'
                        }}
                    >
                        注册火星帐号
                    </label>
                </div>
                <div
                    style={{
                        width: '300px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: '100px',
                    }}
                >
                    <div style={{height: '10px'}}>
                        {
                            this.state.errorMessage &&
                            <TimedText
                                text={this.state.errorMessage}
                                intervalMillSec={3000}
                                style={{fontSize: '50%', color: 'red'}}
                            />
                        }
                    </div>
                    {this.renderSmsSignup()}
                </div>
            </div>
        );
    }
}

function selectProps(state: RootState) {
    return {
        errorMessage: state.errorMessage,
        smsCodeSentMessage: state.smsCodeSentMessage,
    };
}

export default connect(
    selectProps, {
    apiSmsCode,
    apiSmsSignup})(SignupPage);