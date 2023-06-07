import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom';
import { connect } from 'react-redux';
import { verifyToken, setIsLogin, setToken } from '../../redux/actionCreator/UserDataCreator';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import ShowInfo from './ShowInfo';
import ChangeInfo from './ChangeInfo';
import ChangePwd from './ChangePwd';

import { Layout, theme, Input, Form, Button, message } from 'antd';
const { Header, Content, Footer } = Layout;

function Center(props) {

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const navigate = useNavigate();

    let { userInfo, isLogin, token, verifyToken, setIsLogin, setToken } = props;

    const [currentView, setCurrentView] = useState(0);

    useEffect(() => {
        let tmp = Cookies.get('token');
        if (tmp !== undefined) {
            setToken(tmp);
            verifyToken(tmp);
        }
        else {
            navigate(`/login`);
        }
        return () => {
        }
    }, []);

    const switchView = () => {
        switch (currentView) {
            case 0:
                return <ShowInfo changeView={setCurrentView} />;
            case 1:
                return <ChangeInfo changeView={setCurrentView} />;
            case 2:
                return <ChangePwd changeView={setCurrentView} />;
            default:
                return <ShowInfo changeView={setCurrentView} />;
        }
    }

    return (
        <Layout>
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
                    {switchView()}
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
        userInfo: state.UserDataReducer.userInfo,
        isLogin: state.UserDataReducer.isLogin,
        token: state.UserDataReducer.token,
    }
}

const mapDispatchToProps = {
    verifyToken,
    setIsLogin,
    setToken
}

export default connect(mapStateToProps, mapDispatchToProps)(Center)