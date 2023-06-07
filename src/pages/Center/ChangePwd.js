import React from 'react'
import { connect } from 'react-redux';
import { API } from '../../utils/api';

import { Form, Input, Button, message } from 'antd';

function ChangePwd(props) {
    let { token, changeView } = props;

    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = (values) => {
        userChangePassword(values);
    };

    const userChangePassword = (values) => {
        const formData = new FormData();
        formData.append('old_password', values.oldpassword);
        formData.append('new_password', values.newpassword);
        API({
            url: "user/changePassword",
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: formData
        }).then(
            res => {
                if (res.data.code === 200) {
                    messageApi.open({
                        type: 'success',
                        content: '修改成功，正在跳转...'
                    })
                    setTimeout(() => {
                        changeView(0);
                    }, 1000);
                }
                else {
                    if (res.data.msg === 'wrong password') {
                        messageApi.open({
                            type: 'error',
                            content: '原始密码错误'
                        })
                    }
                }
            }
        )
    }



    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            {contextHolder}
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
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="原始密码"
                    name="oldpassword"
                    rules={[
                        {
                            required: true,
                            message: '请输入原始密码'
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="新密码"
                    name="newpassword"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: '请输入新密码'
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
                            message: '请再次输入新密码'
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newpassword') === value) {
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
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit" >
                        提交
                    </Button>
                    <Button type="primary" htmlType="button" style={{ marginLeft: '20px' }} onClick={() => { changeView(0) }}>
                        取消
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        token: state.UserDataReducer.token
    }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePwd)