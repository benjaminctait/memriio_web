import React from 'react';
import Compressor from 'compressorjs'
import { unstable_batchedUpdates } from 'react-dom';
import { format } from "date-fns";
import { array } from 'prop-types';
import { cloudDropSearch } from './dropsearch/dropsearch';


//-------------------------------------------------------------------------------

function memriiolog(log,data) {
    if(log) console.log(data)       
}

//-------------------------------------------------------------------------------

export function getMemories_User_Words_Clouds  (userid,words,cloudids)  { 

    return new Promise((resolve,reject) =>{
        fetch('https://memrii-api.herokuapp.com/get_memories_userid_keywords_cloudids', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({
                    words:words,
                    userid:userid,
                    cloudids:cloudids
                })
            })
            .then(response => response.json())
            .then(res => {
                if ( res.success ){
                    resolve(res.data)  
                }else{
                    reject(res.error)
                }
            })
    })
}

//-------------------------------------------------------------------------------

export function getMemories_User_Clouds ( userid,cloudids)  {  

    console.log('getMemories_User_Clouds - userid : ' + userid + ' cloudids : ' + cloudids);

    return new Promise((resolve,reject)=>{
        fetch('https://memrii-api.herokuapp.com/get_memories_userid_cloudids', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({
                    userid:userid,
                    cloudids:cloudids
                })
            })
            .then(response => response.json())
            .then(res => {
                if ( res.success ){
                    resolve(res.data)  
                }else{
                    reject(res.error)
                }
            })
    })
}

//-------------------------------------------------------------------------------

export function getMemories_Clouds ( cloudids)  {  

    console.log('getMemories_Clouds - cloudids : ' + cloudids);

    return new Promise((resolve,reject)=>{
        fetch('https://memrii-api.herokuapp.com/get_memories_cloudids', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({
                    cloudids:cloudids
                })
            })
            .then(response => response.json())
            .then(res => {
                if ( res.success ){
                    resolve(res.data)  
                }else{
                    reject(res.error)
                }
            })
    })
}

//-------------------------------------------------------------------------------

export function getMemories_Words_Clouds ( cloudids,words)  {  

    console.log('getMemories_Words_Clouds - cloudids : ' + cloudids);

    return new Promise((resolve,reject)=>{
        fetch('https://memrii-api.herokuapp.com/get_memories_keywords_clouds', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({
                    cloudids:cloudids,
                    words:words
                })
            })
            .then(response => response.json())
            .then(res => {
                if ( res.success ){
                    resolve(res.data)  
                }else{
                    reject(res.error)
                }
            })
    })
}

//-------------------------------------------------------------------------------

export function getMemories_PersonalOnly_All (userid,searchwords) {
    
    console.log('getMemories_PersonalOnly_All - userid : ' + userid + ' searchwords : ' + searchwords);
  
    
    if(isNonEmptyArray(searchwords)){

        console.log('getMemories_PersonalOnly_All - with searchwords')
        return new Promise((resolve,reject)=>{
            fetch('https://memrii-api.herokuapp.com/get_memories_keywords_user_noclouds', {
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body:JSON.stringify({
                        userid:userid,
                        words:searchwords
                    })
                })
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        resolve(res.data)  
                    }else{
                        reject(res.error)
                    }
                })
        })

    }else{
        console.log('getMemories_PersonalOnly_All - no searchwords')
        return new Promise((resolve,reject)=>{
            fetch('https://memrii-api.herokuapp.com/get_memories_userid_noclouds', {
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body:JSON.stringify({
                        userid:userid,
                    })
                })
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        console.log('getMemories_PersonalOnly_All returns ' + res.data.length )
                        resolve(res.data)  
                    }else{
                        reject(res.error)
                    }
                })
        })

    }  

}
//-------------------------------------------------------------------------------

export function getMemories_PersonalOnly_Unshared (userid,searchwords)  {  

    if(searchwords){
        return new Promise((resolve,reject)=>{
            fetch('https://memrii-api.herokuapp.com/get_memories_userid_keywords_noclouds_unshared', {
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body:JSON.stringify({
                        userid:userid,
                        words:searchwords
                    })
                })
                
                .then(res => {
                    if ( res.success ){
                        resolve(res.data)  
                    }else{
                        reject(res.error)
                    }
                })
        })

    }else{
        return new Promise((resolve,reject)=>{
            fetch('https://memrii-api.herokuapp.com/get_memories_userid_noclouds_unshared', {
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body:JSON.stringify({
                        userid:userid,
                    })
                })
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        resolve(res.data)  
                    }else{
                        reject(res.error)
                    }
                })
        })

    }  

}
//-------------------------------------------------------------------------------


//--Returns and array of of images and related meta data from the server-----------------------------------------------

export function getAllMemoryFiles  (memoryid,callback) {
   
    memriiolog(false,'Memriio.getAllMemoryFiles : memoryid ' + memoryid )

    
    fetch('https://memrii-api.herokuapp.com/get_memfiles_memoryid', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({memoryid:memoryid})})
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        memriiolog(false,('server response : ' + res.success))
                        memriiolog(false,('server data : ' + JSON.stringify(res.data)))
                        callback(res.data)
                    }else{
                        memriiolog(false,('server response : ' + res.success + ' with ' + res.error)) 
                    }
                })

}

//------------------------------------------------------------

export function getAllClouds (){
    memriiolog(true,('Memriio.getAllClouds'))
  
    return new Promise((resolve,reject) =>{
        fetch('https://memrii-api.herokuapp.com/get_clouds', {
            method: 'post',headers: {
                'Content-Type':'application/json'},
                body:JSON.stringify({ignore:null}) })
                    .then(response => response.json())
                    .then(res => {
                        if ( res.success ){
                            memriiolog(true,('getAllClouds :server response : ' + res.success))
                            resolve(res.data)
                        }else{
                            memriiolog(true,('getAllClouds :server response : ' + res.success + ' with ' + res.error)) 
                            reject(null)
                        }
                    })
    })
}

//--Returns and array of {userid,firstname,lastname} objects from the server-----------------------------------------------

export function getTaggedPeople  (memoryid,callback) {
    memriiolog(false,('Memriio.getTaggedPeople : memoryid ' + memoryid ))
   
    
    fetch('https://memrii-api.herokuapp.com/get_associatedpeople_memoryid', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({memoryid:memoryid})})
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        memriiolog(false,('server response : ' + res.success))
                        memriiolog(false,('server data : ' + JSON.stringify(res.data)))
                        callback(res.data)
                    }else{
                        memriiolog(false,('server response : ' + res.success + ' with ' + res.error)) 
                    }
                })

}

//----------------------------------------------------------------------------------------------------------------------

export function getMemorySearchWords  (memoryid,callback) {
    memriiolog(false,('Memriio.getMemorySearchWords : memoryid ' + memoryid ))
   
    
    fetch('https://memrii-api.herokuapp.com/get_searchwords_memid', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({memid:memoryid})})
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        memriiolog(false,('getMemorySearchWords server response : ' + res.success))
                        callback(res.data)
                    }else{
                        memriiolog(false,('getMemorySearchWords server response : ' + res.success + ' with ' + res.error)) 
                    }
                })

}

//----------------------------------------------------------------------------------------------------------------------

export function setMemorySearchWords  (memoryid,searchwords) {
    memriiolog(false,('Memriio.setMemorySearchWords : memoryid ' + memoryid + ' searchwords count = ' + searchwords.length))

    return new Promise((resolve,reject) =>{
        fetch('https://memrii-api.herokuapp.com/set_searchwords_memid', {
            method: 'post',headers: {
                'Content-Type':'application/json'},
                    body:JSON.stringify({memid:memoryid,searchwords:searchwords})})
                    .then(response => response.json())
                    .then(res => {
                        if ( res.success ){
                            memriiolog(false,('setMemorySearchWords server response : ' + res.success))
                            resolve(res)
                        
                        }else{
                            memriiolog(false,('setMemorySearchWords server response : ' + res.success + ' with ' + res.error))
                            reject(res.error)
                        }
                    })
    })
}


//-------------------------------------------------------------------------------------------------------------------------

export function getMemoryClouds  (memoryid,callback) {
    memriiolog(false,('Memriio.getMemoryclouds : memoryid ' + memoryid ))
   
    
    fetch('https://memrii-api.herokuapp.com/get_associatedclouds_memoryid', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({memoryid:memoryid})})
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        memriiolog(false,('getMemoryclouds server response : ' + res.success))
                        memriiolog(false,('getMemoryclouds response data : ' + JSON.stringify(res.data)))
                        callback(res.data)
                    }else{
                        memriiolog(false,('getMemoryclouds server response : ' + res.success + ' with ' + res.error))  
                    }
                })

}
//----------------------------------------------------------------------------------------------------------------

export function getAllUsers  () {
    memriiolog(false,('Memriio.getAllUsers'  ))
    
    return new Promise((resolve,reject) =>{

        fetch('https://memrii-api.herokuapp.com/get_all_users', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({nothing:'nothing'})})

                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        memriiolog(false,('getAllUsers server response : ' + res.success))                        
                        resolve(res.data)

                    }else{
                        memriiolog(false,('getAllUsers server response : ' + res.success + ' with ' + res.error))
                        reject(null)
                    }
                })

    })
    

}

//--Returns and array of {userid,firstname,lastname} objects from the server-----------------------------------------------

export function getCloudPeople  (clouds,callback) {
    memriiolog(false,('Memriio.getCloudPeople : clouds ' + JSON.stringify(clouds) ))
    
    return new Promise((resolve,reject) =>{

        fetch('https://memrii-api.herokuapp.com/get_cloud_people_clouds', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({clouds:clouds})})

                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        memriiolog(false,('getCloudPeople server response : ' + res.success))
                        memriiolog(false,('getCloudPeople response data : ' + JSON.stringify(res.data)))
                        if(callback) callback(res.data)
                        resolve(res.data)

                    }else{
                        memriiolog(false,('getCloudPeople server response : ' + res.success + ' with ' + res.error))
                        reject(null)
                    }
                })

    })
    

}


//------------------------------------------------------------

export function updateHeroImage (memoryid,heroImageid ){
    memriiolog(false,('Memriio.getAllImages : memoryid ' + memoryid ))

}

//------------------------------------------------------------

export function updateTitle (memoryid,newTitle){
    memriiolog(false,('Memriio.updateTitle : memoryid ' + memoryid + ' title : ' + newTitle))
  
    fetch('https://memrii-api.herokuapp.com/set_memory_title', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({memoryid:memoryid,newTitle:newTitle})})
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        memriiolog(false,('updateTitle : server response : ' + res.success))
                        return true
                    }else{
                        memriiolog(false,('updateTitle : server response : ' + res.success + ' with ' + res.error)) 
                        return false
                    }
                })

}
//------------------------------------------------------------

export function updateDescription (memoryid,newDescription){
    memriiolog(false,('Memriio.updateDescription : memoryid ' + memoryid + ' description : ' + newDescription))
  
    fetch('https://memrii-api.herokuapp.com/set_memory_description', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({memoryid:memoryid,newDescription:newDescription})})
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        memriiolog(false,('updateDescription : server response : ' + res.success))
                        return true
                    }else{
                        memriiolog(false,('updateDescription : server response : ' + res.success + ' with ' + res.error))  
                        return false
                    }
                })

}
//------------------------------------------------------------

export function deleteMemory (memoryid){
    
    memriiolog(true,('Memriio.deleteMemory : memoryid ' + memoryid ))
  
    fetch('https://memrii-api.herokuapp.com/delete_memory', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({memoryid:memoryid})})
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        memriiolog(true,('deleteMemory : server response : ' + res.success))
                        return true
                    }else{
                        memriiolog(true,('deleteMemory : server response : ' + res.success + ' with ' + res.error))
                        return false
                    }
                })

}

//------------------------------------------------------------

export function updateStory (memoryid,newStory){
    let len = 0
    if(newStory){len = newStory.length}
    memriiolog(false,('Memriio.updateStory : memoryid ' + memoryid + ' story.length : ' + len + ' chars'))
  
    fetch('https://memrii-api.herokuapp.com/set_memory_story', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({memoryid:memoryid,newStory:newStory})})
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        memriiolog(false,('updateStory : server response : ' + res.success))
                        return true
                    }else{
                        memriiolog(false,('updateStory : server response : ' + res.success + ' with ' + res.error)) 
                        return false
                    }
                })


}

//------------------------------------------------------------

export function updateTaggedPeople (memoryid,taggedPeople){
   
    
}

//------------------------------------------------------------

export function updateClouds (memoryid,clouds){
    

}

//------------------------------------------------------------

export function updateMemword(searchword){

    memriiolog(false,('Memriio.updateMemword :memword ' + JSON.stringify(searchword)))
  
    fetch('https://memrii-api.herokuapp.com/set_searchword', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({id:searchword.id,
                                     memid:searchword.memid,
                                     keyword:searchword.keyword,
                                     strength:searchword.strength,
                                     included:searchword.included})})
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        memriiolog(false,('updateMemword :server response : ' + res.success))
                        return true
                    }else{
                        memriiolog(false,('updateMemword :server response : ' + res.success + ' with ' + res.error))  
                        return false
                    }
                })  
   
}

//------------------------------------------------------------

export function updateCardType (memoryid,cardtype){

    memriiolog(false,('Memriio.updateCardType : memoryid ' + memoryid + ' card type : ' + cardtype))
  
    fetch('https://memrii-api.herokuapp.com/set_memory_cardtype', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({memoryid:memoryid,cardtype:cardtype})})
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        memriiolog(false,('updateCardType :server response : ' + res.success))
                        return true
                    }else{
                        memriiolog(false,('updateCardType :server response : ' + res.success + ' with ' + res.error))
                        return false
                    }
                })
}

//------------------------------------------------------------

export function updateLocation (memoryid,newLocation){
    memriiolog(false,('Memriio.updateLocation : memoryid ' + memoryid + ' location : ' + newLocation))
  
    fetch('https://memrii-api.herokuapp.com/set_memory_location', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({memoryid:memoryid,newLocation:newLocation})})
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        memriiolog(false,('updateLocation :server response : ' + res.success))
                        return true
                    }else{
                        memriiolog(false,('updateLocation :server response : ' + res.success + ' with ' + res.error)) 
                        return false
                    }
                })
}

//------------------------------------------------------------

export function addTaggedPerson (memoryid,userid){
    memriiolog(true,('Memriio.addTaggedPerson : memoryid ' + memoryid + ' user : ' + userid))

    return new Promise((resolve,reject) =>{
        fetch('https://memrii-api.herokuapp.com/associatePerson', {
            method: 'post',headers: {
                'Content-Type':'application/json'},
                    body:JSON.stringify({memid:memoryid,userid:userid})})
                    .then(response => response.json())
                    .then(res => {
                        if ( res.success ){
                            memriiolog(true,('addTaggedPerson :server response : ' + res.success))
                            resolve(res)
                        }else{
                            memriiolog(true,('addTaggedPerson :server response : ' + stry(res.success) + ' with ' + stry(res.error)))
                            reject(res.error)
                        }
                    })
    })
}

//------------------------------------------------------------

export function addTaggedCloud (memoryid,cloudid){
    memriiolog(true,('Memriio.addTaggedCloud : memoryid ' + memoryid + ' clouid : ' + cloudid))
  
    return new Promise((resolve,reject) =>{
        fetch('https://memrii-api.herokuapp.com/associateGroup', {
            method: 'post',headers: {
                'Content-Type':'application/json'},
                    body:JSON.stringify({memid:memoryid,groupid:cloudid})})
                    .then(response => response.json())
                    .then(res => {
                        if ( res.success ){
                            memriiolog(true,('addTaggedCloud :server response : ' + res.success))
                            resolve({
                                success:true,
                                data:res.data
                            })   
                        }else{
                            memriiolog(true,('addTaggedCloud :server response : ' + res.success + ' with ' + res.error)) 
                            reject({
                                success:false,
                                data:null,
                                error:res.error
                            })
                        }
                    })
    })
}


//------------------------------------------------------------

export function deleteTaggedPerson (memoryid,userid){
    memriiolog(false,('Memriio.deleteTaggedPerson : memoryid ' + memoryid + ' user : ' + userid))
  
    fetch('https://memrii-api.herokuapp.com/removeTaggedPerson', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({memid:memoryid,userid:userid})})
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        memriiolog(false,('deleteTaggedPerson :server response : ' + res.success))
                        return true
                    }else{
                        memriiolog(false,('deleteTaggedPerson :server response : ' + res.success + ' with ' + res.error))  
                        return false
                    }
                })
}

//---------------------------------------------------------------------------------------------------------------

export function deleteMemoryImage (memoryid,fileurl){
    memriiolog(false,('Memriio.deleteMemoryImage : memoryid ' + memoryid + ' cloud : ' + fileurl))
  
    fetch('https://memrii-api.herokuapp.com/removeFileFromMemory_fileurl', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({memid:memoryid,fileurl:fileurl})})
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        memriiolog(false,('deleteMemoryImage :server response : ' + res.success))
                        return true
                    }else{
                        memriiolog(false,('deleteMemoryImage :server response : ' + res.success + ' with ' + res.error))
                        return false
                    }
                })
}

//---------------------------------------------------------------------------------------------------------------

export function setHeroImage (memoryid,fileurl){
    memriiolog(false,('Memriio.setHeroImage : memoryid ' + memoryid + ' cloud : ' + fileurl))
  
    fetch('https://memrii-api.herokuapp.com/setHeroImage_fileurl', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({memid:memoryid,fileurl:fileurl})})
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        memriiolog(false,('setHeroImage :server response : ' + res.success))
                        return true
                    }else{
                        memriiolog(false,('setHeroImage :server response : ' + res.success + ' with ' + res.error)) 
                        return false
                    }
                })
}

//---------------------------------------------------------------------------------------------------------------

export function deleteTaggedCloud (memoryid,cloudid){
    memriiolog(false,('Memriio.deleteTaggedCloud : memoryid ' + memoryid + ' cloud : ' + cloudid))
    
    return new Promise((resolve,reject) =>{
    fetch('https://memrii-api.herokuapp.com/removeCloudFromMemory', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({memid:memoryid,cloudid:cloudid})})
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        memriiolog(false,('deleteTaggedCloud :server response : ' + res.success))
                        resolve(res.success)
                        }else{
                        memriiolog(false,('deleteTaggedCloud :server response : ' + res.success + ' with ' + res.error))  
                        reject(res.error)
                    }
                })
    })
}

//------------------------------------------------------------

export function getUser (userid,callback){
    memriiolog(false,('Memriio.getUser : userid ' + userid ))
  
    fetch('https://memrii-api.herokuapp.com/getUser_userid', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({userid:userid})})
                .then(response => response.json())
                .then(res => {
                    if ( res.success){
                        memriiolog(false,('getUser :server  : ' + res.data.userid + ' ' + res.data.firstname + ' ' + res.data.lastname))
                        callback(res.data)                        
                    }else{
                        memriiolog(false,('getUser :server  : ' + res.status ))                         
                    }
                })
}

//------------------------------------------------------------

export function setUserMemberships (userid,cloudids){

    memriiolog(false,('Memriio.updateUserClouds : userid ' + userid + ' clouds ' + stry(cloudids)))
    return new Promise((resolve,reject) =>{
    fetch('https://memrii-api.herokuapp.com/set_user_memberships', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({userid:userid,cloudids:cloudids})})
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        memriiolog(false,('updateUserClouds :server response : ' + res.success))
                        resolve(res.data)
                    }else{
                        memriiolog(false,('updateUserClouds :server response : ' + res.success + ' with ' + res.error)) 
                        reject(res.error)
                    }
                })
    })
}

//-------------------------------------------------------------------------------

export function updatedUserClouds ( userid, cloudArrayString){

    memriiolog(true,('Memriio.updateUserClouds : userid ' + userid + ' cloudString ' + cloudArrayString))
    return new Promise((resolve,reject) =>{
        fetch('https://memrii-api.herokuapp.com/set_webClouds_userid', {
            method: 'post',headers: {
                'Content-Type':'application/json'},
                    body:JSON.stringify({userid:userid, webclouds:cloudArrayString})})
                    .then(response => response.json())
                    .then(result => { 
                        if(result.success){
                            memriiolog(true,('Memriio.updateUserClouds :server response : ' + result.success))
                            resolve({
                                success : true,
                                data:null
                            })
                        }else{
                            memriiolog(true,('Memriio.updateUserClouds :server response : ' + result.success + ' with ' + result.error)) 
                            reject({
                                success:false,
                                data: null,
                                err:result.err
                            })    
                        }
                    })     
    })
}

//-------------------------------------------------------------------------------


export function getUserClouds (userid,callback){
    memriiolog(true,('Memriio.getUserClouds : userid ' + userid ))
  
    fetch('https://memrii-api.herokuapp.com/get_clouds_userid', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({userID:userid})})
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        memriiolog(true,('getUserClouds :server response : ' + res.success))
                        callback(res.data)
                        return true
                    }else{
                        memriiolog(false,('getUserClouds :server response : ' + res.success + ' with ' + res.error)) 
                        return false
                    }
                })
}

//-------------------------------------------------------------------------------

export function createMemoryID (userid,title,description,story,location)  {

    memriiolog(true,('Memriio.createMemoryID : userid ' + userid + ' title ' + title + ' description ' + description + ' location ' + location ))

    return new Promise((resolve,reject) => {
        fetch('https://memrii-api.herokuapp.com/creatememory', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({
                userid : userid,
                description: description,
                title : title,
                story : story,
                location : location
                })
        })
        .then(response => response.json())
        .then(result => {
            if(result.success){
                console.log('memriio.createMemoryID : ' + result.data);
                resolve(result.data)
            }  else {
                console.log('memriio.createMemoryID : failed to create memory with title : ' + title);
                reject('failed : unable to create memory')
            }
        })
    })
}

//-------------------------------------------------------------------------------

export function getUserByEmail ( email ){

    memriiolog(false,('Memriio.getUserByEmail : email ' + email ))
    return new Promise((resolve,reject) =>{
        fetch('https://memrii-api.herokuapp.com/get_user_by_email', {
            method: 'post',headers: {
                'Content-Type':'application/json'},
                    body:JSON.stringify({email:email})})
                    .then(response => response.json())
                    .then(response => {
                        if ( response.success){
                            resolve({
                                success:true,
                                data:response.data
                            })                       
                        }else{
                            reject( {
                                success:false,
                                data: null,
                                err:response.err
                            })
                        }
                    })

    })
}

//-------------------------------------------------------------------------------

export function getCloudMemberships ( ){
    console.log('getCloudMemberships ')

    return new Promise((resolve,reject) =>{
        fetch('https://memrii-api.herokuapp.com/get_cloud_memberships', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({nothing:null})})
                .then(response => response.json())
                .then(response => 
                        {resolve({data:response.data})},
                        error =>{reject({error:error})})
        })
}
//-------------------------------------------------------------------------------
export function deleteUser ( user ){
    console.log('deleteUser ' + stry(user.userid + ':' + user.firstname + ' ' + user.lastname));

    return new Promise((resolve,reject) =>{
        fetch('https://memrii-api.herokuapp.com/delete_user', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({userid:user.userid})})
                .then(response => response.json())
                .then(response => 
                        {resolve({data:response.success})},
                        error =>{reject({error:error})})
        })
}

//-------------------------------------------------------------------------------
export function setNewUser ( user ){
    console.log('setNewUser ' + stry(user.firstname + ' ' + user.lastname));

    return new Promise((resolve,reject) =>{
        fetch('https://memrii-api.herokuapp.com/register', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({
                    email:user.email,
                    password: user.password,
                    firstname: user.firstname,
                    lastname: user.lastname
                    })
                })
                .then(response => response.json())
                .then(response => 
                        {resolve({data:response.data})},
                        error =>{reject({error:error})})
        })
}

//-------------------------------------------------------------------------------

export async function getDownloadSignedurl (fileName) {
    
    console.log('getsignedurl ' + fileName);
    let ftype = getFileMime(fileName)
    
    return new Promise((resolve,reject) => {
        fetch('https://memrii-api.herokuapp.com/getObject_signedurl', {
            method: 'post',headers: {
                'Content-Type':'application/json'},
                    body:JSON.stringify({fileName: fileName,fileType : ftype})})
                    .then(response => response.json())
                    .then(response => {
                        if ( response.success){
                            resolve( response.data )                       
                        }else{
                            console.log('get signedurl ' + stry(response))
                            reject( response.err)
                        }
                    })
            })
 
}

//-------------------------------------------------------------------------------

export async function getUploadSignedurl (fileName) {
    
    console.log('getUploadSignedurl ' + fileName);
    let ftype = getFileMime(fileName)
    
    return new Promise((resolve,reject) => {
        fetch('https://memrii-api.herokuapp.com/putobject_signedurl', {
            method: 'post',headers: {
                'Content-Type':'application/json'},
                    body:JSON.stringify({fileName: fileName,fileType : ftype})})
                    .then(response => response.json())
                    .then(response => {
                        if ( response.success){
                            console.log(stry(response)); 
                            
                            resolve({
                                success:true,
                                data:{
                                    signedRequest: response.data.signedRequest,
                                    awsurl: response.data.url
                                }
                            })                       
                        }else{
                            console.log('get signedurl ' + stry(response))
                            
                            reject( {
                                success:false,
                                data: null,
                                err:response.err
                                
                                
                            })
                        }
                    })
            })
 
}
//-------------------------------------------------------------------------------
export function uploadFile(fileName,buffer ){
    let signedRequest = ''
    let AWSurl = ''
    let fileType = getFileMime(fileName)

    return new Promise((resolve,reject)=>{
        getUploadSignedurl(fileName)
        .then(result =>{
            if(result.success){
                signedRequest = result.data.signedRequest
                AWSurl = result.data.awsurl
                uploadToS3(buffer,signedRequest,fileType)
                .then(result => { 
                    if(result.success){
                        resolve({
                            success : true,
                            awsurl: AWSurl,
                        })
                    }else{
                        reject({
                            success:false,
                            data: null,
                            err:result.err
                        })    
                    }
                })        
            }
        })
           
    })
}

//-------------------------------------------------------------------------------------------------

export function uploadFilePair(originalFileName,originalFileBuffer,thumbFileName,thumbFileBuffer ){
    let originalSignedRequest = ''
    let thumbSignedRequest = ''
    let originalAWSurl = ''
    let thumbAWSurl = ''
    let origFileType = getFileMime(originalFileName)
    let thumbFileType = getFileMime(thumbFileName)

    return new Promise((resolve,reject)=>{
        getUploadSignedurl(originalFileName)
        .then(result =>{
            if(result.success){

                originalSignedRequest = result.data.signedRequest
                originalAWSurl = result.data.awsurl
                
                getUploadSignedurl(thumbFileName)
                .then(result => {
                    if(result.success){
                        thumbSignedRequest = result.data.signedRequest
                        thumbAWSurl = result.data.awsurl
                        uploadToS3(originalFileBuffer,originalSignedRequest,origFileType)
                        .then(result => {
                            if(result.success){
                            uploadToS3(thumbFileBuffer,thumbSignedRequest,thumbFileType)
                            .then(result =>{
                                if(result.success){
                                    resolve({
                                        success : true,
                                        originalURL: originalAWSurl,
                                        thumbURL : thumbAWSurl
                                    })
                                }   
                             })
                            }else{
                                reject({
                                    success:false,
                                    data: null,
                                    err:result.err
                                })    
                            }
                         })
                        
                    }else{
                        reject({
                            success:false,
                            data: null,
                            err:result.err
                        })
                    }
                })               
            }else{
                reject( {
                    success:false,
                    data: null,
                    err:result.err
                })
            }
           
        })
    })

}

//-------------------------------------------------------------------------------

function uploadToS3  (file, signedRequest,fileType)  {
    console.log('uploadtoS3 file '  );
    return new Promise((resolve,reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('PUT', signedRequest);
        xhr.setRequestHeader('Content-Type', fileType) 
        xhr.onreadystatechange = () => {
        console.log('uploadtoS3 progress readystate : '  + xhr.readyState );
        if(xhr.readyState === 4){
            console.log('uploadtoS3 progress status : '  + xhr.status );
            if(xhr.status === 200){
                console.log('uploadtoS3 xhr response : '  + xhr.responseURL );
                resolve({
                    success:true,
                    data: xhr.responseURL
                })
            }
            else{
                reject({
                    success:false,
                    data:null,
                    error:'upload to aws s3 account failed'
                })
            }
        }
        };
        xhr.send(file);
  })
}

//-------------------------------------------------------------------------------

export function getFileMime  (fileNameAndExtension)  {

    let extension = fileNameAndExtension.split('.')[1]
    
    let mime =''
    switch (extension) {
        case 'mov': mime = 'video/quicktime' 
        break;
        case 'jpg': mime = 'image/jpeg' 
        break;
        case 'jpeg': mime = 'image/jpeg' 
        break;
        case 'mp4': mime = 'video/mp4' 
        break;
        case 'png': mime = 'image/png' 
        break;
    }
    return mime
}

//-------------------------------------------------------------------------------


export function addFileToMemory  (fileUrlObj,ishero,memoryid)  {
    
    
    let sourceURL  = fileUrlObj.originalURL
    let thumbURL   = fileUrlObj.thumbURL
    
    let sourceext   = getExtension( sourceURL )
    let thumbext    = getExtension( thumbURL  )
    
    console.log('addFileToMemory : sourceURL ' + getFilename(sourceURL))
    console.log('addFileToMemory : thumbURL ' + getFilename(thumbURL))
    
    return new Promise((resolve,reject) => {
        fetch('https://memrii-api.herokuapp.com/associateFile', {
            method: 'post',headers: {
                'Content-Type':'application/json'},
                    body:JSON.stringify({
                        memid: memoryid,
                        fileurl: sourceURL,
                        fileext: sourceext,
                        thumburl: thumbURL,
                        thumbext: thumbext,
                        ishero: ishero
                        })
                    })
                    .then(response => response.json())
                    .then(response => {
                        if ( response.success){
                            console.log('associate file : memid :'  + memoryid + ' file : ' +  sourceURL + ' hero shot = ' + ishero + ' ' + response.data.id);
                            resolve({
                                success:true,
                                data:response.data
                            })
                        }else{
                            reject({
                                success:false,
                                data:null
                            })
                        }
                    })
    })
}
// ----------------------------------------------------------------------------

export function resizeImage( fileBuffer,targetWidth ){

    return new Promise((resolve,reject) => {
        new Compressor(fileBuffer, 
            {
                quality: 0.6,
                convertSize: (0.3 * 1000000),
                maxWidth:targetWidth,
                success(result) {
                    console.log('resize success ' + result.size/1000 + 'kb');
                    resolve({success:true,data:result})},
                error(err){reject({success:false,data:null,err:err})}
            })
     })
}

// ----------------------------------------------------------------------------

export function compressImage( fileBuffer,quality ){

    return new Promise((resolve,reject) => {
        new Compressor(fileBuffer, 
            {
                convertSize: (0.5 * 1000000),
                quality: quality,
                success(result) {
                    console.log('compress success ' + result.size/1000 + 'kb');
                    
                    resolve({success:true,data:result})
                },
                error(err){
                    console.log('compress fail ' + err);
                    
                    reject({success:false,data:null,err:err})}
            })
     })
}

// ----------------------------------------------------------------------------

export function transcodeVideoToHLS( awsMP4Filekey , awsFilePrefix ){
   

    memriiolog(true,('Memriio.transcodeTest : aws file key ' + awsMP4Filekey  + ' prefix : ' + awsFilePrefix ))

    return new Promise((resolve,reject) =>{
        fetch('https://memrii-api.herokuapp.com/transcode_mp4_HLS_Playlist', 
        {
            method: 'post',headers: {
                'Content-Type':'application/json'},
                    body:JSON.stringify({ mp4filekey : awsMP4Filekey , outputPrefix : awsFilePrefix })})
                    .then(response => response.json())
                    .then(response => {
                        if ( response.success){
                            memriiolog(true,('Memriio.transcodeTest : response ' + JSON.stringify(response)))
                            resolve({

                                success:true,
                                data:response.data
                            })                       
                        }else{
                            reject( {
                                success:false,
                                data: null,
                                err:response.err
                            })
                        }
                    })

    })
}

    
//-------------------------------------------------------------------------------

//----------------------- UTILITIES --------------------------------------------

export function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);
  
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
  
    // create a view into the buffer
    var ia = new Uint8Array(ab);
  
    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
  
    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  
  }

//---------------------------

export function canHandleDroppedFile(filename){
    let ext = getExtension(filename).toLowerCase()    
    let filetypes = ['jpeg','jpg','png','mov','mp4']
    let found = filetypes.indexOf(ext)
    return !(found === -1) 
}

//---------------------------

export function isSupportedImageFile(filename){
    let ext = getExtension(filename).toLowerCase() 
    let filetypes = ['jpeg','jpg','png']
    let found = filetypes.indexOf(ext)
    return !(found === -1) 
}

//---------------------------

export function isSupportedVideoFile(filename){
    let ext = getExtension(filename).toLowerCase() 
    let filetypes = ['mov','mp4','mpeg']
    let found = filetypes.indexOf(ext)
    return !(found === -1) 
}

//---------------------------

export function getExtension (filepath) {
    let fileParts = filepath.split('.');
    let filetype = fileParts[fileParts.length-1];
    return filetype
}

//---------------------------

export function getFilename (filepath) {
    let parts = filepath.split('/')
    let fname = parts[parts.length-1]
    return fname
}

//---------------------------

export function stry (str)  {
    str = JSON.stringify(str)
    if (str.charAt(0) === '"') str = str.substr(1,str.length-1)    
    if (str.charAt(str.length -1) === '"') str = str.substr(0,str.length-1)
    return str
}

//---------------------------

export function getShortDate(longdate) {
    var fdate = new Date(longdate)
    
    return format(fdate,'dd.MMM.yyyy')
}

//---------------------------

export function isEmailFormat(email){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());

}

//---------------------------

export function isNonEmptyArray (arrayObj) {
    if(arrayObj){
        if(Array.isArray(arrayObj)){
            if(arrayObj.length > 0){
                return true
            }
        }else return false
    }else return false
}

//---------------------------

export function shrinkCardDescription(description){
    if(description && description.length > 30){
        return description.substr(0,30)+'...'
    }else{
        return description
    }
}