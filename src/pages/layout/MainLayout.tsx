import {Col, Layout, Row} from "antd";
import {Outlet} from "react-router-dom";
import FooterBar from "./FooterBar";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {WalletOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import MainSider from "./MainSider";
import MainHeader from "./MainHeader";
import {useSelector} from "react-redux";

const {Header, Content, Footer, Sider} = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {t} = useTranslation();
    const navigate = useNavigate();
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);

    return (
        <Layout style={{minHeight: "100vh", background: themeColor.background}}>
            <Header
                style={{
                    position: "fixed",
                    width: "100%",
                    justifyContent: "space-around",
                    padding: 0,
                    zIndex: 1000,
                    background: themeColor.background,
                }}
            >
                <Row
                    style={{
                        width: "100%",
                        alignItems: "center",
                        height: 10,
                    }}
                >
                    <Col
                        xs={4}
                        sm={4}
                        md={8}
                        lg={6}
                        xl={5}
                        xxl={4}
                        style={{
                            justifyContent: "center",
                            display: "flex",
                            alignItems: "center",
                            margin: 0,
                            padding: 0,
                            width: "100%",
                        }}
                    >
                        <a href='/'>
                            <img src='/logo5.png' width="48px"/>
                        </a>
                        {collapsed ? (
                            null
                        ) : (
                            <div
                                style={{
                                    color: themeColor.textLight,
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    navigate("/");
                                }}
                            >
                                <div
                                    style={{
                                        color: themeColor.textLight,
                                        fontSize: 24,
                                        fontWeight: "bold",
                                        marginLeft: 20
                                    }}
                                >
                                    {t("common.appTitle")}
                                </div>
                            </div>
                        )}
                    </Col>
                    <Col xs={20} sm={20} md={16} lg={18} xl={19} xxl={20}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                width: "100%",
                            }}
                        >
                            <MainHeader/>
                        </div>
                    </Col>
                </Row>
            </Header>
            <Layout
                style={{
                    marginTop: "70px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "row",
                    background: themeColor.background,
                }}
            >
                <Sider
                    breakpoint="md"
                    onBreakpoint={(e) => {
                        setCollapsed(e);
                    }}
                    style={{background: themeColor.background}}
                >
                    <MainSider/>
                </Sider>
                <Content style={{margin: 10, padding: 20, width: "60vw"}}>
                    <Outlet/>
                </Content>
            </Layout>
            <Footer>
                <FooterBar/>
            </Footer>
        </Layout>
    );
};

export default MainLayout;
