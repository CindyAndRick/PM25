import React from 'react'
import { useNavigate } from 'react-router-dom';
import { setToken, setIsLogin, setUserInfo } from '../../redux/actionCreator/UserDataCreator';
import { getFavourCity } from '../../redux/actionCreator/CityDataCreator';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { API } from '../../utils/api.js';
import { Form, Button, Input, Checkbox, message, Layout, theme } from 'antd';
const { Header, Content, Footer } = Layout;

function Login(props) {

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    let { setIsLogin, setToken, setUserInfo, getFavourCity } = props;

    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const handleToRegister = () => {
        navigate(`/register`);
    }

    const onFinish = (values) => {
        userLogin(values);
    };

    const userLogin = (value) => {
        const formData = new FormData();
        formData.append('username', value.username);
        formData.append('password', value.password);
        API({
            url: "user/login",
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
                    getFavourCity(res.data.token);
                    navigate(`/center`);
                }
                else {
                    Cookies.remove('token');
                    messageApi.open({
                        type: 'error',
                        content: '用户名或密码错误，登陆失败！'
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
                                name="remember"
                                valuePropName="checked"
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Checkbox>记住我</Checkbox>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    登录
                                </Button>
                                <Button type="link" htmlType='button' onClick={handleToRegister}>
                                    还没有账号？现在就注册！
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
        token: state.UserDataReducer.token,
        isLogin: state.UserDataReducer.isLogin
    }
}

const mapDispatchToProps = {
    setToken,
    setIsLogin,
    setUserInfo,
    getFavourCity
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)