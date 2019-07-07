import {Button,Radio,Switch,message} from "antd";
import React from 'react';

class LogManager extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            text:"A",
            filePath:"database.log",
            M_log_req_params_enable:false,
            Db_display_sql_enable:false
        };
        M.LogManager_this=this;
    }
    cleanText(){
        M.LogManager_this.setState({text:""});
        M.fetchGet("/log/clean?filePath="+M.LogManager_this.state.filePath,
            (d)=>{if(d.success){
                message.success("ok")}else{message.error("ng")
            }}
        )
    }

    onChangeFilePath(e){
        M.is_json=false;
        if(e.target.value.endsWith("json")){
            M.is_json=true;
        }
        fetch(M.host+"/"+e.target.value, {
            method: 'GET',
            mode: 'cors'}
        ).then((r)=>{return r.text()}).then((text)=> {
            if(M.is_json==true){
                text=JSON.parse(text)
                text=JSON.stringify(text,null, 2)
            }
            M.LogManager_this.setState({text:text, filePath: e.target.value});}
        ).catch((error) => {
            console.error(error)
        });
    }
    componentDidMount(){
        fetch(M.host+"/database.log", {
            method: 'GET',
            mode: 'cors'}
        ).then((r)=>{return r.text()}).then((text)=> {
            M.fetchGet("/log/get_log_enable_status",
                (d)=>{if(d.success){
                    let sta= Object.assign(d.data,{text:text})
                    //console.log(sta,"lllllllllllll")
                    M.LogManager_this.setState(sta);
                }}
            )
        }).catch((error) => {
            console.error(error)
        });
    }

    databaseLogChange(checked){
        M.fetchGet("/log/set_log_enable_status",
            (d)=>{if(d.success){
                message.success(checked+" ok")
                M.LogManager_this.setState({Db_display_sql_enable: checked});
            }else{message.error("ng")

            }},{
                type:'Db_display_sql_enable',
                value:checked
            }
        )
    }
    reqParamsLogChange(checked){
        M.fetchGet("/log/set_log_enable_status",
            (d)=>{if(d.success){
                message.success(checked+" ok")
                M.LogManager_this.setState({M_log_req_params_enable: checked});
            }else{message.error("ng")

            }},{
                type:'M_log_req_params_enable',
                value:checked
            }
        )
    }

    render(){
        return (
            <div>
                <Button onClick={this.cleanText} style={{margin:"20px"}}>清空</Button>
                <Radio.Group onChange={this.onChangeFilePath} value={this.state.filePath} >
                    <Switch checked={this.state.Db_display_sql_enable} onChange={this.databaseLogChange} />
                    <Radio   value="database.log">SQL日志</Radio>
                    <Switch  checked={this.state.M_log_req_params_enable} onChange={this.reqParamsLogChange} />
                    <Radio value="M.log">用户日志</Radio>
                    <Radio value="M_database.json">JSON文件型数据库</Radio>
                    <Radio value="M_map.json">全局作用域</Radio>
                </Radio.Group>
                <hr/>
                <pre style={{backgroundColor:"black", color:"green"}}>
                    {this.state.text}
                </pre>
            </div>

        )}
}




export default LogManager;
