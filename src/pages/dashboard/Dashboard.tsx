import { Breadcrumb } from "antd";

const Dashboard = () => {
  return (
    <div>
      <Breadcrumb style={{ margin: "20px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/guest/login">App</a>
        </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
};

export default Dashboard;
