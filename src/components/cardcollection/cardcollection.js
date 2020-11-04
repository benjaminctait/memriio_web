import React from 'react';
import {BaseCard,ShortCard} from './card'
import {BigCard} from './bigcard'
import MemoryModal from '../memorymodal/memorymodal'
import Masonry from 'react-masonry-component';
import * as mem from '../memriioserver'

import './cardcollection.css'


class CardCollection extends React.Component{

    constructor(props){
        super(props)        
        this.state={
            memories:props.memories,
            activeUser:props.userid,
            layoutcount:0
        }
    }
    
    state={
        memories:null,
        activeUser:null,
        showMemoryModal:false,
        activeMemory:null,    
    }

componentDidUpdate = (prevProps,prevState) =>{
    if( prevProps.memories !== this.props.memories){
        if(this.props.memories) console.log('cardcollection : component update ' + this.props.memories.length);
        this.setState({memories:this.props.memories})
    }
}

//-------------------------------------------------------------------------------

onEditMemory = (memory) => {
    this.props.onEditMemory(memory)    
}

//-------------------------------------------------------------------------------

onShowModal = (memory,memfiles) => {
        this.state.activeMemory = memory
        this.state.memfiles = memfiles
        this.setState({showMemoryModal:!this.state.showMemoryModal})
        
    }
//-------------------------------------------------------------------------------

onDeleteMemory = (memory) =>{
    let newmem = []
    mem.deleteMemory(memory.memid)
    this.state.memories.map( mem => {
        if(mem.memid !== memory.memid) newmem.push(mem)
    })
    this.setState( { memories : newmem } )

}

//-------------------------------------------------------------------------------

onCardClick = (memid) =>{

console.log('cardCollection.card clicked - memid : ' + memid);

}

//-------------------------------------------------------------------------------

    
    render(){
        if(Array.isArray(this.state.memories)){
            console.log('CarCollection-render : memory count : ' + this.state.memories.length);
            
            return (
            <div className='bigContainer'>
                <div id="container" >
                    <div class={'col-right-0'} id="col1"></div>
                        <div class="col" id="col2">
                        
                            <Masonry                                
                                ref={function(c) {this.masonry = this.masonry || c.masonry;}.bind(this)} 
                                >                          
                                {  this.state.memories.map(memory => {
                                    
                                    let ukey = 'memcard' + memory.memid                                    
                                    if(memory.cardtype === 0){
                                        return (
                                            <BaseCard
                                                key={ukey} 
                                                memory={memory}
                                                onEdit = {this.onEditMemory}
                                                onShowModal = {this.onShowModal}
                                                onCardClick = {this.onCardClick}
                                                />)
                                    }else if (memory.cardtype === 1){
                                        return (
                                            <ShortCard
                                                key={ukey} 
                                                memory={memory}
                                                onEdit = {this.onEditMemory}
                                                onShowModal = {this.onShowModal}
                                                onCardClick = {this.onCardClick}
                                            />)
                                    }else if (memory.cardtype === 2){
                                        return (
                                            <BigCard
                                                key={ukey} 
                                                memory={memory}
                                                onEdit = {this.onEditMemory}
                                                onShowModal = {this.onShowModal}
                                                onCardClick = {this.onCardClick}
                                            />)
                                    }  
                                    })                                   
                                }                             
                            </Masonry>       
                               
                    </div>
                    <div class='col-right-0' id="col3"></div>
                </div>
                <MemoryModal 
                    key             = { 'memmodal' + 42             }
                    activeUserid    = { this.state.activeUser       }
                    memory          = { this.state.activeMemory     }
                    memfiles        = { this.state.memfiles         }
                    show            = { this.state.showMemoryModal  }
                    onHideModal     = { this.onShowModal            }
                    onDeleteMemory  = { this.onDeleteMemory         }     
                > 
                </MemoryModal>           
            </div>        
                    
                
            )
        }else{
            return (
                <div> 
                    No memories Found
                </div>
            )
        }   
    }


}


export default CardCollection; 

  





