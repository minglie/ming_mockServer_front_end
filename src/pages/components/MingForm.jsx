import antd,{Button ,Radio} from  "antd";
import React from 'react';
import CodeModel from "./CodeModel.jsx";

class MingForm extends React.Component {
    constructor(props) {
        super(props);
       // console.log(M.getAttribute("cur_sys_server_info"))
        this.state =M.getAttribute("cur_sys_server_info");
        M.MingForm0_this=this;
    }
    onChangeResultType(e){
        let language="json";
        let functionBody=M.json_template;
        if(e.target.value==1){
            language="javascript";
            functionBody=M.javascript_template;
        }
        M.MingForm0_this.setState({
            resultType: e.target.value,
            language:language,
            functionBody:functionBody
        });
    }

    onChangeMethod(e){
        M.MingForm0_this.state.method=e.target.value;
    }
    onCommit(e){

       const  M_editor= M.MingForm0_this.refs.M_editor;
        let reqParams={
            id: M.MingForm0_this.state.id,
            name:M.MingForm0_this.refs.inputName.value,
            path:M.MingForm0_this.refs.inputPath.value,
            method:(M.MingForm0_this.state.method==1?"get":"post"),
            resultType:(M.MingForm0_this.state.resultType==1?"javascript":"json"),
            functionBody:M_editor.getValue()
        }
        let reqUrl="";
        if(reqParams.id){
            reqUrl="/sys_server_info/update"
        }else{
            reqUrl="/sys_server_info/add"
        }
        M.fetchPost(reqUrl,(r)=>{
            if(r.success){
                if(e=="test"){
                    antd.message.success("ok")
                }else{
                    M.MingForm0_this.props.history.push("/A")
                }
               
            }else {
                antd.message.error(r.data)
            }
        },reqParams)
    }

    render() {
        return (
            <div>
                接口描述&nbsp;&nbsp;
                <input ref="inputName" defaultValue={this.state.name} style={{width:"10%",marginLeft:"10px",marginRight:"10px"}}/>
                接口地址&nbsp;&nbsp;
                <input ref="inputPath" defaultValue={this.state.path} style={{width:"30%",marginLeft:"10px",marginRight:"10px"}}/>
                请求方法&nbsp;&nbsp;
                <Radio.Group onChange={this.onChangeMethod} defaultValue={this.state.method}>
                    <Radio value={1}>GET</Radio>
                    <Radio value={2}>POST</Radio>
                </Radio.Group>
                响应类型 &nbsp;&nbsp;&nbsp;&nbsp;
                <Radio.Group onChange={this.onChangeResultType} value={this.state.resultType}>
                    <Radio value={1}>javascript</Radio>
                    <Radio value={2}>json</Radio>
                </Radio.Group>
                <br/><br/>
                <Button type="primary"  onClick={this.onCommit}>
                    确定
                </Button>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;

                <Button type="primary"  onClick={()=>this.onCommit("test")}>
                    测试
                </Button>
                <br/><br/><hr/>
                <CodeModel ref="M_editor" language={this.state.language} functionBody={this.state.functionBody}/>
            </div>
        );
    }
}



export default MingForm;