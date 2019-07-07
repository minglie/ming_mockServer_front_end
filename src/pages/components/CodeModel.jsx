import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';



class CodeModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
        functionBody: props.functionBody,
        language: props.language
    }  
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
          <MonacoEditor
            width="800"
            height="600"
            language={this.state.language}
            theme="vs-dark"
            value={this.state.functionBody}
            options={options}
          />
     </div>
    
    );
  }
}

export default CodeModel;