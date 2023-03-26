import "./App.css";
import {BrowserRouter} from "react-router-dom";
import Routers from "./router/index";
import {ConfigProvider, theme} from "antd";

function App() {
    return (
        <ConfigProvider theme={{
         algorithm:theme.darkAlgorithm
        }}>
            <BrowserRouter>
                <Routers/>
            </BrowserRouter>
        </ConfigProvider>
    );
}

export default App;
