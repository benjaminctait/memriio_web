import React from 'react';
import './about.css'
import logo from "../images/memrii_landing.png";
import pageUp from "../images/scroll-up.png";


class AboutPage extends React.Component{

state = {
  contentName:'mission'
}


render() {
  const {onRouteChange} = this.props
  let content = this.getContent()
  return (
    <div className = 'AboutPage'>
      <div className = 'navLine'>
        <div className = 'upButton'>
          <img onClick={()=>onRouteChange('landing')} className = 'mainPageLink aboutImage' src = {pageUp} />
        </div>
        <div>
          <p onClick={()=>onRouteChange('signin')} className="mainPageLink ">Sign in</p>
          <p onClick={()=>onRouteChange('register')} className="mainPageLink ">Join up</p>
        </div>
       
      </div>

      <div className= 'contentContainer'>
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

getContent = () => {
  let ctype = this.state.contentName
  console.log(ctype);
  if      ( ctype === 'mission')  {return this.renderMission()}
  else if ( ctype === 'team')     {return this.renderTeam()}
  else if ( ctype === 'process')  {return this.renderProcess()}
  else if ( ctype === 'contact')  {return this.renderContact()}
}

renderMission = () => {
  console.log('render mission');
  return (
    <div className='missionTextBlock'>
        <p className='missionText'>
         <p>Welcome to memrii</p> 
         <br/>
         <p>We are here to nurture knowledge.</p> 
         <br/>
         <p>We capture it, we craft it, we connect it all together,</p> 
         <p>and we make it ultra-findable</p> 
         <p>so it’s there when you it the most.</p> 
         <br/>
         <p>  At memrii we believe knowledge is treasure, </p> 
         <p> and the root of all future awesomeness.</p> 

        </p>

    </div>

    )
}

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

}
export default AboutPage