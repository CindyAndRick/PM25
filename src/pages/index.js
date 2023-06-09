import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChartOutlined, UserOutlined, DesktopOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import MRouter from '../router/MRouter';

const { Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('AQI地图', 'map', <PieChartOutlined />),
    getItem('AQI数据', 'data', <DesktopOutlined />),
    getItem('用户', 'center', <UserOutlined />)
];

const Index = (props) => {
    // const [collapsed, setCollapsed] = useState(false);
    // const {
    //     token: { colorBgContainer },
    // } = theme.useToken();

    const navigate = useNavigate();

    const onMenuClick = (e) => {
        console.log('click', e);
        navigate('/' + e.key);
    };

    return (
        <Layout hasSider>
        <Layout>
            <Sider
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
            }}
            >
                <div
                    style={{
                        height: 32,
                        margin: 16,
                        background: 'rgba(255, 255, 255, 0.2)',
                    }}
                />
                <Menu theme="dark" defaultSelectedKeys={['map']} mode="inline" items={items} onClick={(e) => { onMenuClick(e) }} />
            </Sider>
            <Layout className="site-layout" style={{marginLeft: "200px", height:"100vh"}}>
                <MRouter />
            </Layout>
        </Layout >
        </Layout>
    );
};
export default Index;
