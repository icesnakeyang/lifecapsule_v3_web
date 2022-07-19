import { Get, Post } from "./ApiBase";

// const host = "http://localhost:8003/lifecapsule3_api";
// const host = "http://192.168.1.5:8003/lifecapsule3_api";
const host = "http://192.168.1.28:8003/lifecapsule3_api";
// const host = "http://192.168.43.97:8003/lifecapsule3_api";

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
