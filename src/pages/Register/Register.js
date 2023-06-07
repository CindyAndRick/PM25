import React from 'react'
import { useNavigate } from 'react-router-dom';
import { setToken, setIsLogin, setUserInfo } from '../../redux/actionCreator/UserDataCreator';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { API } from '../../utils/api.js';

import { Form, Button, Input, Layout, theme, message } from 'antd';
const { Header, Content, Footer } = Layout;

function Register(props) {

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const navigate = useNavigate();

    const handleToLogin = () => {
        navigate(`/Center/Login`);
    }

    const [messageApi, contextHolder] = message.useMessage();

    let { setIsLogin, setToken, setUserInfo } = props;

    const onFinish = (values) => {
        console.log(values);
        userRegister(values);
    };

    const userRegister = (value) => {
        const formData = new FormData();
        formData.append('username', value.username);
        formData.append('password', value.password);
        formData.append('nickname', value.nickname);
        formData.append('phone', value.phone);
        API({
            url: "user/register",
            method: "POST",
            data: formData
        }).then(
            res => {
                if (res.data.code === 200) {
                    setIsLogin(true);
                    setToken(res.data.token);
                    setUserInfo(res.data.data);
                    Cookies.set('token', res.data.token);
                    Cookies.set('userInfo', res.data.data);
                    navigate(`/center`);
                }
                else {
                    Cookies.remove('token');
                    messageApi.open({
                        type: 'error',
                        content: '注册失败，请更换用户名或密码'
                    })
                }
            }
        )
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Layout>
            {contextHolder}
            <Header
                style={{
                    padding: 0,
                    background: colorBgContainer,
                }}
            />
            <Content
                style={{
                    margin: '24px 16px 0',
                }}
            >
                <div
                    style={{
                        padding: 24,
                        minHeight: 360,
                        background: colorBgContainer,
                    }}
                >
                    <div>
                        <Form
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            style={{
                                maxWidth: 600,
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="用户名"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名'
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="密码"
                                name="password"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码'
                                    }
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                label="确认密码"
                                name="repassword"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: '请再次输入密码'
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('两次输入密码不匹配'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                label="手机"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入手机'
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="昵称"
                                name="nickname"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入昵称'
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    注册
                                </Button>
                                <Button type="link" htmlType="button" onClick={handleToLogin}>
                                    已有账号，去登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>

                </div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                Air Quality System ©2023 Created by Rick
            </Footer>
        </Layout>
    )
}


const mapStateToProps = (state) => {
    return {
        // isLogin: state.UserDataReducer.isLogin,
        // token: state.UserDataReducer.token
    }
}

const mapDispatchToProps = {
    setIsLogin,
    setToken,
    setUserInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)