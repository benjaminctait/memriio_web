import React from 'react';
import './about.css'
import logo from "../images/memrii_landing.png";
import pageUp from "../images/scroll-up.png";
import TextCard from "../textcard/textCard"




class AboutPage extends React.Component{

state = {
  contentName:'mission',
  DOMisBuilt:false,
  missionPointsArray:null,

}

//------------------------------------------------------------------


render() {
  const {onRouteChange} = this.props
  let content = this.getContent()
  
  console.log('about render');
  return (
    <div id = 'about-page' className = 'AboutPage'>
      <div className = 'navLine'>
        <div className = 'upButton'>
          <img onClick={()=>onRouteChange('landing')} className = 'mainPageLink aboutImage' src = {pageUp} />
        </div>
        <div>
          <p onClick={()=>onRouteChange('signin')} className="mainPageLink ">Sign in</p>
          <p onClick={()=>onRouteChange('register')} className="mainPageLink ">Join up</p>
        </div>
       
      </div>

      <div id ='content-field' className= 'contentContainer'>
        {content}
      </div>

      <div className= 'bottomNavLine'>
          <p onClick={()=> this.setState({contentName:'mission' })}  className="mainPageLink ">Mission</p>
          <p onClick={()=> this.setState({contentName:'team'    })}  className="mainPageLink ">Team</p>
          <p onClick={()=> this.setState({contentName:'process' })}  className="mainPageLink ">Process</p>
          <p onClick={()=> this.setState({contentName:'contact' })}  className="mainPageLink ">Contact</p>
      </div>
    </div>
      
  )
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
  
  let p = this.state.missionPointsArray
  

  let style = {
    width:'100%',
    height:'100%'
  }
    if(this.state.DOMisBuilt){
      
      
      return (
      <div style ={style}>        
          <TextCard id ='A' top='12%' left='20%' text='Welcome to memrii' />
          <TextCard id ='B' top='28%' left='10%'  text='We are here to nurture knowledge.' />
          <TextCard id ='C' top='50%' left="20%"  text='We capture it, we craft it, we connect it all together' />    
          <TextCard id ='D' top='30%' left="55%"  text='We make it ultra-findable so it’s there when you it the most.' />        
          <TextCard id ='E' top='50%' left='60%'  text='At memrii we believe knowledge is treasure...' />
          <TextCard id ='F' top='65%' left='70%'  text='and the root of all future awesomeness.' />
          <canvas ref="canvas" width={2000} height={1000} top={0} left ={0}/>
      </div>
      )
    }else{
      return (
        <div  style ={style}>        
            <TextCard id ='A' top='12%' left='20%' text='Welcome to memrii' />
            <TextCard id ='B' top='28%' left='10%'  text='We are here to nurture knowledge.' />
            <TextCard id ='C' top='50%' left="20%"  text='We capture it, we craft it, we connect it all together' />    
            <TextCard id ='D' top='30%' left="55%"  text='We make it ultra-findable so it’s there when you it the most.' />        
            <TextCard id ='E' top='50%' left='60%'  text='At memrii we believe knowledge is treasure...' />
            <TextCard id ='F' top='65%' left='70%'  text='and the root of all future awesomeness.' />

        </div>

      )
    }
    
}

//------------------------------------------------------------------

renderTeam = () => {
  console.log('render team');
  return (
    <div className='missionTextBlock'>
        <p className='missionText'>
         <p>Team</p> 
         

        </p>

    </div>

    )
}

//------------------------------------------------------------------

renderProcess = () => {
  console.log('render process');
  return (
    <div className='missionTextBlock'>
        <p className='missionText'>
         <p>Process</p> 
         
        </p>

    </div>

    )
}

//------------------------------------------------------------------

renderContact = () => {
  console.log('render contact');
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
  
  let p =[]
  if(this.state.contentName = 'mission')
  {
    let welcome   = document.getElementById("A").getBoundingClientRect()
    let nurture   = document.getElementById("B").getBoundingClientRect()
    let capture   = document.getElementById("C").getBoundingClientRect()
    let findable  = document.getElementById("D").getBoundingClientRect()
    let treasure  = document.getElementById("E").getBoundingClientRect()
    let awesome   = document.getElementById("F").getBoundingClientRect()

        
    p.push( this.getPointFromRect('RIGHT_MID', welcome  ))
    p.push( this.getPointFromRect('RIGHT_MID', nurture  ))
    
    p.push( this.getPointFromRect('LEFT_MID',  nurture  ))
    p.push( this.getPointFromRect('LEFT_MID',  capture  ))

    p.push( this.getPointFromRect('RIGHT_MID', capture  ))
    p.push( this.getPointFromRect('LEFT_MID',  findable ))
  
    p.push( this.getPointFromRect('RIGHT_MID', findable ))
    p.push( this.getPointFromRect('RIGHT_MID', treasure ))

    p.push( this.getPointFromRect('LEFT_MID',  treasure ))
    p.push( this.getPointFromRect('LEFT_MID',  awesome  ))

    let container = document.getElementById('content-field').getBoundingClientRect()
    
    this.setState({ missionPointsArray:p, DOMisBuilt:true },()=>{
      
        this.canvas = document.querySelector('canvas');
        this.canvas.width = container.width
        this.canvas.height = container.height;
        this.canvas.top = container.top
        this.canvas.left = container.left
        let ctx = this.canvas.getContext('2d');
        let A = this.getPointFromRect('TOP_RIGHT',  capture  )
        let B = this.getPointFromRect('TOP_LEFT',  treasure  )

        ctx.moveTo(0, 0);
        ctx.lineTo(200, 100);
        ctx.lineTo(A.x , A.y)
        ctx.lineTo(B.x , B.y)


        ctx.stroke();

        let p1 = p[0]
        let p2 = p[1]
        
        ctx.beginPath()
        ctx.moveTo ( p1.x , p1.y )
        ctx.arcTo  ( (p1.x+50) , p1.y , (p2.x+50) , (p2.y+50) , 50 )
        ctx.stroke()
        
      })
    

    
    }
  
}

//------------------------------------------------------------------

getPointFromRect = ( pointType,rect, perim) =>{

  // x - horizontal
  // y -  vertical
  
  let rleft   =  rect.left - perim
  let rtop    =  rect.top - perim
  let rwidth  =  rect.width + ( perim * 2 )
  let rheight =  rect.height + ( perim * 2)

  let point = { x:0, y:0 }
  switch(pointType) {
    case 'TOP_MID':
      point.x = parseInt( rleft + ( rwidth / 2 ))
      point.y = parseInt( rtop )
      break;
    case 'LEFT_MID':
      point.x = parseInt( rleft ) 
      point.y = parseInt( rtop- ( rheight / 2 ))
      break;
    case 'BOTTOM_MID':
      point.x = parseInt( rleft + ( rwidth / 2 ))
      point.y = parseInt( rtop - rheight )
      break;
    case 'RIGHT_MID':
      point.x = parseInt( rleft + ( rwidth ))
      point.y = parseInt( rtop  - ( rheight / 2 ))
      break;

    case 'TOP_LEFT':
      point.x = parseInt( rleft )
      point.y = parseInt( rtop  )
      break;
    case 'BOTTOM_LEFT':
      point.x = parseInt( rleft )
      point.y = parseInt( rtop - ( rheight  ))
      break;
    case 'TOP_RIGHT':
      point.x = parseInt( rleft + ( rwidth ))
      point.y = parseInt( rtop )
    break;    
    case 'BOTTOM_RIGHT':
      point.x = parseInt( rleft + ( rwidth ))
      point.y = parseInt( rtop - ( rheight  ))
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