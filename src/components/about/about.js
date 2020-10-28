import React from 'react';
import './about.css'

import iphone       from '../images/appCapture.png'
import laptop       from '../images/laptop.png'
import pageUp       from "../images/scroll-up.png";
import craft        from '../images/craft.png'
import softConnect  from '../images/soft-connect.png'
import hardConnect  from '../images/hard-connect.png'

import TextCard from "../textcard/textCard"
import ImageCard from '../imagecard/imageCard'




class AboutPage extends React.Component{

state = {
  contentName:'mission',
  ctx:null,
  viewProcess:'process',
  connectView:'soft',
  
}

//------------------------------------------------------------------


render() {
  let content = this.getContent()
  

  return (
    <div id = 'about-page' className = 'AboutPage'>
      
      <div className = 'navLine'>
        <div className = 'upButton'>
          <img onClick={ ()=> this.changeRoute('landing')} className = 'mainPageLink aboutImage' src = {pageUp} />

        </div>
        <div>
          <p onClick={()=> this.changeRoute('signin')} className="mainPageLink ">Sign in</p>
          <p onClick={()=> this.changeRoute('register')} className="mainPageLink ">Join up</p>
        </div>
       
      </div>

      <div id ='content-field' className= 'contentContainer'>
        {content}
        <canvas ref="canvas" className='canvas'/>
      </div>

      <div className= 'bottomNavLine'>
          <p onClick={()=> this.setState({contentName:'mission' })}  className="mainPageLink ">Mission</p>
          <p onClick={()=> this.setState({contentName:'process',viewProcess:'process' })}  className="mainPageLink ">Process</p>
          <p onClick={()=> this.setState({contentName:'team'    })}  className="mainPageLink ">Team</p>
          
          <p onClick={()=> this.setState({contentName:'contact' })}  className="mainPageLink ">Contact</p>
      </div>
    </div>
      
  )
}

//------------------------------------------------------------------



changeRoute = ( route ) =>{
  const {onRouteChange} = this.props
  window.removeEventListener('resize', this.drawMissionConnectors )
  onRouteChange(route)
  
}

//------------------------------------------------------------------

getContent = () => {
  let ctype = this.state.contentName
  console.log(ctype);
  if      ( ctype === 'mission')  {return this.renderMission()}
  else if ( ctype === 'team')     {return this.renderTeam()}
  else if ( ctype === 'process')  {return this.renderProcess()}
  else if ( ctype === 'contact')  {return this.renderContact()}
}

//------------------------------------------------------------------

renderMission = () => {
  
  
  if(this.state.ctx) {
    this.state.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  return (
    <div className='cardField' >    

        <TextCard id ='A' top='8%' left='30%' width={350} text='Welcome to memrii' />
        <TextCard id ='B' top='30%' left='15%' width={350}   text='We are here to nurture knowledge.' />
        <TextCard id ='C' top='73%' left="25%" width={350} text='We capture it, we craft it, we connect it all together' />    
        <TextCard id ='D' top='30%' left="60%" width={350}  text='We make it ultra-findable so it’s there when you it the most.' />        
        <TextCard id ='E' top='53%' left='70%' width={350} text='We believe knowledge is treasure and the root of all future awesomeness.' />
    </div>
    )
    
}

//------------------------------------------------------------------

renderTeam = () => {
  console.log('render team');
  if(this.state.ctx) {
    this.state.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
  }

  return (
    <div className='cardField' >        
        
    </div>
    )
   
}

//------------------------------------------------------------------

renderProcess = () => {
  console.log('render process : ',this.state.viewProcess);
  let processContent = null
  if(this.state.viewProcess === 'process') processContent = this.renderProcessDescription()
  if(this.state.viewProcess === 'capture') processContent = this.renderProcessCapture()
  if(this.state.viewProcess === 'craft') processContent = this.renderProcessCraft()
  if(this.state.viewProcess === 'connect') processContent = this.renderProcessConnect()
  if(this.state.viewProcess === 'measure') processContent = this.renderProcessMeasure()
   
  
  if(this.state.ctx) {
    this.state.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
   
  }

  return (
    <div className='cardField' >     
      <div className='process' >
        <div className='processBox ' style={{textAlign : 'center'}}>
          <p className= 'processLabel '
              onClick={()=>this.setState({viewProcess:'capture'}) }>Capture </p>
          <p className= 'processLabel '
              onClick={()=>this.setState({viewProcess:'craft'}) }>Craft </p>
          <p className= 'processLabel '
              onClick={()=>this.setState({viewProcess:'connect'}) }>Connect </p>
          <p className= 'processLabel '
              onClick={()=>this.setState({viewProcess:'measure'}) }>Measure </p>
           
        </div>
        
        <div className='processImageBox ' >
          {processContent}
        </div>
       
      </div>
    </div>

    )
}

//------------------------------------------------------------------

renderProcessCapture = () =>{
  return (
      <div style={{height:'100%', display:'flex',flexDirection:'row',justifyContent:'left'}}>
        <div className='outerBox'>
          <div className= 'processDescription' style={{marginRight:'30px'}}>
            <p >Our mobile App allows you to capture knowledge in a range of ways  
              then package it up into a memory</p>
            <p >A single memory can contain any combination of media types and any number of files</p>
            
          </div>
          <div className='processLinkLine'>

              <p  className='mainPageLink processLink'
                  onClick={()=>{this.setState({captureView:'mobile'})}}    
              > { '< Mobile' }</p>

              <p  className='mainPageLink processLink'
                  onClick={()=>{this.setState({captureView:'web'})}}    
              > { 'Web Based >' }</p>

          </div>  
        </div>
        <div style={{alignSelf:'center'}}>
          <img src={iphone} style={{ width:'70%'}}/>
        </div>
      </div>
        

 

    )

}

//------------------------------------------------------------------

renderProcessDescription = () =>{
  return (
    <div style={{height:'100%', display:'flex',flexDirection:'row',justifyContent:'left'}}>
      <div className= 'processDescription '>
        <p > You're busy at work. </p>
        <p >Capturing organisational knowledge is a time consuming 
           and  distracting.</p>  

        <p >We aim to make capturing knowledge easy.</p>

        <p >Just click and send, We'll do the rest</p>
        
        
      </div>

    </div>

 

    )

}
//------------------------------------------------------------------

renderProcessCraft = () =>{
  return (
    <div style={{height:'100%', display:'flex',flexDirection:'row',justifyContent:'left'}}>
        <div className= 'processDescription' style={{marginRight:'30px'}}>
            <p >A quick phone call with one of our memory editors gives us enough to
              create a succinct but crafted story about each memory</p>
          
            <p >From this process we generate a rich array of metadata that
              gives each memory context.  
            </p>

            <p >The quality of your organisation's knowledge base depends heavily on context  
            </p>
            <div className='processLinkLine'>

              <p  className='mainPageLink processLink'
                  onClick={()=>{this.setState({craftView:'phone'})}}    
              > { '< Discovery' }</p>

              <p  className='mainPageLink processLink'
                  onClick={()=>{this.setState({craftView:'metadaa'})}}    
              > { 'Editorial >' }</p>

            </div>  

        </div> 

        

        <div style={{alignSelf:'center'}}>
          <img src={craft} style={{ width:'50%'}}/>
        </div> 
      </div>
    )
}

//------------------------------------------------------------------

renderProcessConnect = () =>{

  let textContent = <div>
                      <p> Although memroies are associated through their metadata, its sometimes important 
                        to explicityly link two or more memories together.  </p>

                      <p >To do this in memrri a user may create 'memory chains' linking memories together 
                        in a sequence    
                      </p>
                    </div>
  let imgSrc = softConnect

  if(this.state.connectView === 'hard'){
    textContent = <div>
                    <p> lINE ABOPUIT HARD connections  </p>

                    <p >other line   
                    </p>
                  </div>
  imgSrc = hardConnect 
  }
  

  return (
    <div style={{height:'100%', display:'flex',flexDirection:'row',justifyContent:'left'}}>
        <div className= 'processDescription' style={{marginRight:'30px'}}>
          
          {textContent}

          <div className='processLinkLine'>

            <p  className='mainPageLink processLink'
                onClick={()=>{this.setState({connectView:'soft'})}}    
            > { '< Context Based ' }</p>

            <p  className='mainPageLink processLink'
                onClick={()=>{this.setState({connectView:'hard'})}}    
            > { 'Memory Chain >' }</p>

          </div>
        </div>

        <div style={{alignSelf:'center'}}>
          <img src={imgSrc} style={{ width:'85%'}}/>
        </div> 
        
      </div>
    )
}

//------------------------------------------------------------------

renderProcessMeasure = () =>{
  return (
    <div style={{height:'100%', display:'flex',flexDirection:'row',justifyContent:'left'}}>

      <div className= 'processDescription' style={{marginRight:'30px'}}>
          <p>Finally, its critical to measure the value of knowledge 
            in terms that are meaningfull to the organisation </p>
        
          <p >Weather its straight up profit 
            or other metrics like safety or cultural engagement, the memrii system
            can be configured as needed
          </p>

          <div className='processLinkLine'>

            <p  className='mainPageLink processLink'
                onClick={()=>{this.setState({measureView:'points'})}}    
            > { '< Points System' }</p>

            <p  className='mainPageLink processLink'
                onClick={()=>{this.setState({measureView:'value'})}}    
            > { 'Value Report >' }</p>

          </div>
      </div>

      
        <img src={craft} style={{maxWidth:'25%',marginTop:'20px'}}/>
        
      </div>
    )
}

//------------------------------------------------------------------
renderContact = () => {
  console.log('render contact');
  if(this.state.ctx) {
    this.state.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  return (
    <div className='missionTextBlock'>
        <p className='missionText'>
        
         

        </p>

    </div>

    )
}

//------------------------------------------------------------------

componentDidMount =() =>{
  
  if(this.state.contentName = 'mission'){
    this.drawMissionConnectors()
    window.addEventListener('resize', this.drawMissionConnectors);
  }
}
//------------------------------------------------------------------

componentDidUpdate = (prevProps,prevState ) => {

  let cn = this.state.contentName
  let pcn = prevState.contentName
  

  if( cn !== pcn ){

    if(pcn === 'mission'){
      window.removeEventListener('resize', this.drawMissionConnectors )
    }
    
    if(cn === 'mission' ){
      window.addEventListener('resize', this.drawMissionConnectors);
      this.drawMissionConnectors()
    }

    // if(pcn === 'process'){
    //   window.removeEventListener('resize', this.drawProcessConnectors )
    // }
    
    // if(cn === 'process' ){
    //   window.addEventListener('resize', this.drawProcessConnectors);
    //   this.drawProcessConnectors()
    // }

  }
}

//------------------------------------------------------------------

drawMissionConnectors = () =>{

  let p =[]

    let welcome   = document.getElementById("A").getBoundingClientRect()
    let nurture   = document.getElementById("B").getBoundingClientRect()
    let capture   = document.getElementById("C").getBoundingClientRect()
    let findable  = document.getElementById("D").getBoundingClientRect()
    let treasure  = document.getElementById("E").getBoundingClientRect()
    

    
    p.push( this.getPointFromRect('BOTTOM_MID', welcome  ))
    p.push( this.getPointFromRect('TOP_MID',    nurture  ))
    p.push( this.getPointFromRect('BOTTOM_MID', nurture  ))
    p.push( this.getPointFromRect('TOP_MID',    capture  ))
    p.push( this.getPointFromRect('RIGHT_MID',  capture  ))
    p.push( this.getPointFromRect('LEFT_MID',   findable ))
    p.push( this.getPointFromRect('BOTTOM_MID', findable ))
    p.push( this.getPointFromRect('TOP_MID',    treasure ))
    
    

    let container       = document.getElementById('content-field').getBoundingClientRect()
    this.canvas         = document.querySelector('canvas');
    this.canvas.width   = container.width
    this.canvas.height  = container.height;
    this.canvas.top     = container.top
    this.canvas.left    = container.left
    this.state.ctx      = this.canvas.getContext('2d');
    
    this.state.ctx.beginPath()
    this.state.ctx.strokeStyle = 'darkgrey'
    this.state.ctx.lineWidth = 2
    this.state.ctx.moveTo(p[0].x, p[0].y);
    this.state.ctx.lineTo(p[1].x, p[1].y)
    this.state.ctx.moveTo(p[2].x, p[2].y)
    this.state.ctx.lineTo(p[3].x, p[3].y)
    this.state.ctx.moveTo(p[4].x, p[4].y)
    this.state.ctx.lineTo(p[5].x, p[5].y)
    this.state.ctx.moveTo(p[6].x, p[6].y)
    this.state.ctx.lineTo(p[7].x, p[7].y)
    this.state.ctx.stroke();

    
    p.forEach(pnt => {
      this.filledCircle( this.state.ctx,pnt,10,'#8bb7f0','black')
    });
    
}

//------------------------------------------------------------------

drawProcessConnectors = () =>{

  let p =[]

    let iphone    = document.getElementById("iphone").getBoundingClientRect()
    let laptop    = document.getElementById("laptop").getBoundingClientRect()
    let captureLabel    = document.getElementById("process-capture").getBoundingClientRect()
    let phoneWoman    = document.getElementById("memriiGirl").getBoundingClientRect()
    let phoneMan    = document.getElementById("workerGuy").getBoundingClientRect()
    
    
    p.push( this.getPointFromRect('RIGHT_MID', iphone ))
    p.push( this.getPointFromRect('TOP_MID', laptop ))
    p.push( this.getPointFromRect('LEFT_MID', captureLabel ))
    p.push( this.getPointFromRect('RIGHT_MID', captureLabel )) // 3
    p.push( this.getPointFromRect('BOTTOM_MID', phoneMan ) ) // 4
    p.push( this.getPointFromRect('TOP_MID', phoneWoman )) // 5
    p.push( this.getPointFromRect('RIGHT_MID', phoneWoman )) // 6



    let container       = document.getElementById('content-field').getBoundingClientRect()
    this.canvas         = document.querySelector('canvas');
    this.canvas.width   = container.width
    this.canvas.height  = container.height;
    this.canvas.top     = container.top
    this.canvas.left    = container.left
    this.state.ctx      = this.canvas.getContext('2d');

    this.state.ctx.beginPath()
    this.state.ctx.strokeStyle = 'darkgrey'
    this.state.ctx.lineWidth = 3
    this.state.ctx.moveTo(p[0].x, p[0].y);
    this.state.ctx.lineTo(p[2].x, p[2].y)
    this.state.ctx.moveTo(p[1].x, p[1].y)
    this.state.ctx.lineTo(p[2].x, p[2].y)
    
    this.state.ctx.moveTo(p[3].x, p[3].y)
    this.state.ctx.lineTo(p[4].x, p[4].y)
    this.state.ctx.moveTo(p[4].x, p[4].y)
    this.state.ctx.lineTo(p[5].x, p[5].y)
    this.state.ctx.moveTo(p[5].x, p[5].y)
    this.state.ctx.lineTo(p[3].x, p[3].y)
   
    


    this.state.ctx.stroke();
    
    p.forEach(pnt => {     
      this.filledCircle( this.state.ctx,pnt,10,'#8bb7f0','black')
    });

}

//------------------------------------------------------------------

filledCircle = (context,centrePoint,radius,fillColor,strokeColor) =>{
  let p = centrePoint
  context.fillStyle = fillColor
  context.strokeStyle = strokeColor
  context.moveTo( p.x, p.y)
  context.arc   ( p.x, p.y, radius , 0 , 360 ) 
  context.fill()
}

//------------------------------------------------------------------

getPointFromRect = ( pointType,rect ) =>{

  // x - horizontal
  // y -  vertical
  
  let rleft   =  rect.left 
  let rtop    =  rect.top - 78  // 78 us the height of the nav bar
  let rwidth  =  rect.width 
  let rheight =  rect.height  
  console.log('RIGHT_MID ',rtop,parseInt( rtop  + ( rheight / 2 )),rheight );

  let point = { x:0, y:0 }
  switch(pointType) {
    case 'TOP_MID':
      point.x = parseInt( rleft + ( rwidth / 2 ))
      point.y = parseInt( rtop )
      break;
    case 'LEFT_MID':
      point.x = parseInt( rleft ) 
      point.y = parseInt( rtop + ( rheight / 2 ))
      break;
    case 'BOTTOM_MID':
      point.x = parseInt( rleft + ( rwidth / 2 ))
      point.y = parseInt( rtop + rheight )
      break;
    case 'RIGHT_MID':
      point.x = parseInt( rleft + ( rwidth ))
      point.y = parseInt( rtop  + ( rheight / 2 ))
      break;

    case 'TOP_LEFT':
      point.x = parseInt( rleft  )
      point.y = parseInt( rtop  )
      break;
    case 'BOTTOM_LEFT':
      point.x = parseInt( rleft )
      point.y = parseInt( rtop + ( rheight  ))
      break;
    case 'TOP_RIGHT':
      point.x = parseInt( rleft + ( rwidth ))
      point.y = parseInt( rtop )
    break;    
    case 'BOTTOM_RIGHT':
      point.x = parseInt( rleft + ( rwidth ))
      point.y = parseInt( rtop + ( rheight  ))
    break;

    default:
      point.x = 0
      point.y = 0
  }
  return point
}

//------------------------------------------------------------------

}

export default AboutPage