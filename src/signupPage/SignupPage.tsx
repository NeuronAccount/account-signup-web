import { Button, TextField } from 'material-ui';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { checkPhone } from '../_common/common';
import { countdown } from '../_common/countdown';
import TimedText, { TextTimestamp } from '../_common/TimedText';
import { smsCodeParams, smsSignupParams } from '../api/account-private/gen';
import { apiSmsCode, apiSmsSignup, RootState } from '../redux';

interface Props {
    errorMessage: TextTimestamp;
    smsCodeSentMessage: TextTimestamp;

    apiSmsCode: (p: smsCodeParams) => Dispatchable;
    apiSmsSignup: (p: smsSignupParams) => Dispatchable;
}

interface State {
    errorMessage: TextTimestamp;
    signupPhone: string;
    signupSmsCode: string;
    signupPassword: string;
    smsCodeCountdown: number;
}
const initialState = {
    errorMessage: {text: '', timestamp: new Date()},
    signupPhone: '',
    signupSmsCode: '',
    signupPassword: '',
    smsCodeCountdown: 0
};

class SignupPage extends React.Component<Props, State> {
    private static renderTitle() {
        return (
            <div style={{width: '100%', height: '48px', backgroundColor: '#444'}}>
                <label
                    style={{
                        display: 'block',
                        textAlign: 'left',
                        color: '#FFF',
                        fontSize: '200%',
                        marginLeft: '8px'
                    }}
                >
                    注册火星帐号
                </label>
            </div>
        );
    }

    public componentWillMount() {
        this.onPhoneChanged = this.onPhoneChanged.bind(this);
        this.onPasswordChanged = this.onPasswordChanged.bind(this);
        this.onSmsCodeChanged = this.onSmsCodeChanged.bind(this);
        this.onSendSmsCodeButtonClick = this.onSendSmsCodeButtonClick.bind(this);
        this.onSignupButtonClick = this.onSignupButtonClick.bind(this);

        this.setState(initialState);
    }

    public componentWillReceiveProps(nextProps: Props) {
        const errorMessage = nextProps.errorMessage;
        const {text, timestamp} = errorMessage;
        if (text !== this.props.errorMessage.text
            || timestamp !== this.props.errorMessage.timestamp) {
            this.setState({errorMessage});
        }
    }

    public render() {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {SignupPage.renderTitle()}
                {this.renderContent()}
            </div>
        );
    }

    private renderContent() {
        return (
            <div style={{width: '300px', marginTop: '24px'}}>
                <div style={{height: '10px'}}>
                    {this.renderErrorMessage()}
                </div>
                {this.renderSmsSignup()}
            </div>
        );
    }

    private renderErrorMessage() {
        const {errorMessage} = this.state;
        if (!errorMessage) {
            return null;
        }

        const {text, timestamp} = errorMessage;

        return (
            <TimedText
                text={text}
                timestamp={timestamp}
                intervalMillSec={3000}
                style={{fontSize: '14px', color: 'red'}}
            />
        );
    }

    private onError(message: string) {
        this.setState({errorMessage: {text: message, timestamp: new Date()}});
    }

    private renderSmsSignup() {
        return (
            <div>
                {this.renderPhone()}
                {this.renderPassword()}
                {this.renderSmsCodeContainer()}
                {this.renderSignupButton()}
            </div>
        );
    }

    private renderPhone() {
        return (
            <TextField
                margin="normal"
                fullWidth={true}
                label={'手机号'}
                value={this.state.signupPhone}
                onChange={this.onPhoneChanged}
            />
        );
    }

    private onPhoneChanged(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({signupPhone: e.target.value});
    }

    private renderSmsCodeContainer() {
        return (
            <div>
                {this.renderSmsCode()}
                <div style={{height: '20px'}}>
                    {this.renderSmsCodeSentMessage()}
                </div>
                {this.renderSendSmsCodeButton()}
            </div>
        );
    }

    private renderSmsCode() {
        return (
            <TextField
                margin="normal"
                style={{width: '100px', float: 'left'}}
                label={'验证码'}
                value={this.state.signupSmsCode}
                onChange={this.onSmsCodeChanged}
            />
        );
    }

    private onSmsCodeChanged(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({signupSmsCode: e.target.value});
    }

    private renderSmsCodeSentMessage() {
        const {smsCodeSentMessage} = this.props;
        if (!smsCodeSentMessage) {
            return null;
        }

        const {text, timestamp} = smsCodeSentMessage;

        return (
            <TimedText
                text={text}
                timestamp={timestamp}
                intervalMillSec={3000}
                style={{fontSize: '14px', color: '#BBB', float: 'right'}}
            />
        );
    }

    private renderSendSmsCodeButton() {
        const {smsCodeCountdown} = this.state;
        const disabled = smsCodeCountdown > 0;
        const backgroundColor = disabled ? '#eee' : '#0088FF';
        const color = disabled ? '#888' : '#fff';

        return (
            <Button
                style={{
                    backgroundColor,
                    color,
                    float: 'right',
                    marginTop: '10px',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderRadius: '8px',
                    borderColor: '#eee'
                }}
                onClick={this.onSendSmsCodeButtonClick}
                disabled={disabled}
            >
                {disabled ? smsCodeCountdown + '秒后重新发送' : '发送短信验证码'}
            </Button>
        );
    }

    private onSendSmsCodeButtonClick() {
        const {signupPhone} = this.state;
        if (signupPhone === '') {
            return this.onError('！请输入手机号');
        }

        if (!checkPhone(signupPhone)) {
            return this.onError('！手机号格式不正确');
        }

        const COUNT_DOWN_SECONDS = 60;
        countdown(COUNT_DOWN_SECONDS, (n: number) => {
            this.setState({smsCodeCountdown: n});
        });

        this.props.apiSmsCode({scene: 'SMS_SIGNUP', phone: signupPhone});
    }

    private renderPassword() {
        return (
            <TextField
                margin="normal"
                fullWidth={true}
                type={'password'}
                label={'登录密码'}
                value={this.state.signupPassword}
                onChange={this.onPasswordChanged}
            />
        );
    }

    private onPasswordChanged(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({signupPassword: e.target.value});
    }

    private renderSignupButton() {
        return (
            <Button
                style={{
                    backgroundColor: '#0088FF',
                    fontSize: '150%',
                    color: '#fff',
                    width: '100%',
                    marginTop: '10px',
                    height: '48px',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderRadius: '8px',
                    borderColor: '#eee'
                }}
                onClick={this.onSignupButtonClick}
            >
                <label style={{fontSize: 'large'}}>注 册</label>
            </Button>
        );
    }

    private onSignupButtonClick() {
        const {signupPhone, signupPassword, signupSmsCode} = this.state;

        if (signupPhone === '') {
            return this.onError('！请输入手机号');
        }

        if (signupPassword === '') {
            return this.onError('！请输入密码');
        }

        if (signupSmsCode === '') {
            return this.onError('！请输入验证码');
        }

        this.props.apiSmsSignup({
            phone: signupPhone,
            smsCode: signupSmsCode,
            password: signupPassword
        });
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