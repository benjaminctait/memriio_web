import React from 'react';
import './landing.css'
import logo from "../images/memrii_landing.jpg";


class LandingPage extends React.Component{

state = {
  showabout:false
}  

showAbout = () =>{

}

render() {
  const {onRouteChange} = this.props
  return (
    <div className = 'landingContainer'>
      <div>
        <p onClick={()=>onRouteChange('signin')} className="mainPageLink signinAP">Sign in</p>
        <p onClick={this.showAbout} className="mainPageLink joinupAP">About Us</p>
        <p onClick={()=>onRouteChange('register')} className="mainPageLink joinupAP">Join up</p>
      </div>

      <div >
        <img className = 'landingImage' src = {logo} />
      </div>

     
      
      
    </div>
      
  )
}

}
export default LandingPage