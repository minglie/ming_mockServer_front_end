import React from 'react'
import { Layout , Menu ,Icon} from  'antd';
import {HashRouter  , Route, Link  } from "react-router-dom"
import InterFaceManager from './pages/components/InterFaceManager.jsx'
import LogManager from './pages/components/LogManager.jsx';
import ConsoleDisPlay from './pages/components/ConsoleDisPlay.jsx';
import MingForm from './pages/components/MingForm.jsx'


const { Content, Sider } = Layout;






class App extends React.Component {
    state = {
        collapsed: false,
    };
    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    }
    render() {
        return (
            <HashRouter>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider
                        collapsible
                        collapsed={this.state.collapsed}
                        onCollapse={this.onCollapse}
                    >
                        <div className="logo" />
                        {/*<img src="baidu.png"/>*/}
                        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                            <Menu.Item key="1">
                                <Link to="/A"><Icon type="api" theme="twoTone" />接口管理</Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to="/B"><Icon type="file-text" theme="twoTone"/>日志管理</Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Link to="/C"><Icon type="desktop" />node控制台</Link>
                            </Menu.Item>
                            <Menu.Item key="4">
                                <a href="dbManager.html"><Icon type="database" theme="twoTone"/>数据库管理</a>
                            </Menu.Item>
                            <Menu.Item key="5">
                                <a href="https://www.yuque.com/wangpengfei-kgu2c/dy7nzd/vgkbv8"><Icon type="question" />帮助</a>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Content style={{ margin: '0 16px' }}>
                            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                                <Route exact path="/A" component={InterFaceManager} />
                                <Route path="/A_1" component={MingForm} />
                                <Route path="/B" component={LogManager} />
                                <Route path="/C" component={ConsoleDisPlay} />
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </HashRouter>
        );
    }
}


export default App;