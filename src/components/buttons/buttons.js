import React from 'react';
import Xsymbol from '../images/x-symbol.png'
import './buttons.css'

export class SubTag extends React.Component{

    render(){
        const{text,tagKey} = this.props
        return(
            
            <div className='float-left inline-flex ba ma1 pa1 br3 b--blue bg-near-white '>
                <span className='dib f6'>{text}</span>                
                <img 
                    className = 'dib ma1 pointer' 
                    src={Xsymbol} 
                    alt="X" 
                    height="15" 
                    width="15"
                    
                    onClick={this.props.onClick}
                ></img>
                    

            </div>
        )
    }
}

//------------------------------------------------------------------------------------------

export class CheckBox extends React.Component{

    state ={
        up:false,
        down:false,        
    }
    
    onClick = () =>{
        
        let newState = !this.state.up
        if(this.state.up){this.setState({up:false,down:true})}
        else {this.setState({up:true,down:false})}        
       
        if(this.props.onClick) this.props.onClick(this.props.itemKey,newState)

    }

    componentDidMount = () => {
        this.setState({up:this.props.upState})
    }

    render(){
        const{downImg,upImg,upState,label} = this.props
        let source = null
        if(upState) source = upImg
        else source = downImg        

        return(
            <div className='di pointer' >
                <img className='checkbox' src={source} onClick={ this.onClick}></img> 
                <text className='checkboxLabel'>{label}</text>
                
            </div>
        )
    }
}

//------------------------------------------------------------------------------------------

export class ImageLabel extends React.Component{

    state={
        isblured:false
        
    }
    
    handleBlur       = () => {if(this.state.isblured    )    this.setState({isblured:false })}
    handleFocus      = () => {if(!this.state.isblured   )    this.setState({ isblured:true })}
    handleBadgeClick = () => {if(this.props.onBadgeClick)   {this.props.onBadgeClick(this.props.data)}}

    onLabelClick    = (evnt) => {
        if(this.props.onClick){
            console.log('imagelabel onclick ' + evnt.target);
            this.props.onClick(evnt ,this.props.data)
        }
    }
        

    render(){
        const{leftImg,label,badge} = this.props
        let showBadge = null
        let leftHandImage = null
        
        if(badge ){ 
            showBadge = <img 
                className='rightBadge' 
                src={badge} 
                onClick = {this.handleBadgeClick} 
                ></img>
        }
        if(leftImg){
            leftHandImage = <img className='ImageLabelImage' src={leftImg}></img>
        }else{
            leftHandImage = <div className='ImageLabelImage dib' />
        }
        
        return(
            
            <div 
                className   = 'ImageLabel'
                key         = {'dog'} 
                onClick     = { e =>this.onLabelClick(e)} 
                onMouseOut  = { this.handleBlur} 
                onMouseOver = { this.handleFocus}>
                
                {leftHandImage}
                <text className='checkboxLabel' >{label}</text>   
                {showBadge}  
            </div>
        )  
    }
}

//------------------------------------------------------------------------------------------

export class CloudLabel extends React.Component{

    state={
        isblured:false,
        isClicked:false
    }

    
    handleBlur       = () => {if(this.state.isblured) this.setState({isblured:false })}
    handleFocus      = () => {if(!this.state.isblured) this.setState({ isblured:true })}
    handleBadgeClick = () => {if(this.props.onBadgeClick){this.props.onBadgeClick(this.props.data)}}
    onClick          = () => {if(this.props.onClick){this.props.onClick(this.props.data)}}
        


    render(){
        const{leftImg,label,badge} = this.props
        let showBadge = null
        
        if(badge ){ 
            showBadge = <img 
                className='rightBadge' 
                src={badge} 
                onClick = {this.handleBadgeClick} 
                ></img>
        }
        
        return(
            
            <div 
                className='CloudLabel'
                key={'dog'} 
                onClick={this.onClick} 
                onMouseOut = {this.handleBlur} 
                onMouseOver = {this.handleFocus}>
                
                <img className='cloudLogo' src={leftImg}></img>
                <text className='cloudText' >{label}</text>   
                {showBadge}  
            </div>
        )  
    }
}

//------------------------------------------------------------------------------------------

export class IButton extends React.Component{

    onClick = () =>{        
        //this.props.onClick()
    }

    render(){
        const{img,title} = this.props
        return(
            <div className='di pointer' onClick={this.onClick} >
                <img className='ImageLabelImage'src={img}></img>                         
            </div>
        )  
    }
}

//------------------------------------------------------------------------------------------
