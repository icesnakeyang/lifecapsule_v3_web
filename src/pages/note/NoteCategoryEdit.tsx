import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  List,
  message,
  Modal,
  Skeleton,
} from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  apiDeleteMyCategory,
  apiListMyCategory,
  apiSaveMyCategory,
} from "../../api/Api";
import { useDispatch } from "react-redux";
import {
  saveNoteCategoryCurrent,
  saveNoteCategoryList,
} from "../../store/noteDataSlice";
import { useNavigate } from "react-router-dom";

const NoteCategoryEdit = () => {
  const { t } = useTranslation();
  const [modalCategoryEdit, setModalCategoryEdit] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [remark, setRemark] = useState("");
  const [refresh, setRefresh] = useState(0);
  const dispatch = useDispatch();
  const [categoryId, setCategoryId] = useState("");
  const [modalDelete, setModalDelete] = useState(false);
  const navigate = useNavigate();
  const categoryList = useSelector(
    (state: any) => state.noteDataSlice.categoryList
  );
  const currentCategoryId = useSelector(
    (state: any) => state.noteDataSlice.currentCategoryId
  );

  useEffect(() => {
    return () => {};
  }, [refresh]);

  const _renderItem = (item: any) => {
    return (
      <>
        <List.Item
          actions={[
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setCategoryId(item.categoryId);
                setCategoryName(item.categoryName);
                setRemark(item.remark);
                setModalCategoryEdit(true);
              }}
            >
              {t("common.btEdit")}
            </Button>,
            <Button
              type="primary"
              size="small"
              danger
              onClick={() => {
                setCategoryId(item.categoryId);
                setModalDelete(true);
              }}
            >
              {t("common.btDelete")}
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={item.categoryName}
            description={`${item.noteType} - ${item.remark}`}
          />
        </List.Item>
      </>
    );
  };
  return (
    <div>
      <Card>
        <Button
          type="primary"
          onClick={() => {
            setCategoryName("");
            setRemark("");
            setCategoryId("");
            setModalCategoryEdit(true);
          }}
        >
          {t("note.btNewCategory")}
        </Button>
      </Card>
      <List
        loading={false}
        dataSource={categoryList}
        renderItem={(item: any) => _renderItem(item)}
      />
      <Modal
        title={t("note.modalNewTitle")}
        visible={modalCategoryEdit}
        onCancel={() => {
          setModalCategoryEdit(false);
        }}
        onOk={() => {
          setModalCategoryEdit(false);
          let params = {
            categoryName,
            remark,
            categoryId,
          };
          apiSaveMyCategory(params)
            .then((res: any) => {
              if (res.code === 0) {
                message.success(t("note.tipCategoryAddSuccess"));
                apiListMyCategory({}).then((res: any) => {
                  if (res.code === 0) {
                    dispatch(saveNoteCategoryList(res.data.categoryList));
                  }
                });
              } else {
                message.error(t("syserr." + res.code));
              }
            })
            .catch(() => {
              message.error(t("syserr.10001"));
            });
        }}
        closable={false}
        mask={true}
        maskClosable={false}
      >
        <>
          <Form layout="vertical">
            <Form.Item label={t("note.categoryName")}>
              <Input
                placeholder={t("note.categoryNameHolder")}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                }}
                value={categoryName}
              />
            </Form.Item>
            <Form.Item label={t("note.description")}>
              <Input
                placeholder={t("note.descriptionHolder")}
                onChange={(e) => setRemark(e.target.value)}
                value={remark}
              />
            </Form.Item>
          </Form>
        </>
      </Modal>

      <Modal
        visible={modalDelete}
        closable={false}
        mask={true}
        maskClosable={false}
        onCancel={() => {
          setModalDelete(false);
        }}
        onOk={() => {
          let params = {
            categoryId,
          };
          apiDeleteMyCategory(params)
            .then((res: any) => {
              if (res.code === 0) {
                message.success(t("note.tipCateogryDeleteSuccess"));
                apiListMyCategory({}).then((res: any) => {
                  if (res.code === 0) {
                    dispatch(saveNoteCategoryList(res.data.categoryList));
                    /**
                     * 如果删除的是当前分类，则设置当前分类为default
                     */
                    if (currentCategoryId === categoryId) {
                      for (let i = 0; i < res.data.categoryList.length; i++) {
                        if (
                          res.data.categoryList[i].categoryName === "DEFAULT"
                        ) {
                          dispatch(
                            saveNoteCategoryCurrent(
                              res.data.categoryList[i].categoryId
                            )
                          );
                        }
                      }
                    }
                    setModalDelete(false);
                  }
                });
              } else {
                message.error(t("syserr." + res.code));
                setModalDelete(false);
              }
            })
            .catch(() => {
              message.error(t("syserr.10001"));
              setModalDelete(false);
            });
        }}
      >
        <p>{t("common.tipModalDelete")}</p>
      </Modal>
    </div>
  );
};

export default NoteCategoryEdit;
