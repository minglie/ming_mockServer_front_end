import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';



class CodeModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
        functionBody: props.functionBody,
        language: props.language,
        newFunctionBody:""
    }  
    M.CodeModel_this=this;
  }


  getValue() {
    return  M.CodeModel_this.newFunctionBody
  }

  onChange(newValue, e) {
    M.CodeModel_this.newFunctionBody=newValue;
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
        this.state.language=nextProps.language
        this.state.functionBody=nextProps.functionBody
        //console.log('componentWillUpdate',nextProps, nextState, nextContext,this.props)
     // console.log(nextProps,M.CodeModel_this.refs.Ming_MonacoEditor)
    }

  render() {
    const options = {
      selectOnLineNumbers: true,
      renderSideBySide: false,
      automaticLayout:true,
      minimap: {
        enabled:false
    }
    };
    return (
      <div >
          <MonacoEditor ref="Ming_MonacoEditor"
            width="800"
            height="600"
            language={this.state.language}
            theme="vs-dark"
            value={this.state.functionBody}
            onChange={this.onChange}
            options={options}
          />
     </div>
    
    );
  }
}

export default CodeModel;