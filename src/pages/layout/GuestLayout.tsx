import {Button, Layout, Menu} from "antd";
import {Outlet} from "react-router-dom";
import FooterBar from "./FooterBar";
import i18n from "i18next";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {saveLanguage} from "../../store/commonSlice";
import {apiSaveUserLanguage} from "../../api/Api";

const {Header, Content, Footer} = Layout;

const GuestLayout = () => {
    const {t} = useTranslation();
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const dispatch=useDispatch()

    const onMenu = (e: any) => {
        if (e.key === "menuLanZh") {
            i18n.changeLanguage("zh");
            dispatch(saveLanguage("zh"))
            apiSaveUserLanguage({language: "zh"})
        }
        if (e.key === "menuLanEn") {
            i18n.changeLanguage("en");
            dispatch(saveLanguage("en"))
            apiSaveUserLanguage({language: "en"})
        }
    };
    return (
        <Layout style={{height: "100vh", background: themeColor.background}}>
            <Header>
                <Menu
                    style={{width: "100%", justifyContent: "flex-end"}}
                    theme="dark"
                    mode="horizontal"
                    items={[
                        {
                            key: "1",
                            label: t("nav.language"),
                            children: [
                                {label: "中文", key: "menuLanZh"},
                                {
                                    label: "English",
                                    key: "menuLanEn",
                                },
                            ],
                        },
                    ]}
                    onClick={(e) => {
                        onMenu(e);
                    }}
                />
            </Header>
            <Content>
                <Outlet/>
            </Content>
            <Footer>
                <FooterBar/>
            </Footer>
        </Layout>
    );
};

export default GuestLayout;
