
import React from 'react';
class ConsoleDisPlay extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            text:"connect..."
        };
        M.ConsoleDisPlay_this=this;
    }
 
    componentDidMount(){
      
        M.ConsoleDisPlay_this.SSEServer= M.EventSource(M.host+"/sseServer",function(e){

           let text=  M.ConsoleDisPlay_this.state.text+e.data+"\n";

           M.ConsoleDisPlay_this.setState({text:text})
           
         })
    
    }


    componentWillUnmount(){
        M.ConsoleDisPlay_this.SSEServer.close()
     }


    render(){
        return (
            <div>
                <pre style={{backgroundColor:"black", color:"green"}}>
                    {this.state.text}
                </pre>
            </div>

        )}
}




export default ConsoleDisPlay;
