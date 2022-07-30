import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { apiListTheme } from "../../api/Api";
import ThemeListRow from "./ThemeListRow";

const ThemeSetting = () => {
  const [themeList, setThemeList] = useState([]);

  useEffect(() => {
    loadAllData();
    return () => {};
  }, []);

  const loadAllData = () => {
    let params = {};
    apiListTheme(params).then((res: any) => {
      if (res.code === 0) {
        setThemeList(res.data.themeList);
      }
    });
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Row gutter={8}>
          {themeList ? (
            themeList.map((item, index) => (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={6}
                xl={5}
                xxl={4}
                style={{ padding: 5 }}
                key={index}
              >
                <ThemeListRow item={item} />
              </Col>
            ))
          ) : (
            <div>no data</div>
          )}
        </Row>
      </div>
    </div>
  );
};

export default ThemeSetting;
