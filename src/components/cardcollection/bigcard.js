import React from 'react';
import trash from '../images/trash.png'
import edit from '../images/edit.png'
import hero from '../images/heroshot.png'
import './card.css';


//-----------------------------------------------------------------------------

class BigCard extends React.Component{

handleCardExpand = () =>{
    console.log('card-handleCardExpand : memory.memid ' + this.props.memory.memid);
    
    this.props.onExpand(this.props.memory)
}

//-----------------------------------------------------------------------------

    render(){
        return (
            
            <div className='tc bg-near-white dib br5 ma3 bw3 mw5 shadow-5 pointer'>
                <img alt='memory' src={this.props.memory.fileurl} className='db br3 w-100 br--top'/>
                <div>
                    <h3>{this.props.memory.title}</h3>
                    <p className="f6 lh-copy measure mt2 mid-gray">{this.props.memory.description}</p>
                    <div className="flex justify-between">
                        <a className="link dim mb2 ml2 lh-title bw1">More</a>
                        <a className="link dim mb2 mr2 lh-title bw1" onClick={this.handleCardExpand} >[..]</a>

                    </div>
                    
                </div>
            </div>
        )
    }

}

export {BigCard};

