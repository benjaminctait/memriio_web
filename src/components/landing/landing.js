import React from 'react';
import './landing.css'
import logo from "../images/memrii_landing.png"
import pageDown from "../images/scroll-down.png";


class LandingPage extends React.Component{


render() {
  const {onRouteChange} = this.props
  return (
    <div className = 'landingContainer'>
      <div className = 'navLine'>
        <p onClick={()=>onRouteChange('signin')} className="mainPageLink ">Sign in</p>
        <p onClick={()=>onRouteChange('register')} className="mainPageLink ">Join up</p>
      </div>

      <div className= 'mainImageContainer'>
        <img className = 'landingImage' src = {logo} />
        
      </div>

      <div className = 'aboutAP'>
        <img onClick={()=>onRouteChange('about')} className = 'mainPageLink ' src = {pageDown} />
       
      </div>
      
      
    </div>
      
  )
}

}
export default LandingPage