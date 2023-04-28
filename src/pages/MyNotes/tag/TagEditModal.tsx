import {Button, Divider, Form, Input, message, Modal, Space} from "antd";
import NoteEditTagRowEdit from "../NoteEditTagRowEdit";
import MyNoteTags1 from "../../components/MyNoteTags1";
import HotTags1 from "../../components/HotTags1";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {saveEditTags} from "../../../store/tagSlice";
import {useDispatch, useSelector} from "react-redux";
import {apiSaveMyNoteTags} from "../../../api/Api";

const TagEditModal = ({visible, hideModal}: any) => {
    const {t} = useTranslation()
    const [tagEdit, setTagEdit] = useState('')
    const editTags = useSelector((state: any) => state.tagSlice.editTags)
    const dispatch = useDispatch()
    const noteId = useSelector((state: any) => state.noteDataSlice.noteId)

    const onAddTag = () => {
        if (!tagEdit) {
            return
        }
        if (!editTags || editTags.length === 0) {
            let list = [{tagName: tagEdit}]
            dispatch(saveEditTags(list))
        } else {
            let cc = 0;
            let tags = []
            editTags.map((item: any) => {
                tags.push(item)
                if (item.tagName === tagEdit) {
                    cc++
                }
            })
            if (cc === 0) {
                tags.push({tagName: tagEdit})
            }
            dispatch(saveEditTags(tags))
        }
    }

    const onSaveTags = () => {
        if (!noteId) {
            return
        }
        /**
         * 保存tag到note
         */
        let params = {
            tagList: editTags,
            noteId
        }
        console.log('保存标签')
        apiSaveMyNoteTags(params).then((res: any) => {
            if (res.code === 0) {
                console.log('保存成功')
                message.success(t('Tag.tipSaveTagSuccess'))
            } else {
                message.error(t('syserr.' + res.code))
            }
        }).catch(() => {
            message.error(t('syserr.10001'))
        })
    }

    return (
        <Modal
            open={visible}
            closable={false}
            onOk={() => {
                onSaveTags()
                hideModal()
            }}
            onCancel={() => {
                hideModal()
            }}
            // cancelButtonProps={{style: {display: "none"}}}
        >
            <Form>
                <Form.Item>
                    <div>{t('Tag.addTag')}</div>
                    <Space.Compact>
                        {/*<Input style={{width: 'calc(100% - 100px)'}} value={tagEdit} onChange={(e) => {*/}
                        <Input style={{width: '100%'}} value={tagEdit} onChange={(e) => {
                            setTagEdit(e.target.value)
                        }}/>
                        <Button type='primary' onClick={() => onAddTag()}>{t('common.btAdd')}</Button>
                    </Space.Compact>

                </Form.Item>
            </Form>
            <div>
                {editTags.length > 0 ? editTags.map((item: any, index: any) => (
                    <NoteEditTagRowEdit item={item} key={index}/>
                )) : null}
            </div>
            <Divider/>
            <div>
                <div>{t('Tag.myTags')}</div>
                <div>
                    <MyNoteTags1/>
                </div>
            </div>
            <Divider/>
            <div>
                <div>{t('Tag.hotTags')}</div>
                <div style={{marginTop: 10}}>
                    <HotTags1/>
                </div>
            </div>
        </Modal>
    )
}
export default TagEditModal
