## 使用
  框架介绍，使用webpac打包构建的react单页面应用，集成antd。使用webpack-dev-server启动本地服务，加入热更新便于开发调试。
### 启动
```js
  git clone https://gitee.com/wjj0720/react-demo.git
  cd react-demo
  yarn
  yarn start
```
### 打包
```js
  yarn build
```
### 目录结构
```js
  +node_modules
  -src
    +asset
    +Layout
    +pages
    +redux
    +utils
    +app.js
    +index.html
    +index.js
  .babelrc 
  package.json 
  postcss.config.js
  webpack.config.js //webpack 配置
```
## bundle-loader 懒加载使用
```js
  // webpack.config.js 配置
  module: {
    rules: [
      {
        test: /\.bundle\.js$/,
        use: {
          loader: 'bundle-loader',
          options: {
            name: '[name]',
            lazy: true
          }
        }
      }
    ]
  }
  // 页面引入组件
  import Home from "bundle-loader?lazy&name=[name]!./Home";

  // 组件使用 因为组件懒加载 是通过异步的形式引入 所以不能再页面直接以标签的形式使用 需要做使用封装 
  import React, {Component} from 'react'
  import { withRouter } from 'react-router-dom'
  class LazyLoad extends Component {
    state = {
      LoadOver: null
    }
    componentWillMount() {
      this.props.Loading(c => {
        this.setState({
          LoadOver: withRouter(c.default)
        })
      })
    }
  
    render() {
      let {LoadOver} = this.state;
      return (
        LoadOver ? <LoadOver/> : <div>加载动画</div>
      )
    }
  }
  export default LazyLoad

  // 通过封装的懒加载组件过度 增加加载动画
  <LazyLoad Loading={Home} />
```

## 路由配置
  框架按照模块划分，pages文件夹下具有route.js 即为一个模块
```js
  // 通过require.context读取模块下路由文件
  const files = require.context('./pages', true, /route\.js$/)
  let routers = files.keys().reduce((routers, route) => {
    let router = files(route).default
    return routers.concat(router)
  }, [])

  // 模块路由文件格式
  import User from "bundle-loader?lazy&name=[name]!./User";
  export default [
    {
      path: '/user',
      component: User
    },
    {
      path: '/user/:id',
      component: User
    }
  ]

```

## redux 使用介绍
```js
  // ---------创建 --------
  // 为了不免action、reducer 在不同文件 来回切换 对象的形式创建

  // createReducer 将书写格式创建成rudex认识的reducer
  export function createReducer({state: initState, reducer}) {
    return (state = initState, action) => {
      return reducer.hasOwnProperty(action.type) ? reducer[action.type](state, action) : state
    }
  }

  // 创建页面级别的store
  const User_Info_fetch_Memo = 'User_Info_fetch_Memo'
  const store = {
    // 初始化数据
    state: {
      memo: 9,
      test: 0
    },
    action: {
      async fetchMemo (params) {
        return {
          type: User_Info_fetch_Memo,
          callAPI: {url: 'http://stage-mapi.yimifudao.com/statistics/cc/kpi', params, config: {}},
          payload: params
        }
      },
      ...
    },
    reducer: {
      [User_Info_fetch_Memo] (prevState = {}, {payload}) {
        console.log('reducer--->',payload)
        return {
          ...prevState,
          memo: payload.memo
        }
      },
      ...
    }
  }

  export default createReducer(store)
  export const action = store.action

  // 最终在模块界别组合 [当然模块也有公共的数据(见Home模块下的demo写法)]
  import {combineReducers} from 'redux'
  import info from './Info/store'
  export default combineReducers({
    info,
    。。。
  })

  // 最终rudex文件夹下的store.js 会去取所有模块下的store.js  组成一个大的store也就是我们最终仓库

  // --------使用------
  // 首先在app.js中将store和app关联
  import { createStore } from 'redux'
  import { Provider } from 'react-redux'
  // reducer即我们最终
  import reducer from './redux/store.js'
  // 用户异步action的中间件
  import middleware from './utils/middleware.js'
  let store = createStore(reducer, middleware)
  <Provider store={store}>
    。。。
  </Provider>


  // 然后组件调用 只需要在组件导出时候 使用connent链接即可
  import React, {Component} from 'react'
  import {connect} from 'react-redux'
  // 从页面级别的store中导出action
  import {action} from './store'

  class Demo extends Component {
    const handle = () => {
      // 触发action
      this.props.dispatch(action.fetchMemo({}))
    }
    render () {
      console.log(this.props.test)
      return <div onClick={this.handle}>ss</div>
    }
  }
  export default connect(state => ({
    test: state.user.memo.test
  }) )(demo) 
  
```
## 关于redux中间件 
```js
  // 与其说redux中间件不如说action中间件
  // 中间件执行时机  即每个action触发之前执行

  // 
  import { applyMiddleware } from 'redux'
  import fetchProxy from './fetchProxy';

  // 中间件 是三个嵌套的函数 第一个入参为整个store 第二个为store.dispatch 第三个为本次触发的action 
  // 简单封装的中间件  没有对请求失败做过多处理 目的在与项错误处理机制给到页面处理
  const middleware = ({getState}) => next => async action => {
    // 此时的aciton还没有被执行 
    const {type, callAPI, payload} = await action
    // 没有异步请求直接返回action
    if (!callAPI) return next({type, payload})
    // 请求数据
    const res = await fetchProxy(callAPI)
    // 请求数据失败 提示
    if (res.status !== 200)  return console.log('网络错误！')
    // 请求成功 返回data
    return next({type, payload: res.data})
  }
  export default applyMiddleware(middleware)

```

  