import React from 'react';
import './about.css'
import logo from "../images/memrii_landing.png";
import pageUp from "../images/scroll-up.png";
import TextCard from "../textcard/textCard"
import ImageCard from '../imagecard/imageCard'



class AboutPage extends React.Component{

state = {
  contentName:'mission',
  ctx:null
  
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
          <p onClick={()=> this.setState({contentName:'process' })}  className="mainPageLink ">Process</p>
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
        <TextCard id ='A' top='8%' left='30%' text='Welcome to memrii' />
        <TextCard id ='B' top='30%' left='15%'  text='We are here to nurture knowledge.' />
        <TextCard id ='C' top='73%' left="25%"  text='We capture it, we craft it, we connect it all together' />    
        <TextCard id ='D' top='30%' left="60%"   text='We make it ultra-findable so it’s there when you it the most.' />        
        <TextCard id ='E' top='53%' left='70%'  text='We believe knowledge is treasure and the root of all future awesomeness.' />
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
        <ImageCard id ='icA' heading = '' text='Team Page' />
        
    </div>
    )
   
}

//------------------------------------------------------------------

renderProcess = () => {
  console.log('render process');
  if(this.state.ctx) {
    this.state.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  }

  return (
    <div className='cardField' >        
      <TextCard id ='A' top='20%' left='40%' text='Process Page' />
    
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
         <p>Contact</p> 
         

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

componentDidUpdate =  ( prevState) => {

  let cn = this.state.contentName

  if(cn === 'mission' && cn !== prevState.contentName){
    this.drawMissionConnectors()
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
  let rheight =  rect.height  // 2x border width
  

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