import React from 'react';
import videoPlayImg from '../images/dottedcircleplay.png'
import videoStopImg from '../images/dottedcircleStop.png'
import ReactPlayer from 'react-player';
import './memoryImageViewer.css';


class MemoryFileViewer extends React.Component{

    state = {
        videoPlaying:false,
        fileType:'empty',        // 'image' or 'video' or 'audio' or 'specific' or 'empty'
        videoLoaded:false,

    }


//-----------------------------------------------------------------------------

handleClick = () =>{
    console.log('image clicked')
    
}

//-----------------------------------------------------------------------------

stopVideo = () => {
    this.setState({videoPlaying:false})
    
}
//-----------------------------------------------------------------------------

playVideo = () => {
    this.setState({videoPlaying:true})
}

//-----------------------------------------------------------------------------

determineFileCategory = (memfile) => {

    if(memfile){
        if(this.isVideo(memfile.fileext)){
            return 'video'
        }else{
            if(this.isImage(memfile.fileext)){
                return 'image'
            }else{
                if(this.isAudio(memfile.fileext)){
                    return 'audio'
                }else{
                    return 'specific'
                }
            }
        }
    }else{
        return 'empty'
    }
}

//-----------------------------------------------------------------------------

isImage= (fileExtension) =>{
    let ext = fileExtension.toLowerCase()
    let filetypes = ['jpeg','jpg','png']
    let found = filetypes.indexOf(ext)
    return !(found === -1)    
}

//-----------------------------------------------------------------------------

isVideo= (fileExtension) =>{

    let ext = fileExtension.toLowerCase()
    let filetypes = ['mp4','mov','m3u8']
    let found = filetypes.indexOf(fileExtension)
    return !(found === -1)    
}
//-----------------------------------------------------------------------------

isAudio= (fileExtension) =>{

    let ext = fileExtension.toLowerCase()
    let filetypes = ['m4a','wav']
    let found = filetypes.indexOf(fileExtension)
    return !(found === -1)    
}
//-----------------------------------------------------------------------------

renderControls = () => {
    if(this.props.memfile)
    {
        if(this.state.fileType === 'video')
        {
            if(this.state.videoPlaying)
            {
                return(
                    <div className='buttonPosition'>
                        <img 
                            alt=        'Play'
                            src=        { videoStopImg} 
                            className=  { 'card-playBtn' }
                            onClick =   { this.stopVideo }
                        />  
                    </div>
                )

            }else{
                return(
                    <div className='buttonPosition'>
                        <img 
                            alt=        'Play'
                            src=        { videoPlayImg} 
                            className=  { 'card-playBtn' }
                            onClick =   { this.playVideo }
                        />  
                    </div>
                )
            }
            
        }
    }
}

//-----------------------------------------------------------------------------

renderOriginalFile = () => {
    return(

        <div className=''>
            
        </div>
    )
}
//-----------------------------------------------------------------------------

renderImageThumb = () => {
    return (
        
            <img 
                alt=         'memory'
                src=        { this.props.memfile.thumburl } 
                className=  { this.props.thumbStyleClass }
            />  
           
   
    )
}
handleVideoReady = () => {
    console.log('video loaded');
}
//-----------------------------------------------------------------------------

renderVideo = () =>{
    

    return (
        <div className='player-wrapper'>
            <ReactPlayer
            className   =   "react-player"
            url         =   { this.props.memfile.thumburl}
            ref         =   { player => (this.player = player)}
            playing     =    { this.state.videoPlaying }
            width       =   '100%'
            
            />
      </div>
  )
}

//-----------------------------------------------------------------------------

render(){
    const {memfile,alternateRenderer} = this.props
    this.state.fileType = this.determineFileCategory(memfile)
    let visibleContent = null

    const controls = this.renderControls()
    const thumb = memfile? memfile.thumburl : null        

    if(alternateRenderer) { 
        return ( alternateRenderer() )
    } else {
        if(this.state.fileType === 'image') {
            
            visibleContent = this.renderImageThumb()}
        else if (this.state.fileType === 'video'){
            
            visibleContent = this.renderVideo() 
        }else{
            visibleContent = null
        }
    
        return (
            <div className='xover'>
                {visibleContent}
                {controls}
            </div>
        )
        
    }
}

};

//-----------------------------------------------------------------------------

export default MemoryFileViewer

