import React from 'react'
import logo from "../images/memrii_landing.png"
import './signin.css'


class Signin extends React.Component {

    constructor(props){
        super(props);
        this.state={
            signInEmail: '',
            signInPassword: ''
        }
    }

    onEmailChange = (event) => {
        this.setState({signInEmail: event.target.value})
    }

    onPasswordChange = (event) => {
        this.setState({signInPassword: event.target.value})
    }

    onSubmitSignIn = () => {
        fetch('https://memrii-api.herokuapp.com/signin', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({
                    email:this.state.signInEmail,
                    password: this.state.signInPassword
                })
            })
                .then(response => response.json())
                .then(user => {
                                    
                 if(user.userid){
                    console.log('signin.onSubmitSignIn ', user); 
                    this.props.loadUser(user)
                    this.props.setCloudsLoaded(false)
                    this.props.onRouteChange('home')
                 }else{
                    this.setState({signInEmail:'',signInPassword:''})   
                 }
             })
        }
    
    render() {
        const {onRouteChange} = this.props
        return (
            <div className='signupPage'>
            <img src={logo} className='homelogo' onClick = {()=>this.props.onRouteChange('landing')}/>
            <article className="section">
                <main className="pa2 black-80">
                    <div className="measure center">
                        <fieldset id="sign_up" className="ba b--transparent ph10 mh0">
                        <legend className="f4 fw6 ph0 mh0">Sign In</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input 
                                value= {this.state.signInEmail}
                                onChange={this.onEmailChange}
                                className="pa2 input-reset ba bg-transparent hover-bg-grey hover-black w-100" 
                                type="email" 
                                name="email-address"  
                                id="email-address" />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input 
                                value={this.state.signInPassword}
                                onChange={this.onPasswordChange}
                                className="b pa2 input-reset ba bg-transparent hover-bg-grey hover-black w-100" 
                                type="password" 
                                name="password"  
                                id="password"/>
                        </div>
                        <label className="pa0 ma0 lh-copy f6 pointer"><input type="checkbox"/> Remember me </label>
                        </fieldset>
                        <div className="">
                        <input 
                            onClick={this.onSubmitSignIn}
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                            type="submit" 
                            value="Sign in"/>
                        </div>
                        <div className="lh-copy mt3">
                        <p onClick={()=>onRouteChange('register')} className="f6 link grow pointer dim black db">Register</p>
                        
                        </div>
                    </div>
                </main>
            </article>
        </div>
        )
    }
}

export default Signin