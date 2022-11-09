import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import {Layout, Menu} from 'antd';
import React, {useState} from 'react';
import './testpage.css'
import MainSider from "./layout/MainSider";
import {Outlet} from "react-router-dom";

const {Header, Sider, Content} = Layout;

const Testpage = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout>
            <Layout>
                <Sider
                    trigger={null}
                    breakpoint="md"
                    onBreakpoint={(e) => {
                        setCollapsed(e);
                    }}
                    style={{background: '#ccc'}}
                >
                    <MainSider/>
                </Sider>
                <Content style={{margin: 10, padding: 20, width: "60vw"}}>
                    <Outlet/>
                </Content>
            </Layout>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{padding: 0}}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        height: '100%'
                    }}>
                        <div style={{
                            width: 100,
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            display: 'flex'
                        }}>
                            <img src='/logo1.png' width="48px"/>
                        </div>
                        {collapsed ? null :
                            <div>
                                <div style={{color: '#fff', fontSize: 32, marginLeft: 20}}>Life capsule</div>
                            </div>}
                    </div>
                </Header>
            </Layout>
            <Layout>
                {/*<Sider trigger={null} collapsible collapsed={collapsed} breakpoint="sm" onBreakpoint={(e) => {*/}
                {/*<Sider trigger={null} collapsed={collapsed} breakpoint="sm" onBreakpoint={(e) => {*/}
                {/*    console.log(e)*/}
                {/*    setCollapsed(e)*/}
                {/*}}>*/}

                {/*    <Menu*/}
                {/*        theme="dark"*/}
                {/*        mode="inline"*/}
                {/*        defaultSelectedKeys={['1']}*/}
                {/*        items={[*/}
                {/*            {*/}
                {/*                key: '1',*/}
                {/*                icon: <UserOutlined/>,*/}
                {/*                label: 'nav 1',*/}
                {/*            },*/}
                {/*            {*/}
                {/*                key: '2',*/}
                {/*                icon: <VideoCameraOutlined/>,*/}
                {/*                label: 'nav 2',*/}
                {/*            },*/}
                {/*            {*/}
                {/*                key: '3',*/}
                {/*                icon: <UploadOutlined/>,*/}
                {/*                label: 'nav 3',*/}
                {/*            },*/}
                {/*        ]}*/}
                {/*    />*/}
                {/*</Sider>*/}
                <Sider
                    trigger={null}
                    breakpoint="md"
                    onBreakpoint={(e) => {
                        setCollapsed(e);
                    }}
                    style={{background: '#ccc'}}
                >
                    <MainSider/>
                </Sider>
                <Layout>
                    <Header className="site-layout-background" style={{padding: 0}}>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: () => setCollapsed(!collapsed),
                        })}
                    </Header>
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                        }}
                    >
                        Content
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    )
}
export default Testpage


