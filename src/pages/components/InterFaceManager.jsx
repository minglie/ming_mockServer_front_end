import { createStore } from 'redux'
import {Table, Button,Tooltip,Input,Icon,Pagination}  from  'antd';
import React, { Component } from 'react';


M.host = "http://localhost:8889";

//app.begin((req,res)=>console.log(req.params))

app.post("/listByPage",function (req,res) {
    let whereCase="1=1 ";
    if(req.params.name){
        whereCase=whereCase+` and name like '%${req.params.name}%'`
    }
    const sql1=` 
    select * from sys_server_info  where ${whereCase}  limit  ${(req.params.startPage-1)*req.params.limit},${req.params.limit}`
   const sql2= `
        select count(1) c from sys_server_info  where ${whereCase};
    `;
    M.doSql(sql1, (d) => {
        let rows = d.data;
        M.doSql(sql2, (d) => {
            let total = d.data[0].c;
            res.send({rows,total});
        });
    })
});


app.post("/addOrUpdate",function (req,res) {
    let sql=""
    if(req.params.id){
        sql=M.Db().getUpdateObjSql("sys_server_info",req.params,{id:req.params.id})+";";
    }else {
        delete(req.params.id);
        sql=M.Db().getInsertObjSql("sys_server_info",req.params)+";";
    }
    M.doSql(sql,(d)=>{
        res.send(M.result(d));
    })
});





const maplist = (data) => {
    const databox = data.map((item) => {
        return Object.assign({}, item, {
            key: item.id
        })
    });
    return databox;
};

const model={
    reducer:(defaultState = {
        name: '',
        status: '2',
        Alldate: [],
        total: 0,
    },action)=>{
        switch(action.type) {
            case 'COM_ALLDATA' :
                const Alldate =maplist(action.dataAll);
                const total = action.total;
                return Object.assign({}, defaultState, {
                    Alldate: Alldate,
                    total: total
                });
        }
        return defaultState;
    },
    action:(dispatch)=> {
        return {
            Alldatas: (page) => {
                M.IO.listByPage(page).then((d)=>{
                    dispatch({
                        type: "COM_ALLDATA",
                        dataAll:d.rows,
                        total: d.total,
                    });

                })
            }
        }
    }
};

const store= createStore(
    model.reducer
);


class SearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            status: props.status,
        };
    }
    handleNumberChange = (e) => {
        const state = this.state;
        state.name=e.target.value;
        this.setState(state);
        this.props.father.searchData(state)
    }
    render() {
        const state = this.state;
        return (
            <span>
                <Input
                    type="text"
                    placeholder="name"
                    value={state.name}
                    onChange={this.handleNumberChange}
                    style={{ width: '30%', marginRight: '3%' }}
                />
      </span>
        );
    }
}


class InterFaceManager extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'id',
                dataIndex: 'id',
                key: 'id',
                width: '5%',
                render: text => <a href="#"> { text } </a>
            },
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                width: '8%',
            },
            {
                title: '路径',
                dataIndex: 'path',
                key: 'path',
                width: '8%',
            },
            {
                title: '请求方法',
                dataIndex: 'method',
                key: 'method',
                width: '8%',
            },
            {
                title: '响应类型',
                dataIndex: 'resultType',
                key: 'resultType',
                width: '8%',
            },
            {
                title: '函数',
                dataIndex: 'functionBody',
                key: 'functionBody',
                width: '40%',
            }
        ];
        this.columns.push({
            title: '操作',
            key: 'operation',
            align: "center",
            render: (text, record) => {
                return <div>
                    <Tooltip title="编辑">
                        <Icon type="edit" onClick={this.edit.bind(this,record)}/>
                    </Tooltip>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Tooltip title="删除">
                        <Icon type="delete" onClick={this.delete.bind(this,record)}/>
                    </Tooltip>
                </div>;
            }
        });

        window.m_this=this;

        this.m_props= model.action(store.dispatch);
        this.state={
            Alldate:[],
            visible:false,
            total: 0,
            name:'',
            status:'2',
            startPage:1,
            limit:10
        };

    }
    componentDidMount() {
        let current=1;
        let pageSize=10;
        this.m_props.Alldatas(
            {
                startPage: current,
                limit: pageSize,
                name:this.state.name,
                status:this.state.status
            }
        );
    };

    componentWillMount () {
        store.subscribe(()=>{this.setState(store.getState())});
    }

    componentWillUnmount(){
        this.setState = (state, callback) => {
            return
     }}


    searchData(d){
        const state = this.state;
        state.name=d.name;
        state.status=d.status;
        this.m_props.Alldatas(this.state);
    }

    deleteAll(d){
        M.doSql("delete from sys_server_info",()=>{});
        M.fetchGet("/sys_server_info/reload",(d)=>{console.log(d)})
        m_this.m_props.Alldatas(this.state);
    }

    reloadInterface(d){
        M.fetchGet("/sys_server_info/reload",(d)=>{if(d.success){antd.message.success("ok")}else{antd.message.error("ng")}})
    }


    add(){
        let functionBody=M.json_template;
        M.setAttribute("cur_sys_server_info",{id:"",name:"",path:"",method :1,resultType:2,functionBody:functionBody,language:"json"})
        m_this.props.history.push("/A_1")
    }

    edit(r){
        r.method=r.method=="get"?1:2;
        r.language=r.resultType;
        r.resultType=r.resultType=="javascript"?1:2;
        M.setAttribute("cur_sys_server_info",{id:r.id,name:r.name,path:r.path,method :r.method,resultType:r.resultType,functionBody:r.functionBody,language:r.language})
        m_this.props.history.push("/A_1")
    }

    delete(r){
        M.doSql(`delete from sys_server_info where id=${r.id};`,()=>{});
        M.fetchGet("/sys_server_info/reload",(d)=>{if(d.success){antd.message.success("ok")}else{antd.message.error("ng")}})
        m_this.m_props.Alldatas(this.state);
    }

    onChange(current, pageSize) {
        const state = this.state;
        state.startPage=current;
        state.limit=pageSize;
        m_this.m_props.Alldatas(this.state);
    }

    render() {
        return (
            <div>
                <SearchInput name={this.state.name} status={this.state.status} father={this}/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={this.deleteAll.bind(this)}>清空接口</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={this.add.bind(this)}>添加接口</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={this.reloadInterface.bind(this)}>重新加载接口</Button>
                <Table dataSource={this.state.Alldate} columns={this.columns} pagination={false} />
                <br/>
                <Pagination
                    showSizeChanger showQuickJumper
                    defaultCurrent={1}
                    total={this.state.total}
                    onChange={this.onChange.bind(this)}
                    onShowSizeChange={this.onChange.bind(this)}
                    pageSizeOptions={["5","10","20"]}
                />
            </div>
        )
    }
}



export default InterFaceManager;









