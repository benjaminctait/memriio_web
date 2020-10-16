
import React from 'react';
import trash from '../images/trash.png'
import edit from '../images/edit.png'
import hero from '../images/heroshot.png'
import MemoryFileViewer from '../memoryviewer/memoryImageViewer'
import * as mem from '../memriioserver'
import './card.css';


//-----------------------------------------------------------------------------


class BaseCard extends React.Component{

state = {
    memfiles:null,
    viewState:0
}

//------------------------------------------------------------------------------

handleEditCard = () =>{
    
    this.props.onEdit(this.props.memory)
}

//-----------------------------------------------------------------------------

handleMoreClick =() =>{

    this.props.onShowModal(this.props.memory,this.state.memfiles)
    
}

handleClick = (e) =>{
    
    this.props.onCardClick(this.props.memory.memid)
}
//-----------------------------------------------------------------------------

getHeroFile = () => {
    let hero = this.state.memfiles[0]    
    this.state.memfiles.map(memfile => {
        if(memfile.ishero){           
            hero = memfile
        }
    })
    return hero
}

//-----------------------------------------------------------------------------

loadFiles = (memfiles) => {
    let newMemFiles = []
    memfiles.forEach(memfile => {
       
        if(memfile.fileext == 'mp4'){
            let parts = memfile.thumburl.split('/')
            let fname = parts[parts.length-2]+ '/' + parts[parts.length-1]
            console.log('base card : loadFiles : ' + fname );
            mem.getDownloadSignedurl(fname).then( surl => 
                {
                    console.log('base card : loadFiles memfile.thumbnail : ' + surl );
                    memfile.thumburl = surl
                })
        }
        newMemFiles.push(memfile)
    }) 
    this.setState({memfiles:newMemFiles})
}

//-----------------------------------------------------------------------------

componentDidMount =  () => {
    
    mem.getAllMemoryFiles(this.props.memory.memid,this.loadFiles)
}

//-----------------------------------------------------------------------------

renderFileVIew = () => {
    if(this.state.memfiles){
        let memf = this.getHeroFile()
        return (
            <div className = {'imageContainer'}>
                <MemoryFileViewer 
                    memfile={memf}
                    thumbStyleClass={'Xbasecardimg'}
                    fileStyleClass={'Xbasecardimg'}
                />
            </div>
        )
    }
}

//-----------------------------------------------------------------------------

    render(){
        const fileview = this.renderFileVIew()
            return (
                <div className='basecard'
                    id={'memcard'+this.props.memory.memid}
                    onClick={this.handleClick}
                >
                {fileview}
                <div>
                    <h3 className="mb2 mt2 ">{this.props.memory.title}</h3>
                    <p className="f6 lh-copy measure mt2 mid-gray">{
                            mem.shrinkCardDescription(this.props.memory.description)
                        }</p>
                    <div className="controlBox">
                        <a className="link grow dim controlFont " onClick={this.handleMoreClick  } >More</a>
                    </div>
                </div>
            </div>
            )
    }

}


//-----------------------------------------------------------------------------

class ShortCard extends React.Component{


    state = {
        memfiles:null
    }
    //-----------------------------------------------------------------------------

getHeroFile = () => {
    let hero = this.state.memfiles[0]
    
    this.state.memfiles.map(memfile => {
        if(memfile.ishero){
            
            hero = memfile
        }
    })
    return hero
}

//-----------------------------------------------------------------------------

loadFiles = (memfiles) => {

    let newMemFiles = []
    memfiles.forEach(memfile => {
       
        if(memfile.fileext == 'mp4'){
            let parts = memfile.thumburl.split('/')
            let fname = parts[parts.length-2]+ '/' + parts[parts.length-1]
            console.log('base card : loadFiles : ' + fname );
            mem.getDownloadSignedurl(fname).then( surl => 
                {
                    console.log('base card : loadFiles memfile.thumbnail : ' + surl );
                    memfile.thumburl = surl
                })
        }
        newMemFiles.push(memfile)
    }) 
    this.setState({memfiles:newMemFiles})
}

//-----------------------------------------------------------------------------

componentDidMount =  () => {
    console.log('didload : ');
    mem.getAllMemoryFiles(this.props.memory.memid,this.loadFiles)
}

handleEditCard = () =>{
    this.props.onEdit(this.props.memory)
}

//-----------------------------------------------------------------------------

handleMoreClick =() =>{
    this.props.onShowModal(this.props.memory,this.state.memfiles)
    
}

//-----------------------------------------------------------------------------

renderFileVIew = () => {
    if(this.state.memfiles){
        let memf = this.getHeroFile()
        return (
            <div className = {'shortcardimg'}>
                <MemoryFileViewer 
                    memfile={memf}
                    thumbStyleClass={'Xbasecardimg'}
                    fileStyleClass={'Xbasecardimg'}
                />
            </div>
        )
    }
}

//-----------------------------------------------------------------------------

    render(){
        let fileview = this.renderFileVIew()
        return (
            
            <div className='shortcard '
                onClick={this.props.onClick}
            >
                <p className="f6 lh-copy measure mt2 middlecenter white i">{this.props.memory.description}</p>
                {fileview}
                
                <div className="controlBox">
                    
                    <a className="link dim controlFont" onClick={this.handleMoreClick  }>More</a>
                    
                    <div className='controlBackground'></div>
                </div>
            </div>
        )
    }

}

//-----------------------------------------------------------------------------
//  NEW CARD CLASS
//
//-----------------------------------------------------------------------------

class MemoryImage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            fileurl:props.fileurl,
            fileext: props.fileext,
            index:props.index,
        }
        console.log('MemoryImage constructor : key' + this.props.index);
        
        
    }
    state={
        fileurl:null,
        index:0,
    }

//-----------------------------------------------------------------------------

handleClick = () =>{
    console.log('image clicked')
    
}

//-----------------------------------------------------------------------------

handleMakeHero = () =>{
    console.log('MemoryCard: handleMakeHero :' + this.props.memfile.fileurl)
    this.props.setAsHero(this.props.memfile)
    
}

//-----------------------------------------------------------------------------

handleEditImage = () =>{
    console.log('edit image index :' + this.props.memfile.fileurl)
    
}

//-----------------------------------------------------------------------------

handleDeleteImage = () =>{
    console.log('delete image index :' + this.props.memfile.fileurl)
    this.props.deleteImage(this.props.memfile)
    
}

//-----------------------------------------------------------------------------

renderEditControls = () => {
    return(

        <div className='bottomcenter self-center: center'>
            <img 
                className = 'dib ma4 grow-large' 
                src={hero} alt="x" 
                height="30" 
                width="30"
                onClick={this.handleMakeHero}
            ></img>
            <img 
                className = 'dib ma4 grow-large' 
                src={edit} 
                alt="x" 
                height="30" 
                width="30"
                onClick={this.handleEditImage}
            ></img>
            <img  className = 'dib ma4 grow-large' 
                src={trash} 
                alt="x" 
                height="30" 
                width="30"
                onClick={this.handleDeleteImage}
            ></img>
        </div>
    )
}
//-----------------------------------------------------------------------------

    render(){
        const controls = this.renderEditControls()
        return (
        
            <div className='ma3 bg-black shadow-5 pointer '>
                <img alt='memory' src={this.props.memfile.fileurl} className='vh-75 mvh75'/>''
                {controls}
                
            </div>
        )
    }

}

//-----------------------------------------------------------------------------

export {BaseCard,MemoryImage,ShortCard};

