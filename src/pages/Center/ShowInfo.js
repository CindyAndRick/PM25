import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Descriptions, Button, message } from 'antd';

function ShowInfo(props) {

    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();

    let { userInfo, changeView } = props;

    useEffect(() => {
        if (Object.keys(userInfo).length === 0) {
            messageApi.open({
                type: 'error',
                content: '无法获取用户信息，请重新登陆！'
            })
            setTimeout(() => {
                navigate(`/login`);
            }, 1000);
        }
    }, []);

    return (
        <div>
            {contextHolder}
            <Descriptions title="用户信息">
                <Descriptions.Item label="用户名">{userInfo.username}</Descriptions.Item>
                <Descriptions.Item label="昵称">{userInfo.nickname}</Descriptions.Item>
                <Descriptions.Item label="电话">{userInfo.phone}</Descriptions.Item>
            </Descriptions>
            <Button type="primary" onClick={() => { changeView(1) }}>修改账户信息</Button>
            <Button type="primary" onClick={() => { changeView(2) }} style={{ marginLeft: '20px' }}>修改密码</Button>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.UserDataReducer.userInfo
    }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ShowInfo)
