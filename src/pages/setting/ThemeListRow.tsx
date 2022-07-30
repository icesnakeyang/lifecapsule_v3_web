import { Button, Card, Input } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { apiListTheme } from "../../api/Api";
import { saveCurrentThemeId, saveThemeColor } from "../../store/themeSlice";

const ThemeListRow = (data: any) => {
  const { item } = data;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onSelectTheme = () => {
    if (item.themeId) {
      apiListTheme({})
        .then((res: any) => {
          if (res.code === 0) {
            dispatch(saveThemeColor(item));
            dispatch(saveCurrentThemeId(item.themeId));
          }
        })
        .catch((e) => {});
    }
  };

  return (
    <div style={{ flexDirection: "column" }}>
      <Card
        title={item.themeName}
        style={{ background: item.background }}
        headStyle={{ color: item.textLight }}
      >
        <div
          style={{
            color: item.textLight,
            textAlign: "center",
          }}
        >
          header
        </div>
        <div style={{ display: "flex", height: 60 }}>
          <div
            style={{
              color: item.textLight,
              width: "30%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Sider
          </div>
          <div
            style={{
              color: item.textLight,
              width: "70%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Input
              style={{ background: item.blockDark }}
              placeholder="Placeholder"
            />
          </div>
        </div>
      </Card>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <Button type="primary" onClick={onSelectTheme}>
          {t("setting.btSelect")}
        </Button>
      </div>
    </div>
  );
};

export default ThemeListRow;
