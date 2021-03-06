import React from 'react';

import './textCard.css'



class TextCard extends React.Component{

render(){
 
  const {id,text,top,left,width}  = this.props
  let mystyle = {
      top:top,
      left:left,
      maxWidth:width,
      minWidth:width
    } 
  
    return (
      <div id={id} className='textCard' style={mystyle} >
        <p className='textarea'>{text}</p>
        
      </div>
    )
}

//---------------------------------------------------------------


}
export default TextCard