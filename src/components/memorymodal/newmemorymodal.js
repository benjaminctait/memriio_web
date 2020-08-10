import React from 'react';

import greycross from '../images/x-grey.png'
import tick from '../images/tick.png'
import tag from '../images/tag.png'
import globe from '../images/outline-globe.png'
import calendar from '../images/calendar.png'
import key from '../images/key.png'
import author from '../images/author.png'
import x from '../images/x-symbol.png'
import left from '../images/chevron-left.png'
import right from '../images/chevron-right.png'
import trash from '../images/trash.png'
import hero from '../images/hero-full.png'
import heroOutline from '../images/hero-outline-grey.png'
import cloudIMG from '../images/cloud.png'
import cloudupload from '../images/cloudupload.png'

import MemoryFileViewer from '../memoryviewer/memoryImageViewer'
import * as mem from '../memriioserver'
import * as DropSearch from '../dropsearch/dropsearch'

import WordExctractor from 'keyword-extractor'
import { Container, Draggable} from 'react-smooth-dnd'
import Dropzone,{useDropzone} from 'react-dropzone'

import './memorymodal.css'

import {CheckBox,ImageLabel} from '../buttons/buttons'

class NewMemoryModal extends React.Component{
  constructor(props) {
    super(props);
    this.state.addPeopleRef = React.createRef();
    this.state.addCloudRef = React.createRef();
  }

    state ={
       
          memid:0,
          createdon:'',
          user:null,
          title:'',
          description:'',
          location:'',
          story:'',
          cardtype:0,
          taggedPeople:[],
          memoryClouds:[],
          searchWords:[],         
          memfiles:[],
          cloudPeople:[],
     
        activefile:null,
        userClouds:[],
        memfileIndex:0,

        showSelectPeople:false,
        showSelectClouds:false,
        addPeopleRef:null,
        addPeopleRect:null,
        addCloudRef:null,
        addCloudRect:null,
    }

//---------------------------------------------------------------------------------

onHide = () =>{    
  this.setState({showSelectPeople:false , showSelectClouds:false })
  
  this.state ={
      memid:0,
      createdon:'',
      user:null,
      title:'',
      description:'',
      location:'',
      story:'',
      cardtype:0,
      taggedPeople:[],
      memoryClouds:[],
      searchWords:[],         
      memfiles:[],
      cloudPeople:[],

      addPeopleRef:null,
      addPeopleRect:null,
      addCloudRef:null,
      addCloudRect:null,

    activefile:null,
    userClouds:[],
    memfileIndex:0,
  }
  
  this.props.onCancelNewMemory()
}
//---------------------------------------------------------------------------------

componentDidUpdate = (prevProps,prevState) =>{

  if(!this.state.user || prevProps.userid !== this.state.user.userid)
  {
    mem.getUser(this.props.userid,(user => {

      this.setState({user:user,userClouds:this.props.userClouds,createdon:Date.now()})
      
    }))
  }
}

//---------------------------------------------------------------------------------

  getHeroFile = () => {
    
    let hero = this.state.memfiles[0]

    this.state.memfiles.map((memfile,index)=> {

        if(memfile.ishero){         
            this.state.memfileIndex = index            
            hero = memfile
        }
    })
    return hero
  }
//---------------------------------------------------------------------------------
  populateMemoryFiles = (memfiles) => {

    this.state.memfiles = memfiles
    this.setState({activefile:this.getHeroFile()})
  }
//---------------------------------------------------------------------------------
  populateSearchWords = (words) =>{
    this.setState({searchWords:words})
  }

//------------------------------------------------------------------------

  populateCloudInfo = (clouds) =>{
    this.setState({memoryClouds:clouds})
    mem.getCloudPeople (clouds,((people)=>{
      this.setState({cloudPeople:people})
    }))   
  }

//------------------------------------------------------------------------

  userIsAuthorisedToEdit = () =>{
    return true
  }

  //------------------------------------------------------------------------

  deleteFileFromMemory =() =>{
    console.log('delte file from memroy');
    
  }
  
  //------------------------------------------------------------------------


  makeHeroFile = () =>{
    console.log('make hero file');
    
  }
  
  //------------------------------------------------------------------------

  handleAddTaggedPerson = (Person) =>{

    this.handleHidePeopleSearch()
    let tp = this.state.taggedPeople
    if(!tp.find(dude => dude.userid === Person.userid)){
      tp.push(Person)
      tp.reverse()
      this.setState({taggedPeople:tp})
    }
  }

  //------------------------------------------------------------------------

  handleRemoveFromCloud = ( Cloud ) =>{
    let cl = []
    this.state.memoryClouds.map(cloud =>{if(cloud.id !== Cloud.id) cl.push(cloud)})
    this.populateCloudInfo(cl)

  }

  //------------------------------------------------------------------------

  handleDeleteTaggedPerson = (Person) =>{
    let tp = []
    this.state.taggedPeople.map( p =>{if(p.userid !== Person.userid)tp.push(p)})
    this.setState({taggedPeople:tp})
    
  }

  //------------------------------------------------------------------------

  handleUploadMemory = () =>{
    let me = this.state
    let Promises = []
    let newMem = {
      memid:0,
      userid:me.user.userid,
      title:me.title,
      description:me.description,
      story:me.story,
      cardtype:0,
      createdon:Date.now(),
      location:''
    }

    console.log('-----------------------------');
    console.log('handleUploadMemory ');
    mem.createMemoryID(me.user.userid,me.title,me.description,me.story)
    .then(memid =>{
      memid = parseInt(memid)
      newMem.memid = memid
      console.log('handleUploadMemory : new memory id : ' + memid);
      this.state.memid = memid
      this.props.onUploading()
      me.taggedPeople.map(person => { Promises.push( mem.addTaggedPerson ( memid,person.userid )) })
      me.memoryClouds.map(cloud  => { Promises.push( mem.addTaggedCloud  ( memid,cloud.id ))})

      console.log('handleUploadMemory : uploading ' + me.memfiles.length + ' files');
      me.memfiles.map((memfile,idx)  =>  { 
        
        if( mem.isSupportedImageFile( memfile.file.name ) ){
          console.log('handleUploadMemory : file ' + memfile.name + ' is an image');
          Promises.push(this.prepAndUploadImageFile ( memfile.file,memfile.isHero,idx)) 

        }else if( mem.isSupportedVideoFile( memfile.file.name )){

          console.log('handleUploadMemory : file ' + memfile.name + ' is a video');
          Promises.push( this.prepAndUploadVideoFile ( memfile,memfile.isHero,idx ) )

        }

      })        
      Promises.push( mem.setMemorySearchWords ( memid,me.searchWords ) )
      
      console.log('Promises length ' + Promises.length);
      Promise.all(Promises).then(values => {
        console.log('handleUploadMemory() - upload complete for memory id ' + newMem.memid );
        this.props.onAddNewMemory(newMem)
      })

       
    },error =>{ alert ( 'this is an error ' + error )})
  }

  //------------------------------------------------------------------------
  
  
  handleAddCloud = (clouds) =>{

    this.handleHideCloudSearch()
    let cloud = clouds[0]
    let cl = this.state.memoryClouds
    
    let newCloudID = parseInt(cloud.value)
    if(!cl.find(newcl => newcl.id === newCloudID)){

      cl.push({
        id:newCloudID,
        name:cloud.label
      })
      cl.reverse()
      this.setState({memoryClouds:cl},this.populateCloudInfo(cl)) 
    }
  }

  //------------------------------------------------------------------------


handleShowPeopleSearch = (evnt,item) =>{ 
  this.setState({ showSelectPeople:true , addPeopleRect:this.state.addPeopleRef.current.getBoundingClientRect() }) 
}

handleHidePeopleSearch = () => {
  
  this.setState({ showSelectPeople:false })
}

//------------------------------------------------------------------------

handleShowcloudSearch = (evnt,item) =>{ 
  this.setState({ showSelectClouds:true , addCloudRect:this.state.addCloudRef.current.getBoundingClientRect() })

}

handleHideCloudSearch = () => {
  
  this.setState({showSelectClouds:false})
}

//------------------------------------------------------------------------
  activeFileisHero =() =>{
    var afile = this.state.activefile
    
    if(afile){
      if(afile.ishero){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
  }
  
  //------------------------------------------------------------------------

  render = () => {
   
  if(this.props.show){

    let memoryContent     = this.renderMemoryContent()
    let carouselControls  = null
    if(this.state.memfiles.length>1) carouselControls  = this.renderCarouselControls()
    
    return(
      <div className= 'backdropStyle'>
        <div className='modalStyle'>
          {memoryContent}   
          {carouselControls}
        </div>
      </div>
    )    
  }else{
    return null
  }    
}

//------------------------------------------------------------------------

renderMemoryContent = () => {
    
  const imageZone   = this.renderImageZone()
  const storyZone   = this.renderStoryZone()
  const detailsZone = this.renderDetailsZone()
  
  
  return (
      <div className='modalrow'>
        {imageZone}
        {storyZone}
        {detailsZone}
      </div>
  )
  
}
  
//------------------------------------------------------------------------

handleSearchWordClick = (itemKey,upState) =>{
  
  const ind = this.state.searchWords.findIndex(item =>{return item.id === itemKey})
  this.state.searchWords[ind].included = upState
  this.setState({searchWords:this.state.searchWords})
  
}

//------------------------------------------------------------------------

renderKeyWords =() =>{

  return (
    <Container  onDrop={e => this.setState({searchWords:this.applyDrag(this.state.searchWords,e)})}>
    
      {
        this.state.searchWords.map((wordItem, idx) => {
          return (
            <Draggable className='wordListItem' key={'k'+idx}>
              <CheckBox 
                itemKey = {wordItem.id}
                onClick = {this.handleSearchWordClick}
                upState = {wordItem.included} 
                downImg = {greycross} 
                upImg   = {tick} 
                label   = {wordItem.keyword}
              />
            </Draggable> 
          )
        })
      }
    </Container>
  )
  
}

//------------------------------------------------------------------------

applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;
  const result = [...arr];
  let itemToAdd = payload;
  if (removedIndex !== null) itemToAdd = result.splice(removedIndex, 1)[0];
  if (addedIndex !== null) result.splice(addedIndex, 0, itemToAdd);
  return result;
};

//------------------------------------------------------------------------

renderTaggedPeople =() =>{
console.log('rendertagged ' + this.state.showSelectPeople);
  const people  = this.state.taggedPeople.map(
    p => {
        return (
          <li 
            className='wordListItem'
            key={'p' + p.userid}>
              <ImageLabel 
                data          = { p   }
                leftImg       = { tag } 
                badge         = { x   } 
                onBadgeClick  = { this.handleDeleteTaggedPerson  }
                label         = { p.firstname + ' ' + p.lastname }/>                                                        
          </li>
        )
      })
      if(this.state.user){
        people.push(      
          <li 
            className='wordListItem'
            key={'a' + this.state.user.userid}>
            <ImageLabel 
              leftImg = { author}
              label =   { this.state.user.firstname + ' ' + this.state.user.lastname}/>
          </li>
        ) 
      }
      people.reverse()   
      if(!this.state.showSelectPeople){
        people.push(      
          <li 
            ref = { this.state.addPeopleRef } 
            className='wordListItem'
            key={'addPerson'}>
            <ImageLabel 
              
              onClick = { this.handleShowPeopleSearch }
              label   = { '+ add' }
            />
          </li>
        )
      }
      
      return people
 
}

//------------------------------------------------------------------------

renderDetails =() => {
  
  return (
      <div>
        <li 
          className='wordListItem'
          key={'location'}><ImageLabel leftImg = {globe} label = {'IMPLEMENT'}/>
        </li>
        <li 
          className='wordListItem'
          key={'sss'}><ImageLabel leftImg = {calendar} label = {mem.getShortDate(this.state.createdon) }/>
        </li>
      </div>
   )
}

//------------------------------------------------------------------------

renderClouds =() => {

  const clouds  = this.state.memoryClouds.map(
    cloud => {
        return (
          <li 
            className='wordListItem'
            key={'cloud' + cloud.id}><ImageLabel 
              data          = { cloud }
              badge         = { x   } 
              onBadgeClick  = { this.handleRemoveFromCloud  }
              leftImg = {cloudIMG} 
              label = {cloud.name}/>                            
          </li>
        )
      })
      
      if(!this.state.showSelectClouds)
        {
          clouds.push(      
            <li 
              ref = { this.state.addCloudRef }
              className='wordListItem'
              key={'addCloud'}>
              <ImageLabel 
                onClick = { this.handleShowcloudSearch }
                label =   { '+ add'}/>
            </li>
          ) 
        }
      return clouds

}

//------------------------------------------------------------------------

renderDropHere = () => {

  return (
    <Dropzone onDrop={acceptedFiles => this.handleDropfiles(acceptedFiles)}>
        {
          ({getRootProps, getInputProps}) => (              
            <div className='dropHere' {...getRootProps()}>
              < div className = 'crossdots'>
                < div className = 'dropText'>FILE DROP</div>
              </div>
            </div>    
          )
        }
      </Dropzone>    
  )

}

//------------------------------------------------------------------------

renderImageZone =()=>{

  let editControls=null
  let af = this.state.activefile
  let tempFile = null
  
  var heroImg = this.activeFileisHero() ? hero : heroOutline;
  
  editControls = 
  <div className = 'imageEditConrols' >
    <img  
      className='closeBtn'
      src = {trash}
      onClick={this.deleteFileFromMemory} 
      />
    <img  
      className='closeBtn'
      src = {heroImg}
      onClick = {this.makeHeroFile}
      />
  </div>

  if(af)
  {
    tempFile = 
    {
      fileurl:af.localurl,
      ishero:af.ishero,
      fileext:mem.getExtension(af.file.name),
      thumburl:af.localurl,
      thumbext:mem.getExtension(af.file.name)
    }
    return (
      <div className='imgcolumn'>
        <MemoryFileViewer 
          memfile={tempFile}
          thumbStyleClass={'memoryModalImage'}
          fileStyleClass={'memoryModalImage'}
        />
        {editControls}
      </div>
    )
  }else{
    
    return (
      <div className='imgcolumn'>
        <MemoryFileViewer 
          memfile           = { null }
          thumbStyleClass   = { 'memoryModalImage'}
          fileStyleClass    = { 'memoryModalImage'}
          alternateRenderer = { this.renderDropHere }
        />
      </div>
    )
  }

    
}

//------------------------------------------------------------------------

onTitleBlur = (e) => {
  const newTitle = e.target.value
  if(newTitle !== this.state.title) this.state.title = newTitle
}
//------------------------------------------------------------------------

onDescriptionBlur = (e) => {
  const newDescription = e.target.value
  if(newDescription !== this.state.description) this.state.description = newDescription

}
//------------------------------------------------------------------------

onStoryBlur = (e) => {
  const newStory = e.target.value
  if(newStory !== this.state.story) this.state.story = newStory
}

//------------------------------------------------------------------------

handleDescriptionChange = (event) => {
  let fulltext = this.state.title + ' ' + this.state.story + ' ' + event.target.value
  this.addToSearchWords(fulltext)
  this.setState({description:event.target.value})
}

handleTitleChange       = (event) => {
  let fulltext = this.state.description + ' ' + this.state.story + ' ' + event.target.value
  this.addToSearchWords(fulltext) 
  this.setState({title:event.target.value})
}

handleStoryChange       = (event) => {
  let fulltext = this.state.description + ' ' + this.state.title + ' ' + event.target.value
  this.addToSearchWords(fulltext)
  this.setState({story:event.target.value})
}

addToSearchWords = (textContent) =>{
  let addarray = this.state.searchWords
  let addarray2 = []  
  let words = WordExctractor.extract(textContent,
                                      {
                                          language:"english",
                                          remove_digits: true,
                                          return_changed_case:true,
                                          remove_duplicates: true
                                      })
    
  // add any new words that exist in the story
  words.map(word =>{
      if(!this.searchWordExists(word)){
        addarray.push({included:true,keyword:word,strength:0})       
      }      
  })

  // remove any search words that now longer exist in the story
  addarray.map(w =>{    
    if(words.find(word => w.keyword === word) !== undefined){      
      addarray2.push({included:w.included,keyword:w.keyword,strength:w.strength})
    }   
  })

  this.setState({searchWords:addarray2})  
}

//------------------------------------------------------------------------

searchWordExists = (word) => {
  return this.state.searchWords.find(wordItem => word === wordItem.keyword)    
}

//------------------------------------------------------------------------

renderStoryZone = () =>{
  const mem = this.state
  
    return (
      <div className = 'infoColumn'>
        <input 
            onBlur = { this.onTitleBlur } className='input-reset titleEdit' onChange = { this.handleTitleChange }
            type="text"  defaultValue = { mem.title } placeholder='Title' id="title" />
        <input 
            onBlur = {this.onDescriptionBlur} className='input-reset descriptionEdit'  onChange = { this.handleDescriptionChange }
            type="text"  defaultValue = { mem.description } placeholder='Description' id="description" />
        <textarea
            onBlur   = { this.onStoryBlur } className='input-reset storyEdit' onChange = { this.handleStoryChange } 
            type="text"  defaultValue = { mem.story } placeholder='Description' id="description" /> 
      </div> 
    )
  
}

//------------------------------------------------------------------------

renderCornerControls =() =>{
  
  return (
    <div className='footer'>                        
      <img  
        className='closeBtn'                   
        src = {x}
        onClick={this.onHide} />
      <img  
        className='closeBtn'                   
        src = {cloudupload}
        onClick={this.handleUploadMemory} />
    </div>
  )
}

//------------------------------------------------------------------------

renderPeopleDropdown = () => {

  if(this.state.showSelectPeople){
    
    return (
      // cRect,people, callBack
      DropSearch.peopleDropSearch(
            this.state.addPeopleRect,
            this.state.cloudPeople,
            this.handleAddTaggedPerson
      )
  )
  }else{
    return null
 }
}

//------------------------------------------------------------------------

renderCloudDropdown = () => {

 
  if(this.state.showSelectClouds){
      return (
        // cRect,clouds, selected,showmulti,keepInList,callBack,userid,
        DropSearch.cloudDropSearch(
              this.state.addCloudRect,
              this.state.userClouds,
              null,
              true,
              true ,
              this.handleAddCloud,
              this.state.userid              
        )
    )
    }else{
      return null
   }
}

//------------------------------------------------------------------------


renderDetailsZone = () => {

  const keywords     = this.renderKeyWords()
  const people       = this.renderTaggedPeople()
  const details      = this.renderDetails()
  const clouds       = this.renderClouds()
  const cornerCtrls  = this.renderCornerControls()
  
  const cloudDropdown   = this.renderCloudDropdown()
  const peopleDropdown  = this.renderPeopleDropdown()

  return (
    <div className = 'detailsColumn'>
      <div className = 'z40'> 
        <h4>Tags </h4>
        <ul className='keyWordList scroll' >  { keywords } </ul>
      </div>
      <div className = 'z25'>
        <h4>People</h4>
        <ul className='peopleList scroll' >   { people   } </ul>
      </div>
      <div className = 'z15'>
        <h4>Clouds</h4>
        <ul className='cloudList scroll' >    { clouds   } </ul>
      </div>
      <div className = 'z15'>
        <h4>Details</h4>
        <ul className='detailsList ' >        { details  } </ul>
      </div>
      {cloudDropdown}
      {peopleDropdown}
      {cornerCtrls}              
    </div>  
  )
}

//------------------------------------------------------------------------

handleDropfiles = async (acceptedFiles) =>{
  
  const reader = new FileReader()
  
  acceptedFiles.forEach((file) => {
    console.log('handleDropFile onload ' + JSON.stringify(file));
    
    reader.onload = () => {
      
      
      if(mem.canHandleDroppedFile(file.name))
      {
        console.log('dropped file is valid : ' + file.name);
        let mfs = this.state.memfiles
        let newfile = 
        {
            file:file,
            localurl:reader.result,
            buffer: mem.dataURItoBlob(reader.result),
            isHero:false
        }
        mfs.push(newfile)

        if(!this.state.activefile) {
          newfile.isHero = true
          this.state.activefile = newfile
        }
        this.setState({memfiles:mfs})

      }else{
        alert('File type ' + mem.getExtension(file.name) + ' not yet implemented' )
      }
    }
  reader.readAsDataURL(file)

  })
}

//------------------------------------------------------------------------

prepAndUploadImageFile = (file, isHero, uniqueID)=>{

  console.log('prepAndUploadImageFile : file ' + file.name )
  let commonfileName = this.state.user.userid + '-' + this.state.memid + '-' + Date.now()
  let ext = mem.getExtension(file.name)
  let fname = commonfileName + '-' + uniqueID + '-original'  + '.' + ext
  let tname = commonfileName + '-' + uniqueID + '-thumb'     + '.' + ext
  let filebuffer = null
  
  let memfile = {
    id:0,
    memid:this.state.memid,
    fileurl:'',
    ishero:false,
    fileext:ext,
    thumburl:'',
    thumbext:ext,
  }
  
  return new Promise((resolve,reject) =>{
  
    mem.compressImage(file,0.9)
        .then(result =>{
          if(result.success){
            filebuffer = result.data
            mem.resizeImage(filebuffer,1500)
            .then(result =>{
              if(result.success){ 
              mem.uploadFile(tname,result.data)
              .then(result =>{
                if(result.success){
                  memfile.thumburl = result.awsurl
                  mem.uploadFile(fname,filebuffer)
                  .then(result =>{
                    if(result.success){
                      memfile.fileurl=result.awsurl
                      console.log('prepUpload - memid    ' + this.state.memid );
                      console.log('prepUpload - fileurl  ' + memfile.fileurl  );
                      console.log('prepUpload - thumburl ' + memfile.thumburl );
                      mem.addFileToMemory({
                          originalURL:memfile.fileurl,
                          thumbURL:memfile.thumburl
                      },isHero,this.state.memid)
                      .then(result => {
                        if(result.success){
                          resolve(result)
                        }else{
                          reject('failed to add file to memory')
                        }
                      })
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

//------------------------------------------------------------------------

prepAndUploadVideoFile = (mfile, isHero, uniqueID)=>{

  console.log('prepAndUploadVideoFile : file ' + mfile.file.name )
  let commonfileName = this.state.user.userid + '-' + this.state.memid + '-' + Date.now()
  let ext = mem.getExtension(mfile.file.name)

  let vFolder = commonfileName + '-' + uniqueID
  let originalfile    = commonfileName + '-' + uniqueID + '-stream'    + '.' + ext
  
  let memfile = {
    id        : 0,
    memid     : this.state.memid,
    fileurl   : '',     // this will be the original
    ishero    : false,
    fileext   : ext,    
    thumburl  : '',    // this will be the transcoded version
    thumbext  : '',
  }
  
  return new Promise((resolve,reject) =>{
    
    mem.uploadFile(originalfile,mfile.buffer)
    .then(result =>{
      console.log('prepAndUploadVideoFile : uploadFile ' + originalfile + ' was successfull ? ' + result.success )
      if(result.success){
        memfile.fileurl = result.awsurl
        mem.transcodeVideoToHLS( originalfile , vFolder )
        .then(result =>{
          console.log('prepAndUploadVideoFile : transcodeVid.. ' + vFolder+'/'+originalfile + ' was successfull ? ' + result.success )
          if(result.success){
            memfile.thumburl = result.data
            memfile.thumbext = 'm3u8'

            console.log('prepUpload - memid    ' + this.state.memid );
            console.log('prepUpload - fileurl  ' + memfile.fileurl  );
            console.log('prepUpload - thumburl ' + memfile.thumburl );

            mem.addFileToMemory({
                originalURL:memfile.fileurl,
                thumbURL:memfile.thumburl
            },isHero,this.state.memid)
            .then(result => {
              console.log('prepAndUploadVideoFile : addfiletoMemory was successfull ? ' + result.success )
              if(result.success){
                resolve(result)
              }else{
                reject('failed to add file to memory')
              }
            })
          }
        })
      }
    })        
  })
}

//------------------------------------------------------------------------

renderCarouselControls = () => {

  const mem = this.state
  const mfiles = mem.memfiles

  let thumbs = mfiles.map((mfile,index) =>{
      return(<img key={'thumb'+index} className='thumb' src = {mfile.localurl} onClick={(index) =>{}}/>)})
  
  return (
    <div className='controlbox'>
      <img className='closeBtn' src = {left} onClick={this.goBack} />                  
            <div className='thumbArrayEdit' >
              {thumbs}
            </div>        
      <img className='closeBtn' src = {right} onClick={this.goForward} /> 
    </div>
  )  
}

//------------------------------------------------------------------------

goBack = (e) => {
  
  let ubound = this.state.memfiles.length-1
  if(this.state.memfileIndex === 0){
    this.state.memfileIndex = ubound 
  }else{
    this.state.memfileIndex--
  }
  this.setState({activefile:this.state.memfiles[this.state.memfileIndex]})  
}

goForward = (e) => {
  
    let ubound = this.state.memfiles.length-1
    if(this.state.memfileIndex === ubound){
      this.state.memfileIndex = 0 
    }else{
      this.state.memfileIndex++
    }
    this.setState({activefile:this.state.memfiles[this.state.memfileIndex]})
  
}

};  

export default NewMemoryModal;
