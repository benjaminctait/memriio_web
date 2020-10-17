import React from 'react';
import trash from '../images/trash.png'
import edit from '../images/edit.png'
import hero from '../images/heroshot.png'
import MemoryFileViewer from '../memoryviewer/memoryImageViewer'
import * as mem from '../memriioserver'

import './bigcard.css';


//-----------------------------------------------------------------------------

class BigCard extends React.Component{

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
                <div className = {'bigCardImageContainer'}>
                    <MemoryFileViewer 
                        memfile={memf}
                        thumbStyleClass={'bigcardimg'}
                        fileStyleClass={'bigcardimg'}
                    />
                </div>
            )
        }
    }
    
    //-----------------------------------------------------------------------------
    
        render(){
            const fileview = this.renderFileVIew()
                return (
                    <div className='bigcard'
                        id={'memcard'+this.props.memory.memid}
                        onClick={this.handleClick}
                    >

                    {fileview}
                    
                    <div>
                        
                        
                        <div className="controlBox">
                            <a className="link grow dim controlFont " onClick={this.handleMoreClick  } >More</a>
                        </div>
                    </div>
                </div>
                )
        }
    
    }
export {BigCard};

