import {Get, Post} from "./ApiBase";

// const host = "http://localhost:8003/lifecapsule3_api";
const host = "http://124.217.246.120:8003/lifecapsule3_api";

export const apiLogin = (params: any) => {
    return Post(`${host}/web/user/login`, params);
};

export const apiRegister = (params: any) => {
    return Post(`${host}/web/user/registerByLoginName`, params);
};

export const apiGetUserByToken = (params: any) => {
    return Post(`${host}/web/user/get_user_by_token`, params);
};

export const apiListMyNote = (params: any) => {
    return Post(`${host}/web/note/list_my_note`, params);
};

export const apiRequestRsaPublicKey = () => {
    return Get(`${host}/security/request_rsa_public_key`);
};

export const apiGetMyNote = (params: any) => {
    return Post(`${host}/web/note/get_my_note`, params);
};

export const apiListMyCategory = (params: any) => {
    return Post(`${host}/web/note/list_my_category`, params);
};

export const apiSaveMyCategory = (params: any) => {
    return Post(`${host}/web/note/save_my_category`, params);
};

export const apiDeleteMyCategory = (params: any) => {
    return Post(`${host}/web/note/delete_my_category`, params);
};

export const apiSignToken = () => {
    return Get(`${host}/web/user/sign_token`);
};

export const apiSaveMyNote = (params: any) => {
    return Post(`${host}/web/note/save_my_note`, params);
};

export const apiSaveMyContact = (params: any) => {
    return Post(`${host}/web/contact/save_my_contact`, params);
};

export const apiListMyContact = (params: any) => {
    return Post(`${host}/web/contact/list_my_contact`, params);
};

export const apiGetMyContact = (params: any) => {
    return Post(`${host}/web/contact/get_my_contact`, params);
};

export const apiDeleteMyContact = (params: any) => {
    return Post(`${host}/web/contact/delete_my_contact`, params);
};

export const apiDeleteMyNote = (params: any) => {
    return Post(`${host}/web/note/delete_my_note`, params);
};

/**
 * 把一个联系人添加到一篇笔记的接收人里
 */
export const apiAddContactToRecipient = (params: any) => {
    return Post(`${host}/web/recipient/add_contact_to_recipient`, params);
};

/**
 *
 * 读取我的一篇笔记的接收人列表
 */
export const apiListMyNoteRecipient = (params: any) => {
    return Post(`${host}/web/recipient/list_my_note_recipient`, params);
};

export const apiGetRecipient = (params: any) => {
    return Post(`${host}/web/recipient/get_recipient`, params);
};

export const apiSaveNoteRecipientTrigger = (params: any) => {
    return Post(`${host}/web/trigger/save_note_recipient_trigger`, params);
};

export const apiGetNoteRecipientTrigger = (params: any) => {
    return Post(`${host}/web/trigger/get_note_recipient_trigger`, params);
};

export const apiDeleteRecipient = (params: any) => {
    return Post(`${host}/web/recipient/delete_recipient`, params);
};

export const apiListMyTaskTodo = (params: any) => {
    return Post(`${host}/web/task/todo/listMyTaskTodo`, params);
};

export const apiCreateMyTaskTodo = (params: any) => {
    return Post(`${host}/web/task/todo/createMyTaskTodo`, params);
};

export const apiUpdateMyTaskTodo = (params: any) => {
    return Post(`${host}/web/task/todo/updateMyTaskTodo`, params);
};

export const apiGetMyTaskTodo = (params: any) => {
    return Post(`${host}/web/task/todo/getMyTaskTodo`, params);
};

export const apiDeleteMyTaskTodo = (params: any) => {
    return Post(`${host}/web/task/todo/deleteMyTaskTodo`, params);
};

export const apiSaveCreativeNote = (params: any) => {
    return Post(`${host}/web/creativeNote/saveCreativeNote`, params);
};

export const apiListMyCreativeNote = (params: any) => {
    return Post(`${host}/web/creativeNote/listMyCreativeNote`, params);
};

export const apiGetMyCreativeNote = (params: any) => {
    return Post(`${host}/web/creativeNote/getMyCreativeNote`, params);
};

/**
 * 读取四象限任务列表
 */
export const apiListMyQuadTask = (params: any) => {
    return Post(`${host}/web/quadTask/listMyQuadTask`, params);
};

export const apiCreateMyQuadTask = (params: any) => {
    return Post(`${host}/web/quadTask/createMyQuadTask`, params);
};

export const apiUpdateMyQuadTask = (params: any) => {
    return Post(`${host}/web/quadTask/updateMyQuadTask`, params);
};

export const apiListTheme = (params: any) => {
    return Post(`${host}/web/theme/listTheme`, params);
};

export const apiGetMyQuadTask = (params: any) => {
    return Post(`${host}/web/quadTask/getMyQuadTask`, params);
};

export const apiSetMyTaskComplete = (params: any) => {
    return Post(`${host}/web/quadTask/setMyTaskComplete`, params);
};

export const apiSetMyTaskProgress = (params: any) => {
    return Post(`${host}/web/quadTask/setMyTaskProgress`, params);
};

export const apiIncreaseQuadTaskPriority = (params: any) => {
    return Post(`${host}/web/quadTask/increaseQuadTaskPriority`, params);
};

export const apiDecreaseQuadTaskPriority = (params: any) => {
    return Post(`${host}/web/quadTask/decreaseQuadTaskPriority`, params);
};

export const apiDeleteCreativeNote = (params: any) => {
    return Post(`${host}/web/creativeNote/deleteCreativeNote`, params);
};

export const apiDeleteQuadTask = (params: any) => {
    return Post(`${host}/web/quadTask/deleteQuadTask`, params);
};

export const apiSaveRecipient = (params: any) => {
    return Post(`${host}/web/recipient/saveRecipient`, params);
};

export const apiSignInByNothing = () => {
    return Get(`${host}/web/user/signInByNothing`);
};

export const apiSnooze = () => {
    return Get(`${host}/web/timer/snooze`);
};

export const apiBindEmail = (params: any) => {
    return Post(`${host}/web/user/bindEmail`, params);
};

export const apiWebSendNote = (params: any) => {
    return Post(`${host}/web/noteSend/webSendNote`, params);
};

export const apiListMyNoteReceiveLog = (params: any) => {
    return Post(`${host}/web/noteSend/listMyNoteReceiveLog`, params);
};

export const apiGetMyReceiveNote = (params: any) => {
    return Post(`${host}/web/noteSend/getMyReceiveNote`, params);
};

export const apiSaveUserNickname = (params: any) => {
    return Post(`${host}/web/user/saveUserNickname`, params);
};

export const apiLoadMyNoteSendStatistic = (params: any) => {
    return Post(`${host}/web/note/loadMyNoteSendStatistic`, params);
};

export const apiListMyNoteTriggerLog = (params: any) => {
    return Post(`${host}/web/noteTriggerLog/listMyNoteTriggerLog`, params);
};

export const apiListMyNoteSendOutLog = (params: any) => {
    return Post(`${host}/web/noteSend/listMyNoteSendOutLog`, params);
};

export const apiListMyTriggerQue = (params: any) => {
    return Post(`${host}/web/trigger/listMyTriggerQue`, params);
};

export const apiGetMyNoteSendOutLog = (params: any) => {
    return Post(`${host}/web/noteSend/getMyNoteSendOutLog`, params);
};

export const apiAddEmailToRecipient = (params: any) => {
    return Post(`${host}/web/recipient/addEmailToRecipient`, params);
};

export const apiSignByEmail = (params: any) => {
    return Post(`${host}/web/user/signByEmail`, params);
};

export const apiSaveMyNoteTags = (params: any) => {
    return Post(`${host}/web/note/saveMyNoteTags`, params);
};

export const apiListUserNoteTag = () => {
    return Get(`${host}/web/tag/listUserNoteTag`);
};

export const apiListHotNoteTags = () => {
    return Get(`${host}/web/tag/listHotNoteTags`);
};

export const apiSendVerifyCodeToEmail = (params: any) => {
    return Post(`${host}/web/user/sendVerifyCodeToEmail`, params);
};

export const apiUpdateMyTaskTodoCompleteStatus = (params: any) => {
    return Post(`${host}/web/task/todo/updateMyTaskTodoCompleteStatus`, params);
};

export const apiCreateTriggerInstant = (params: any) => {
    return Post(`${host}/web/trigger/createTriggerInstant`, params);
};

export const apiSignByLoginName = (params: any) => {
    return Post(`${host}/web/user/signByLoginName`, params);
};

export const apiSetLoginNamePassword = (params: any) => {
    return Post(`${host}/web/user/setLoginNamePassword`, params);
};

export const apiListMyAntiDelayNote = (params: any) => {
    return Post(`${host}/web/anti_delay/listMyAntiDelayNote`, params);
};

export const apiGetMyAntiDelayNote = (params: any) => {
    return Post(`${host}/web/anti_delay/getMyAntiDelayNote`, params);
};

export const apiLoadLastMyAntiDelayNote = (params: any) => {
    return Post(`${host}/web/anti_delay/loadLastMyAntiDelayNote`, params);
};

export const apiCreateMyAntiDelayNote = (params: any) => {
    return Post(`${host}/web/anti_delay/createMyAntiDelayNote`, params);
};

export const apiUpdateMyAntiDelayNote = (params: any) => {
    return Post(`${host}/web/anti_delay/updateMyAntiDelayNote`, params);
};
