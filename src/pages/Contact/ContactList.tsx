import {Breadcrumb, Button, Card, Col, List, message, Row, Spin, Typography} from "antd";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {apiListMyContact} from "../../api/Api";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {saveContactList} from "../../store/contactSlice";
import ContactRow from "./ContactRow";

const ContactList = () => {
    const {t} = useTranslation();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const contactList = useSelector(
        (state: any) => state.contactSlice.contactList
    ) || []
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        return () => {
            loadAllData();
        };
    }, []);

    const loadAllData = () => {
        let params = {
            pageIndex,
            pageSize,
        };
        setLoading(true)
        apiListMyContact(params).then((res: any) => {
            if (res.code === 0) {
                dispatch(saveContactList(res.data.contactList));
                setLoading(false)
            } else {
                message.error(t('syserr.' + res.code))
            }
        }).catch(() => {
            message.error(t('syserr.10001'))
        })
    };

    const _renderContact = (item: any) => {
        return (
            <List.Item
                style={{background: themeColor.blockDark}}
                actions={[
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                            navigate("/main/contactEdit", {
                                state: {contactId: item.contactId},
                            });
                        }}
                    >
                        {t("common.btDetail")}
                    </Button>,
                ]}
            >
                <div
                    style={{
                        width: "100%",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            paddingLeft: "20px",
                        }}
                    >
                        <div style={{color: themeColor.textLight}}>
                            {item.contactName}
                        </div>
                        <div style={{color: themeColor.textLight, marginLeft: "20px"}}>
                            {item.phone}
                        </div>
                        <div style={{color: themeColor.textLight, marginLeft: "20px"}}>
                            {item.email}
                        </div>
                    </div>
                </div>
            </List.Item>
        );
    };

    return (
        <div style={{}}>
            <Breadcrumb items={[
                {
                    title: t("common.home"),
                    href: '/main/dashboard'
                },
                {
                    title: t("Contact.contactList")
                }
            ]}
            />

            {loading ?
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 100}}>
                    <Spin size='large'></Spin>
                </div>
                :
                <>
                    <Card size='small' style={{background: themeColor.blockDark, marginTop: 20}}>
                        <Button
                            type="primary"
                            onClick={() => {
                                navigate("/main/ContactEdit");
                            }}
                        >
                            {t("Contact.btNewContact")}
                        </Button>
                    </Card>

                    {contactList.length > 0 ?
                        <div>
                            {contactList.map((item: any, index: any) => (
                            <ContactRow item={item} key={index}/>
                            ))}
                        </div>
                        :
                        <>no data</>
                    }
                </>
            }
        </div>
    );
};

export default ContactList;
