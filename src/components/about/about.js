import React from 'react';
import './about.css'


import pageUp       from "../images/scroll-up.png";

import mission      from '../images/mission.png'
import process      from '../images/process.png'
import capture      from '../images/capture.png'
import craftA       from '../images/craftA.png'
import craftB       from '../images/craftB.png'
import softConnect  from '../images/soft-connect.png'
import hardConnect  from '../images/hard-connect.png'
import measureA     from '../images/measureA.png'
import measureB     from '../images/measureB.png'
import measureC     from '../images/measureC.png'
import team         from '../images/team.png'

class AboutPage extends React.Component{

state = {
  contentName:'mission',
  subContent:'process',
 
}

//------------------------------------------------------------------


render() {
  let content = this.getContent()
  const {changeRoute} = this.props
  console.log('render : ',this.state.contentName,this.state.subContent);

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
       
      </div>

      <div className= 'bottomNavLine'>
          <p onClick={()=> this.setState({contentName:'mission' })}  className="mainPageLink ">Mission</p>
          <p onClick={()=> this.setState({contentName:'process', subContent :'process'})}  className="mainPageLink ">Process</p>
          <p onClick={()=> this.setState({contentName:'team'    })}  className="mainPageLink ">Team</p>          
          <p onClick={()=> this.setState({contentName:'contact' })}  className="mainPageLink ">Contact</p>
      </div>
    </div>
      
  )
}

//------------------------------------------------------------------
changeRoute =(route) =>{
  this.props.onRouteChange(route)
}

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
  
  return (
    <div className='cardField' >   
        <img className='capture-bg ' src = {mission}/>

        
        <div>
        <p className= 'proButton rightScreenClick '
              onClick={()=>{this.setState({contentName:'process',subContent:'process'})}}  
              >{">"}
        </p>
        </div>
       
    </div>

    )
    
}

//------------------------------------------------------------------

renderTeam = () => {
  return (
    <div className='cardField' >   
        <img className='connect-bg' src = {team}/>        
        
        <p  className=' proButton leftScreenClick'
       onClick={()=>{this.setState({contentName:'process',subContent:'measureC'})}} 
        > { '<' }</p>

        <p  className=' proButton rightScreenClick'
        onClick={()=>{this.setState({contentName:'contact'})}}    
        > { '>' }</p>
       
    </div>
  )
   
}

//------------------------------------------------------------------

renderProcess = () => {
  
  let processContent = null
  if(this.state.subContent === 'process'        ) processContent = this.renderProcessDescription()
  if(this.state.subContent === 'capture'        ) processContent = this.renderCapture()

  if(this.state.subContent === 'craftPhone'     ) processContent = this.renderCraftPhone()
  if(this.state.subContent === 'craftContext'   ) processContent = this.renderCraftContext()

  if(this.state.subContent === 'connectSoft'    ) processContent = this.renderConnectSoft()
  if(this.state.subContent === 'connectHard'    ) processContent = this.renderConnectHard()
  if(this.state.subContent === 'measureA'       ) processContent = this.renderMeasureA()
  if(this.state.subContent === 'measureB'       ) processContent = this.renderMeasureB()
  if(this.state.subContent === 'measureC'       ) processContent = this.renderMeasureC()
   
  
  
  return ( processContent )
}

//------------------------------------------------------------------

renderProcessDescription = () =>{
  
  return (
    <div className='cardField' >   
        <img className='capture-bg ' src = {process}/>
        
        <div>
        <p className= 'proButton rightScreenClick '
              onClick={()=>this.setState({subContent:'capture'}) }
              >{">"}
        </p>
        </div>
       
    </div>

    )

}
//------------------------------------------------------------------

renderCapture = () =>{

  
    return (
      <div className='cardField' >  
        <img className='capture-bg ' src = {capture}/>
        
          <p  className=' proButton leftScreenClick'
              onClick={()=>{this.setState({subContent:'process'})}}    
          > { '<' }</p>
  
          <p  className=' proButton rightScreenClick'
              onClick={()=>{this.setState({subContent:'craftPhone'})}}    
          > { '>' }</p>
  
        </div>
      
    )

}
//------------------------------------------------------------------

renderCraftPhone = () => {
  return (
    <div className='cardField' >  
      <img className='capture-bg ' src = {craftA}/>
      
      <p  className=' proButton leftScreenClick'
            onClick={()=>{this.setState({subContent:'capture'})}}    
        > { '<' }</p>

        <p  className=' proButton rightScreenClick'
            onClick={()=>{this.setState({subContent:'craftContext'})}}    
        > { '>' }</p>
      </div>
    
  )
}

//------------------------------------------------------------------

renderCraftContext = () =>{
  

  return (
    <div className='cardField' >  
      <img className='capture-bg ' src = {craftB}/>
      
        <p  className=' proButton leftScreenClick'
            onClick={()=>{this.setState({subContent:'craftPhone'})}}    
        > { '<' }</p>

        <p  className=' proButton rightScreenClick'
            onClick={()=>{this.setState({subContent:'connectSoft'})}}    
        > { '>' }</p>

      </div>
    
  )
}

//------------------------------------------------------------------

renderConnectSoft = () =>{

  return (

    <div className='cardField' >   
        <img className='connect-bg' src = {softConnect}/>
        
        <p  className=' proButton leftScreenClick'
          onClick={()=>{this.setState({subContent:'craftContext'})}}    
      > { '<' }</p>

      <p  className=' proButton rightScreenClick'
          onClick={()=>{this.setState({subContent:'connectHard'})}}    
      > { '>' }</p>
       
    </div>

    
  )
}

//------------------------------------------------------------------

renderConnectHard = () =>{
  
  return (
    <div className='cardField' >   
        <img className='connect-bg' src = {hardConnect}/>
        
        <p  className=' proButton leftScreenClick'
        onClick={()=>{this.setState({subContent:'connectSoft'})}}    
        > { '<' }</p>

        <p  className=' proButton rightScreenClick'
        onClick={()=>{this.setState({subContent:'measureA'})}}    
        > { '>' }</p>
       
    </div>
  )
}



//------------------------------------------------------------------
renderMeasureA = () =>{

  return (
    <div className='cardField' >   
        <img className='connect-bg' src = {measureA}/>
        
        
        <p  className=' proButton leftScreenClick'
        onClick={()=>{this.setState({subContent:'connectHard'})}}    
        > { '<' }</p>

        <p  className=' proButton rightScreenClick'
        onClick={()=>{this.setState({subContent:'measureB'})}}    
        > { '>' }</p>
       
    </div>
  )
}

//------------------------------------------------------------------
renderMeasureB = () =>{

  return (
    <div className='cardField' >   
        <img className='connect-bg' src = {measureB}/>
        
        <p  className=' proButton leftScreenClick'
        onClick={()=>{this.setState({subContent:'measureA'})}}    
        > { '<' }</p>

        <p  className=' proButton rightScreenClick'
        onClick={()=>{this.setState({subContent:'measureC'})}}    
        > { '>' }</p>
       
    </div>
  )
}

//------------------------------------------------------------------
renderMeasureC = () =>{

  return (
    <div className='cardField' >   
        <img className='connect-bg' src = {measureC}/>
        
        <p  className=' proButton leftScreenClick'
        onClick={()=>{this.setState({subContent:'measureB'})}}    
        > { '<' }</p>

        <p  className=' proButton rightScreenClick'
        onClick={()=>{this.setState({contentName:'team'})}}    
        > { '>' }</p>
       
    </div>
  )
}
//------------------------------------------------------------------
renderContact = () => {
  console.log('render contact');
  
  return (
    <div className='cardField' >   
        <img className='capture-bg' src = {null}/>
        <a className='mailTo' href="mailto:info@memrii.io">info@memrii.io</a>  
        
        <div>
        <p className= 'proButton leftScreenClick'
              onClick={()=>{this.setState({contentName:'team'})}}  
              >{"<"}
        </p>
        </div>
    </div>
    )
  }

}
export default AboutPage