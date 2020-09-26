import React from 'react';
import tag from '../images/tag.png'
import cloudImg from '../images/cloud.png'
import './dropsearch.css'

import {ImageLabel, CloudLabel} from '../buttons/buttons'
import SelectDropDown from 'react-dropdown-select'


//-------------------------------------------------------------------

export function peopleDropSearch ( cRect, people ,callBack){
 
  let peoplesNames = people.map((person,idx) => {
      return {value : idx, label: (person.firstname + ' ' + person.lastname)}})

  let cStyle = null
  if(cRect){
    cStyle = { position:'fixed', top:cRect.y, width:cRect.width}
  }

  return (
    
    <div style = {cStyle} >
      <SelectDropDown 
          
          placeholder   = '+ add'
          options       = { peoplesNames } 
          searchable    = { true }
          closeOnSelect = { true }
          clearOnSelect = { true }
          
          //------------

          onChange = { 
              items => {
              
                let index = items[0].value
                if(callBack) callBack(people[index])
              }
            }

          //------------

          itemRenderer = {({ item, itemIndex, props, state, methods }) => (
              
            <ImageLabel 
              
              key={'i' + itemIndex} 
              onClick={() => methods.addItem(item)} 
              leftImg = {tag}
              label = {item.label}
            />
          )}
          
      />
    </div>
  )
}

//-------------------------------------------------------------------

export function cloudDropSearch ( cRect , clouds , selected , showmulti , keepInList , callBack , userid ){
  userid = userid || 0
  
  let cloudnames = clouds.map((cloud,idx) => {
      return {value : cloud.id, label: cloud.name}})
  
  let selectedValues = selected
  
  let cStyle = null
  if(cRect){
    cStyle = { position:'fixed', top:cRect.y, width:cRect.width}
  }
  
  return (
  
  <div style = {cStyle} >

    <SelectDropDown 
        placeholder         = '+ add'
        values              = { selectedValues }
        multi               = { showmulti } 
        keepSelectedInList  = { keepInList}
        options             = { cloudnames } 
        searchable          = { true }
        closeOnSelect       = { true }
        clearOnSelect       = { true }
        
        //------------

        onChange = { 
            items => {
              console.log('selectDrop : ' + JSON.stringify(items));
              if(callBack) callBack(items,userid)
          }
        }
       
        //------------

        itemRenderer = {({ item, itemIndex, props, state, methods }) => (
            
          <div className = 'wordListItem'>
            <ImageLabel 
              
              key={'i' + itemIndex} 
              onClick={() => methods.addItem(item)} 
              leftImg = {cloudImg}
              label = {item.label}
            />
          </div>
        )}
        
    />
  </div>
  )
}

//-------------------------------------------------------------------
