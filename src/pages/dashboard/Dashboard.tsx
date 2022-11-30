import {Breadcrumb, Button, Col, message, Row, Spin} from "antd";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {apiSnooze} from "../../api/Api";
import {timeLeft} from "../../common/common";
import {saveTimerPrimary} from "../../store/userDataSlice";

const Dashboard = () => {
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
    const {t} = useTranslation();
    const userData = useSelector((state: any) => state.userDataSlice) || null;
    const dispatch = useDispatch();
    const [leftDays, setLeftDays] = useState(0);
    const [leftHours, setLeftHours] = useState(0);
    const [leftMinutes, setLeftMinutes] = useState(0);
    const [leftSeconds, setLeftSeconds] = useState(0);

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        //对应componentDidUpdate
        function handleStatusChange(status: any) {
            dataRefresh();
        }

        const timer = setTimeout(() => {
            dataRefresh();
        }, 1000);
        // 对应componentWillUnmount
        return function cleanup() {
            timer && clearTimeout(timer);
        };
    });

    const dataRefresh = () => {
        let leftTime = timeLeft(userData.timerPrimary);
        setLeftDays(leftTime.days);
        setLeftHours(leftTime.hours);
        setLeftMinutes(leftTime.minutes);
        setLeftSeconds(leftTime.seconds);
    };

    const snoozePrimaryTimer = () => {
        setSaving(true);
        apiSnooze()
            .then((res: any) => {
                if (res.code === 0) {
                    dispatch(saveTimerPrimary(res.data.timerPrimary));
                    message.success(t("dashboard.tipSnoozeSuccess"));
                    setSaving(false);
                } else {
                    message.error(t("syserr." + res.code));
                    setSaving(false);
                }
            })
            .catch(() => {
                message.error(t("syserr.10001"));
                setSaving(false);
            });
    };

    return (
        <div style={{background: themeColor.background, padding: 20}}>
            <Breadcrumb style={{margin: "20px 0"}}>
                <Breadcrumb.Item>
                    <span style={{color: themeColor.textLight}}>{t("nav.home")}</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/main/dashboard" style={{color: themeColor.textLight}}>
                        {t("nav.dashboard")}
                    </a>
                </Breadcrumb.Item>
            </Breadcrumb>

            {userData ? (
                <div>
                    <div
                        style={{
                            padding: 10,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                margin: 20,
                            }}
                        >
                            <div
                                style={{
                                    color: themeColor.textLight,
                                    marginLeft: 20,
                                    fontSize: 18,
                                }}
                            >
                                {t("dashboard.tip1")}
                            </div>
                            <div style={{color: themeColor.textLight, fontSize: 24}}>
                                {userData.nickname}
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 40,
                            }}
                        >
                            <div style={{color: themeColor.textLight, fontSize: 16}}>
                                {t("dashboard.tip2")}
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",

                                padding: 20,
                            }}
                        >
                            <Row
                                style={{
                                    background: themeColor.blockDark,
                                    fontSize: 24,
                                    padding: 20,
                                }}
                            >
                                <div style={{color: themeColor.colorDanger}}>{leftDays}</div>
                                <div style={{color: themeColor.colorDanger2}}>
                                    {t("dashboard.days")}
                                </div>
                                <div style={{color: themeColor.colorDanger}}>{leftHours}</div>
                                <div style={{color: themeColor.colorDanger2}}>
                                    {t("dashboard.hours")}
                                </div>
                                <div style={{color: themeColor.colorDanger}}>
                                    {leftMinutes}
                                </div>
                                <div style={{color: themeColor.colorDanger2}}>
                                    {t("dashboard.minutes")}
                                </div>
                                <div style={{color: themeColor.colorDanger}}>
                                    {leftSeconds}
                                </div>
                                <div style={{color: themeColor.colorDanger2}}>
                                    {t("dashboard.seconds")}
                                </div>
                            </Row>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <div style={{color: themeColor.textLight}}>
                                {t("dashboard.tip3")}
                            </div>
                        </div>

                        {/*保存按钮区*/}
                        <div
                            style={{
                                marginLeft: 40,
                                marginRight: 40,
                                alignItems: "center",
                                marginTop: 60,
                                height: 100,
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            {saving ? (
                                <Spin/>
                            ) : (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    <Button
                                        type='primary'
                                        style={{
                                            backgroundColor: themeColor.color1,
                                            alignItems: "center",
                                            width: 140,
                                            height: 40,
                                            padding: 10,
                                            color: themeColor.textLight
                                        }}
                                        onClick={() => {
                                            snoozePrimaryTimer();
                                        }}
                                    >SNOOZE</Button>
                                    <div
                                        style={{
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginTop: 10,
                                        }}
                                    >
                                        <div style={{color: themeColor.textLight}}>
                                            {t("dashboard.tip4")}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div>no user data</div>
            )}
        </div>
    );
};

export default Dashboard;
