import { LocalDining } from '@material-ui/icons'
import React from 'react'

class Loading extends React.Component{
    render(){
        return(
            <div style={{display: this.props.show? "flex": "none", justifyContent: "center"}}>
                <img src="/assets/loading.gif" height={70} width={70}/>
            </div>
        )
    }
}

export default Loading