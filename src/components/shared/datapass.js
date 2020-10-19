import React from 'react';
import{ REACT_APP_AWS_KEY_ID,
        REACT_APP_AWS_SECRET_ACCESS_KEY,
        REACT_APP_S3_BUCKET,
        REACT_APP_REGION } from 'react-native-dotenv'
import { RNS3 } from 'react-native-aws3'
import ImageResizer from 'react-native-image-resizer';
import AsyncStorage from '@react-native-community/async-storage'




const memory = {
    title:'',       // short title of the memory : string
    story:'',       // text desciribing the memory : string
    files:[],       // an array of string pairs local filepath, local thumbpath : [ string, String ]
    people:[],      // an array of userids : [ int ]
    location:'',    // name of the location : string
    groups:[],      // array of group IDs : [ int ]
    remoteURLS:[],  // array of remote url S3 path pairs  : [ sourcefile, thumbnail ]
    userid:0,       // id of the current user : int
    MemoryID:0,     // id of the newly created memory : int
    errorLog:[],    // array or error messages : [ string ]
   
}



// create a new emory cloud  -----------------------------------------------------

export async function createMemoryCloud  (cloudName,administratorID){
    console.log('datapass.createMemoryCloud : ' + cloudName + ' admin : ' + administratorID);
    
    return new Promise((resolve,reject) => {
        fetch('https://memrii-api.herokuapp.com/createcloud', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({
                name : cloudName,
                adminid : administratorID
                })
        })
        .then(response => response.json())
        .then(data => {
            if(data.created){
                
                console.log('createMemoryCloud: ' + data.id + 'with administrator ' + administratorID);
                resolve('success')
            }  else {
                console.log('createMemoryCloud: Error creating cloud : ' + cloudName);
                reject('failed : unable to create memory')
            }
        })
    })
    
}

// get details for the current user -----------------------------------------------------

export async function activeUser  (){

    logged = await AsyncStorage.getItem( 'userLoggedin')
    console.log('activeUser is anyone loggedin: ' + logged);

    if(logged){
        
            userid = await AsyncStorage.getItem('uaserid')
            firstName = await AsyncStorage.getItem('firstname')
            lastName = await AsyncStorage.getItem('lastname')
            email = await AsyncStorage.getItem('email')
            user = {userid,firstName,lastName,email}
            console.log('activeUser user: ' + user.firstName + ' ' + user.lastName + ' id: ' + user.userid + ' email: ' + user.email);
            return user
        
    }else{
        return null
    }
}

// post new memory -----------------------------------------------------

export function postNewMemory  (
                title,
                story,
                files,
                people,
                location,
                groups,
                userid
                )  
                
{
    memory.title = title 
    memory.story = story
    memory.files = files
    memory.people = people
    memory.location = location
    memory.groups = groups
    memory.userid = userid
    memory.remoteURLS=[];

    return uploadNewMemory()
    
}

// ---------------------------------------------------------------------------------
// Removes all content captured for the current post
// pre : 
// post :  any key value pair where key contains 'image-','video-', 'audio-' will 
//         be removed from Storage

export async function cleanupStorage (){
    console.log('function : cleanupStorage ');
    
    try{
      
      const keys =  await AsyncStorage.getAllKeys()
      keys.map(key => {
        if(key.includes('image-') || key.includes('video-') || key.includes('audio-')) {
          console.log('Removing storage item : ' + key);
          AsyncStorage.removeItem(key)
        }
      })
      
    }catch (e) {
      console.log(e);
      am
    }

  }

// retrieve all memories for user and cloudIDs where user is in that cloud --------------------

export function mapUserClouds (userid,callback)  
{
    
    console.log('mepUserClouds for user : ' + userid )
        fetch('https://memrii-api.herokuapp.com/get_clouds_userid', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({userID: userid})})
                .then(response => response.json())
                .then(res => {
                    if ( res.success ){
                        console.log('server response : ' + res.success);
                        console.log('server data : ' + res.data);
                        callback(res.data)
                    }else{
                        console.log('server response : ' + res.success + ' with ' + res.error);  
                    }
                })

}

//---------------------------------------------------------------------------------------------

export function searchMemories (userid,cloudids,searchwords,callback)  
{
    
    console.log('searchMemories for user : ' + userid + ' in groups ' + cloudids + ' searchwords '+ searchwords  )
    fetch('https://memrii-api.herokuapp.com/get_memories_userid_keywords_cloudids', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({
                    userid: userid,
                    cloudids:cloudids,
                    words: searchwords})})

                .then(response => response.json())
                .then(response => {
                    if ( response.status !== 400){
                        callback(response.data)
                    }else{
                        
                    }
                })

}

//--------------------------------------------------------------------------------- 

export function getMemoryFiles (memid,callback)  
{
    console.log('getMemoryFiles for memory : ' + memid )
    fetch('https://memrii-api.herokuapp.com/get_memfiles_memoryid', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({memoryid: memid})})
                .then(response => response.json())
                .then(response => {
                    if ( response.success){
                        callback(response.data)
                    }else{
                        callback(null)
                    }
                })

}

//--------------------------------------------------------------------------------- 

export function getMemoryPeople (memid,callback)  
{
    console.log('getMemoryPeople for memory : ' + memid )
    fetch('https://memrii-api.herokuapp.com/get_associatedpeople_memoryid', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({memoryid: memid})})
                .then(response => response.json())
                .then(response => {
                    if ( response.success){
                        callback(response.data)
                    }else{
                        callback(null)
                    }
                })

}

//--------------------------------------------------------------------------------- 

export function getMemories (userID,cloudIDs,callback)  
{
    
    console.log('getMemories for user : ' + userID + ' in groups ' + cloudIDs )
    fetch('https://memrii-api.herokuapp.com/get_memories_userid_cloudids', {
        method: 'post',headers: {
            'Content-Type':'application/json'},
                body:JSON.stringify({userid: userID,cloudids: cloudIDs})})
                .then(response => response.json())
                .then(response => {
                    if ( response.status !== 400){
                        callback(response.data)
                    }else{
                    
                        
                    }
                })

}

// create a new memory ID -----------------------------------------------------

uploadNewMemory = async () => {
    
    console.log('uploadNewMemory');
    
    uploadFile(memory.files[0])
    .then(response => {
        if(response){
            memory.remoteURLS.push(response)
            console.log('uploadNewMemory - first uploaded : ' + response);
            createMemoryID()
            .then(response => {
                if(response == 'success'){
                    console.log('uploadNewMemory - memory id created : ' + response);
                    addFileToMemory(memory.remoteURLS[0],true).then(response => {
                        console.log('uploadNewMemory - hero associated : ' + response)
                        addRemaingFilestoMemory()
                        addPeopletoMemory()     
                        addGroupstoMemory()
                    })
                    return true           
                }else{
                    return false
                }
            })
                
        }else{
            console.log('failed to upload first file : ' + memory.files[0]);
            return false
        }
    })
}

// ----------------------------------------------------------------------------

const getExtension = (filepath) => {
    let fileParts = filepath.split('.');
    let filetype = fileParts[fileParts.length-1];
    return filetype
}

const getFilename = (filepath) => {
    let parts = filepath.split('/')
    let fname = parts[parts.length-1]
    return fname
}

// add remaining files to memory ------------------------------------------------

addRemaingFilestoMemory = () => {

    memory.files.map((fileObj,index) => {
        if(index != 0)
        { 
            uploadFile(fileObj)
                .then(response => {
                    if(response ){
                        memory.remoteURLS.push(response)
                        addFileToMemory(memory.remoteURLS[index],false)
            }else{

            }
        })
    }})
}   

// add people to memory ------------------------------------------------

addPeopletoMemory = () => {

    memory.people.map((person,index) => {
         addPersontoMemory(person)
                .then(response => {
                    if(response == 'success'){
                        
            }else{

            }
        })
    })
    
}   
// add people to memory ------------------------------------------------

addGroupstoMemory = () => {

    memory.groups.map((groupid,index) => {
         addGrouptoMemory(groupid)
                .then(response => {
                    if(response == 'success'){
                        
            }else{

            }
        })
    })
}   
// ------------------------------------------------------------------------------

getFileMime = (extension) => {
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
    }
    return mime
}

stry = (str) => {
    str = JSON.stringify(str)
    if (str.charAt(0) === '"') str = str.substr(1,str.length-1)    
    if (str.charAt(str.length -1) === '"') str = str.substr(0,str.length-1)
    return str
}

// ------------------------------------------------------------------------------

uploadFile = (fileObj) =>{
    
    let filepath = stry(fileObj.filepath)
    let thumbnail = stry(fileObj.thumbnail)
    let origFileParts = filepath.split('.');
    let origExtension = origFileParts[1]
    let thumbFileParts = thumbnail.split('.');
    let thumbExtension = thumbFileParts[1]
    let commonfileName = memory.userid + '-' + Date.now()
    let origS3URL = thumbS3URL = ''
    
    return new Promise((resolve,reject) => {

        console.log('uploadFile : calling processImage : ' + filepath);
        
        processImage(filepath,origExtension)
            .then(response => {
                if(response != 'failure'){
                    let targetFileName = commonfileName + '-original' + '.' + origExtension
                    _uploadFiletoS3(response,targetFileName)
                    .then(result => {
                        if(result != 'failure'){
                            origS3URL = result
                            processImage(thumbnail,thumbExtension)
                            .then(response => {
                                if(response != 'failure'){
                                    let targetFileName = commonfileName + '-thumb' + '.' + thumbExtension
                                    _uploadFiletoS3(response,targetFileName)
                                    .then(result => {
                                        if(result != 'failure'){
                                            thumbS3URL = result
                                            resolve({originalURL:origS3URL,thumbURL:thumbS3URL})

                                        }else{
                                            reject(null)
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
    })

}

//-------------------------------------------------------------------------------

_uploadFiletoS3 = (sourceFile,targetFile) => {
    
    console.log('_uploadFileToS3 : ' + sourceFile);
    let fileParts = sourceFile.split('.');
    let extension = fileParts[1]
    let MIME = getFileMime(extension) 

    const file ={
        uri: sourceFile,
        name: targetFile,
        type: MIME
    }

    const options = {
        keyPrefix: '',
        bucket: REACT_APP_S3_BUCKET,
        region: REACT_APP_REGION,
        accessKey: REACT_APP_AWS_KEY_ID,
        secretKey: REACT_APP_AWS_SECRET_ACCESS_KEY,
        successActionStatus: 201
    }
    
    return new Promise((resolve,reject) => {
                
        console.log('Attempt RNS3.put')
        console.log('sourcefile ' + file.uri )
        console.log('targetfile ' + file.name+ ' type ' + file.type);                 
        
        RNS3.put(file, options)
        .then(response => {                
            if (response.status == 201){      
                resolve(response.body.postResponse.location)
            }else{
                console.log('RNS3 upload failed : ' + response)
                reject(null)
            }
        })
    })
    
}

// ------------------------------------------------------------------------------

processImage = async (filepath,filetype) => {

    let ft = filetype.toLowerCase()
    console.log('processImage : filetype is ' + ft);
    console.log('processImage : ext match ' + (ft == 'mp4'));
    try {
        return new Promise((resolve, reject) => {
           
            
            if( ft == 'mov'|| ft == 'mp4'){
                console.log('processImage : filetype is ' + ft);
                resolve(filepath)
            }else{
                ImageResizer.createResizedImage(filepath, 1500, 540, 'JPEG', 80, 0)
                .then(response => {
                    console.log('Resized Image : ' + response.name + " : Resized to : " + response.size);
                    resolve(response.path);
                })
                .catch(err => {
                    console.log(err);
                    reject('processImage : Error A ' + err);
                });
            }
        });
    }
    catch (err_1) {
        console.log('processImage : Error B ' + err_1);
    }
}


//--------------------------------------------------------------------------

addFileToMemory = (fileUrlObj,ishero) => {
    
    
    sourceURL = stry(fileUrlObj.originalURL)
    thumbURL  = stry(fileUrlObj.thumbURL)
    
    sourceext   = getExtension( sourceURL   )
    thumbext    = getExtension( thumbURL    )
    
    console.log('addFileToMemory : sourceURL ' + getFilename(sourceURL))
    console.log('addFileToMemory : thumbURL ' + getFilename(thumbURL))
    
    return new Promise((resolve,reject) => {
        fetch('https://memrii-api.herokuapp.com/associateFile', {
            method: 'post',headers: {
                'Content-Type':'application/json'},
                    body:JSON.stringify({
                        memid: memory.MemoryID,
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
                            console.log('associate file : memid :'  + memory.MemoryID + ' file : ' +  sourceURL + ' hero shot = ' + ishero + ' ' + response.data.id);
                            resolve('success')
                        }else{
                            reject('failed to associate file : ' + response)
                        }
                    })
    })
}

//-------------------------------------------------------------------------------

export async function getObjectSignedurl (fileName) {

    return new Promise((resolve,reject) => {
        fetch('https://memrii-api.herokuapp.com/getObject_signedurl', {
            method: 'post',headers: {
                'Content-Type':'application/json'},
                    body:JSON.stringify({fileName: fileName})})
                    .then(response => response.json())
                    .then(response => {
                        if ( response.success){
                            resolve(response.signedURL)                       
                        }else{
                            reject( response.error)
                        }
                    })
            })
 
}

// add a person to a memory -----------------------------------------------------

addPersontoMemory = (personID) => {
    
    return new Promise((resolve,reject) => {
        fetch('https://memrii-api.herokuapp.com/associatePerson', {
            method: 'post',headers: {
                'Content-Type':'application/json'},
                    body:JSON.stringify({
                        memid: memory.MemoryID,
                        userid: personID
                        })
                    })
                    .then(response => response.json())
                    .then(response => {
                        if ( response.status !== 400){
                            console.log('associate person : ' + personID + '  ' + response);
                            resolve('success')
                        }else{
                            console.log('associate person : ' + personID + '  ' + response);
                            reject('failed to associate person : ' + response)
                        }
                    })
    })
}

// add a person to a memory -----------------------------------------------------

addGrouptoMemory = (groupID) => {

    return new Promise((resolve,reject) => {
        fetch('https://memrii-api.herokuapp.com/associateGroup', {
            method: 'post',headers: {
                'Content-Type':'application/json'},
                    body:JSON.stringify({
                        memid: memory.MemoryID,
                        groupid: groupID
                        })
                    })
                    .then(response => response.json())
                    .then(response => {
                        if ( response.status !== 400){
                            console.log('associate group : ' + groupID + '  ' + response);
                            resolve('success')
                        }else{
                            console.log('associate group : ' + groupID + '  ' + response);
                            reject('failed to associate group : ' + response)
                        }
                    })
    })
}

// add a keyword to a memory -----------------------------------------------------


addKeywordtoMemory = (word) => {

    return new Promise((resolve,reject) => {
        fetch('https://memrii-api.herokuapp.com/associateKeyword', {
            method: 'post',headers: {
                'Content-Type':'application/json'},
                    body:JSON.stringify({
                        memid: memory.MemoryID,
                        keyword: word
                        })
                    })
                    .then(response => response.json())
                    .then(response => {
                        if ( response.status !== 400){
                            console.log('associate key word : ' + word + '  ' + response);
                            resolve('success')
                        }else{
                            console.log('associate key word : ' + word + '  ' + response);
                            reject('failed to associate keyword : ' + response)
                        }
                    })
    })
}


// create memory log -----------------------------------------------------

createMemoryID = () => {
    
    return new Promise((resolve,reject) => {
        fetch('https://memrii-api.herokuapp.com/creatememory', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({
                userid : memory.userid,
                title : memory.title,
                story : memory.story,
                location : memory.location
                })
        })
        .then(response => response.json())
        .then(memData => {
            if(memData.created){
                memory.MemoryID = memData.memid
                console.log('creatememid : ' + memory.MemoryID + 'remoteid ' + memData.memid);
                resolve('success')
            }  else {
                console.log('creatememid : ' + memData.memid);
                reject('failed : unable to create memory')
            }
        })
    })
}