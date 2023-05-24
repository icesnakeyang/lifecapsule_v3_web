import {useSelector} from "react-redux";
import {Alert, Breadcrumb, Button, Card, Col, message, Row, Spin} from "antd";
import {useEffect, useState} from "react";
import {apiListMyPublicNote} from "../../api/Api";
import {useTranslation} from "react-i18next";
import PublicNoteRow from "./PublicNoteRow";
import MyTip1 from "../components/MyTip1";

const PublicNoteList = () => {
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [noteList, setNoteList] = useState([])
    const {t} = useTranslation()
    const [loading, setLoading] = useState(true)
    const tipMsgs: String[] = [
        t('MyPublicNote.tip2')
    ]
    const top2list: [] = tipMsgs as []
    const [luckyList, setLuckyList] = useState([])
    const [person, setPerson] = useState({})

    useEffect(() => {
        loadAllData()
    }, [pageIndex, pageSize])

    const loadAllData = () => {
        let params = {
            pageIndex,
            pageSize
        }
        setLoading(true)
        apiListMyPublicNote(params).then((res: any) => {
            if (res.code === 0) {
                setNoteList(res.data.noteList)
                setLoading(false)
            } else {
                message.error(t('syserr.' + res.code))
            }
        }).catch(() => {
            message.error(t('syserr.10001'))
        })
    }

    const test2 = () => {
        // 初始化三个人的资金
        let person1 = {
            money: 100,
            ability: 0.3
        }
        let person2 = {
            money: 100,
            ability: 0.6
        }
        let person3 = {
            money: 100,
            ability: 0.9
        }

// 初始化好运事件和坏运事件
        let goodEvents = 30;
        let badEvents = 30;

// 模拟所有好运事件和坏运事件
        let eventList = []
        for (let i = 0; i < 100; i++) {
            // 随机选择一个人
            let randomPerson = Math.floor(Math.random() * 3) + 1;

            // 生成随机数来决定好运或坏运
            let randomNum = Math.random();

            // 根据运气值来计算资金变化
            switch (randomPerson) {
                case 1:
                    if (randomNum > 0.5) {
                        //好运
                        let r = Math.random()
                        if (r <= person1.ability) {
                            person1.money *= 2
                            let eve = {
                                event: '好运',
                                person: 'person1',
                                point: r.toFixed(2),
                                self: person1.ability,
                                event2: 'lucky up',
                                money: person1.money
                            }
                            eventList.push(eve)
                        } else {
                            let eve = {
                                event: '好运',
                                person: 'person1',
                                point: r.toFixed(2),
                                self: person1.ability,
                                event2: '遇到好运，但没有抓住',
                                money: person1.money
                            }
                            eventList.push(eve)
                        }
                    } else {
                        person1.money /= 2
                        let eve = {
                            event: '坏运',
                            person: 'person1',
                            event2: 'bad lucky',
                            money: person1.money
                        }
                        eventList.push(eve)
                    }
                    break;
                case 2:
                    if (randomNum > 0.5) {
                        //好运
                        let r = Math.random()
                        if (r <= person2.ability) {
                            person2.money *= 2
                            let eve = {
                                event: '好运',
                                person: 'person2',
                                point: r.toFixed(2),
                                self: person2.ability,
                                event2: 'lucky up',
                                money: person2.money
                            }
                            eventList.push(eve)
                        } else {
                            let eve = {
                                event: '好运',
                                person: 'person2',
                                point: r.toFixed(2),
                                self: person2.ability,
                                event2: '遇到好运，但没有抓住',
                                money: person2.money
                            }
                            eventList.push(eve)
                        }
                    } else {
                        person2.money /= 2
                        let eve = {
                            event: '坏运',
                            person: 'person2',
                            event2: 'bad lucky',
                            money: person2.money
                        }
                        eventList.push(eve)
                    }
                    break;
                case 3:
                    if (randomNum > 0.5) {
                        //好运
                        let r = Math.random()
                        if (r <= person3.ability) {
                            person3.money *= 2
                            let eve = {
                                event: '好运',
                                person: 'person3',
                                point: r.toFixed(2),
                                self: person3.ability,
                                event2: '好运成功',
                                money: person3.money
                            }
                            eventList.push(eve)
                        } else {
                            let eve = {
                                event: '好运',
                                person: 'person3',
                                point: r.toFixed(2),
                                self: person3.ability,
                                event2: '没有抓住',
                                money: person3.money
                            }
                            eventList.push(eve)
                        }
                    } else {
                        person3.money /= 2
                        let eve = {
                            event: '怀运',
                            person: 'person3',
                            event2: 'bad lucky',
                            money: person3.money
                        }
                        eventList.push(eve)
                    }
                    break;
            }
        }

// 输出结果
        let person = {
            person1: person1.money,
            person2: person2.money,
            person3: person3.money
        }
        setPerson(person)
        setLuckyList(eventList)
    }

    return (
        <div>
            <Breadcrumb style={{margin: "20px 0"}} items={[
                {
                    title: t('common.home'),
                    href: '/main/dashboard'
                },
                {
                    title: t("nav.myPublicNote")
                }
            ]}/>

            <MyTip1 title={t('MyPublicNote.tip1')} msgList={top2list}/>

            <div style={{marginTop: 20}}>
                {loading ?
                    <div style={{display: 'flex', justifyContent: 'center', marginTop: 100}}>
                        <Spin size='large'/>
                    </div>
                    :
                    noteList.map((item, index) => (
                        <PublicNoteRow item={item} key={index}/>
                    ))
                }
            </div>

            <Button onClick={() => {
                test2()
            }}>test 2</Button>
            <div style={{color: 'green'}}>
                <div>person1: {person.person1}</div>
                <div>person2: {person.person2}</div>
                <div>person3: {person.person3}</div>
                {luckyList.map((item, index) => (
                    <Row gutter={16}>
                        <Col span={2} style={{color: item.event === '好运' ? '#89f1da' : '#d5102e'}}>{item.event}</Col>
                        <Col span={3} style={{
                            color: item.person === 'person1' ? '#ff9300' : item.person === 'person2' ? '#1bea0a':
                            '#ea0202'
                        }}>{item.person}</Col>
                        <Col span={2}>{item.point}</Col>
                        <Col span={2}>{item.self}</Col>
                        <Col span={6}>{item.event2}</Col>
                        <Col span={2}>{item.money}</Col>
                    </Row>
                ))}
            </div>

        </div>
    )


}
export default PublicNoteList
