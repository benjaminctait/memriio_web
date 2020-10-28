import React from 'react';

import './imageCard.css'

class ImageCard extends React.Component{

render(){
 
  const {id,top,left,imgSrc,width}  = this.props

  

  let boxstyle = {
      top:top,
      left:left,    
    } 
  let imgStyle ={
    maxWidth:width,
    minWidth:width,
  }

  
    return (
      <div  id={id} className='imageCard' style={boxstyle} >
        <img  src={imgSrc} className='imagearea' style={imgStyle}/>
      </div>
    )
}

//---------------------------------------------------------------


}
export default ImageCard