import {useLocation, useParams} from "react-router-dom";
import {apiGetArticle} from "../../api/Api";
import {useEffect, useState} from "react";
import {Card, Divider, message} from "antd";
import {useTranslation} from "react-i18next";
import moment from "moment";

const PublicArticle = () => {
    const {articleId} = useParams()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [views, setViews] = useState(0)
    const [createTime, setCreateTime] = useState(null)
    const [authorName, setAuthorName] = useState(null)
    const {t} = useTranslation()

    useEffect(() => {
        loadAllData()
    }, [])

    const loadAllData = () => {
        apiGetArticle(articleId || "").then((res: any) => {
            if (res.code === 0) {
                if (res.data.article) {
                    setTitle(res.data.article.title)
                    setContent(res.data.article.content)
                    setViews(res.data.article.view)
                    setCreateTime(res.data.article.createTime)
                    setAuthorName(res.data.article.authorName)
                } else {
                }
            } else {
                message.error(t('syserr.' + res.code))
            }
        }).catch(() => {
            message.error(t('syserr.10001'))
        })
    }

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {content ?
                <div style={{marginTop: 50}}>
                    <Card style={{background: '#d5d9e0',maxWidth: 1024, margin:10}}>
                        <div style={{color: '#333', fontSize: 24}}>{title}</div>
                        <div style={{display: 'flex', marginTop: 30, alignItems: 'center'}}>
                            <div style={{color: '#333'}}>{t('Public.PublicArticle.views')}</div>
                            <div style={{color: '#333', marginLeft: 10}}>{views ? views : 0}</div>
                            <div style={{color: '#333', marginLeft: 50}}>{t('Public.PublicArticle.publishTime')}</div>
                            <div style={{color: '#333', marginLeft: 10}}>{moment(createTime).format('ll')}</div>
                            <div style={{color: '#333', marginLeft: 50}}>{t('Public.PublicArticle.authorName')}</div>
                            <div style={{color: '#333', marginLeft: 10}}>{authorName}</div>
                        </div>
                        <Divider style={{borderColor: "#506a8f", borderWidth: 3, marginTop: 10}}/>
                        <div style={{fontSize: 20, color: '#333'}}>{content}</div>
                    </Card>
                </div>
                :
                <div style={{marginTop: 100}}>
                    <div style={{
                        color: '#f1184c',
                        fontSize: 24,
                        fontWeight: 'bold'
                    }}>{t('Public.PublicArticle.tipNoArticle')} </div>
                </div>
            }
        </div>
    )
}
export default PublicArticle
