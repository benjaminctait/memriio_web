import React from 'react';
import greycross from '../images/x-grey.png'
import tick from '../images/tick.png'
import tag from '../images/tag.png'
import globe from '../images/outline-globe.png'
import calendar from '../images/calendar.png'
import key from '../images/key.png'
import author from '../images/author.png'
import x from '../images/x-symbol.png'
import edit from '../images/edit.png'
import left from '../images/chevron-left.png'
import right from '../images/chevron-right.png'
import trash from '../images/trash.png'
import hero from '../images/hero-full.png'
import heroOutline from '../images/hero-outline-grey.png'
import cloudIMG from '../images/cloud.png'
import MemoryFileViewer from '../memoryviewer/memoryImageViewer'
import * as mem from '../memriioserver'
import * as DropSearch from '../dropsearch/dropsearch'

import WordExtractor from 'keyword-extractor'
import { Container, Draggable} from 'react-smooth-dnd'
import Dropzone,{useDropzone} from 'react-dropzone'

import './memorymodal.css'

import {CheckBox,SubTag,ImageLabel} from '../buttons/buttons'

class MemoryModal extends React.Component{
  constructor(props) {
    super(props);
    this.state.addPeopleRef = React.createRef();
    this.state.addCloudRef = React.createRef();
  }

    
    state ={
        memory:null,
        taggedPeople:[],
        memoryClouds:[],
        searchWords:[],         
        memfiles:null,
        cloudPeople:[],
        userClouds:[],
        activefile:null,
        author:null,
        memfileIndex:0,
        editMode:false,

        showSelectPeople:false,
        showSelectClouds:false,

        addPeopleRef:null,
        addPeopleRect:null,

        addCloudRef:null,
        addCloudRect:null,
        
    }
   

  onHide = () =>{
    this.state.editMode = false
    this.props.onHideModal(this.props.memory)
  }

//---------------------------------------------------------------------------------

  componentDidUpdate = (prevProps,prevState) =>{
    
    if(this.props.memory)
    {
      if(!prevProps.memory || this.props.memory.memid !== prevProps.memory.memid){

        

        this.populateMemoryFiles ( this.props.memfiles )
        mem.getUser              ( this.props.memory.userid,(author => { this.setState({author:author})}))
        mem.getTaggedPeople      ( this.props.memory.memid,(people => { this.setState({taggedPeople:people})}))
        mem.getMemoryClouds      ( this.props.memory.memid,(clouds => { this.populateCloudInfo(clouds)}))
        mem.getMemorySearchWords ( this.props.memory.memid,(words  => { this.populateSearchWords(words)}))
        mem.getUserClouds        ( this.props.memory.userid,(clouds => { this.setState({userClouds:clouds})}))
        
      }      
    }
  }

//---------------------------------------------------------------------------------

  getHeroFile = () => {
    this.state.memfileIndex=0
    if(this.state.memfiles){
      let hero = this.state.memfiles[0]
      this.state.memfiles.map((memfile,index)=> {
  
          if(memfile.ishero){         
              this.state.memfileIndex = index            
              hero = memfile
          }
      })
      return hero
    }else{
      return null
    }
   
  }
//---------------------------------------------------------------------------------

  populateMemoryFiles = (memfiles) => {

    this.state.memfiles = memfiles
    this.setState({
        activefile:this.getHeroFile()
    })
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

  toggleEditMode =() =>{
    this.setState({editMode:!this.state.editMode , showSelectClouds:false , showSelectPeople:false })
    
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
      mem.addTaggedPerson(this.props.memory.memid,Person.userid)
    }
  }

  //------------------------------------------------------------------------

  handleRemoveFromCloud = ( Cloud ) =>{
    let cl = []
    this.state.memoryClouds.map(cloud =>{if(cloud.id !== Cloud.id) cl.push(cloud)})
    mem.deleteTaggedCloud(this.props.memory.memid,Cloud.id)
    .then(result =>{
      this.populateCloudInfo(cl)
    })

  }

  //------------------------------------------------------------------------

  handleDeleteTaggedPerson = (Person) =>{
    let tp = []
    this.state.taggedPeople.map( p =>{if(p.userid !== Person.userid)tp.push(p)})
    this.setState({taggedPeople:tp})
    mem.deleteTaggedPerson(this.props.memory.memid,Person.userid)
  }

  //------------------------------------------------------------------------

  handleAddCloud = (clouds) =>{
    let cloud = clouds[0]
    let cl = this.state.memoryClouds
    let newCloudID = parseInt(cloud.value)
    this.handleHideCloudSearch()
    if(!cl.find(newcl => newcl.id === newCloudID)){

      cl.push({
        id:newCloudID,
        name:cloud.label
      })
      cl.reverse()
      this.setState({memoryClouds:cl})
      mem.addTaggedCloud(this.props.memory.memid,newCloudID)
      .then(result => {
        this.populateCloudInfo(cl)
        
      })
    }
  }
  
  //------------------------------------------------------------------------

  handleShowPeopleSearch = (evnt,item) =>{ 
    this.setState({showSelectPeople:!this.state.showSelectPeople,addPeopleRect:this.state.addPeopleRef.current.getBoundingClientRect()}) 
  }

  handleHidePeopleSearch = () => {
    
    this.setState({showSelectPeople:false})
  }

  //------------------------------------------------------------------------
  
  handleShowcloudSearch = (evnt,item) =>{ 
    this.setState(prevState => ({showSelectClouds:!prevState.showSelectClouds,addCloudRect:this.state.addCloudRef.current.getBoundingClientRect()}))

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

  render(){
    
   
    if(this.props.show){
      
        let memoryContent = this.renderMemoryContent()
        let carouselControls = this.renderCarouselControls()
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
  console.log('heandlesearchwordClick ' + JSON.stringify(this.state.searchWords[ind]))
  mem.updateMemword(this.state.searchWords[ind])
  this.setState({searchWords:this.state.searchWords})
  
}

//------------------------------------------------------------------------

renderKeyWords =() =>{
 
  if(this.state.editMode)
  {
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
  }else{
    return (
      
        <div>
        {
          this.state.searchWords.map((wordItem, idx) => {
            if(wordItem.included)
            { 
              return (
                <li className='wordListItem' key={'k'+idx}>
                  <ImageLabel leftImg = {key} label = {wordItem.keyword}/>
                </li> 
              )
            }
          })
        }
        </div>
    )
  }
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
let plus = null
  if(this.state.editMode){
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
        if(this.state.author){
          people.push(      
            <li 
              className='wordListItem'
              key={'a' + this.state.author.userid}>
              <ImageLabel 
                leftImg = { author}
                label =   { this.state.author.firstname + ' ' + this.state.author.lastname}/>
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
  }else{
    const people  = this.state.taggedPeople.map(
      p => {
          return (
            <li 
              className='wordListItem'
              key={'t' + p.userid}><ImageLabel leftImg = {tag} label = {p.firstname+' '+p.lastname}/>                                                        
            </li>
          )
        })
        if(this.state.author){
          people.push(      
            <li 
              className='wordListItem'
              key={'a' + this.state.author.userid}>
              <ImageLabel 
                leftImg = {author}
                label = {this.state.author.firstname + ' ' + this.state.author.lastname}/>
            </li>
          ) 
        }
        people.reverse()   
    return people
  }
}

//------------------------------------------------------------------------

renderDetails =() => {
  
  if(this.props.memory){    
   return (
      <div>
        <li 
          className='wordListItem'
          key={'location'}><ImageLabel leftImg = {globe} label = {this.props.memory.location}/>
        </li>
        <li 
          className='wordListItem'
          key={'sss'}><ImageLabel leftImg = {calendar} label = {mem.getShortDate(this.props.memory.createdon) }/>
        </li>
      </div>
   )
  }
  
}

//------------------------------------------------------------------------

renderClouds =() => {
  
  if(this.state.editMode ){
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
  }else{
    const clouds  = this.state.memoryClouds.map(
      cloud => {
          return (
            <li 
              className='wordListItem'
              key={'cloud' + cloud.id}><ImageLabel leftImg = {cloudIMG} label = {cloud.name}/>                                                        
            </li>
          )
        })        
        return clouds
  }
  
}

//------------------------------------------------------------------------

renderDropHere = () => {

  return (
    <div className='dropHere'>
      < div className = 'crossdots'>

      </div>
    </div>
)

}

//------------------------------------------------------------------------

renderImageZone =()=>{
  let editControls=null
  let imagezone = null

  if(this.state.editMode ){

    let heroImg = this.activeFileisHero() ? hero : heroOutline;
    let frender  = this.state.activefile ? null : this.renderDropHere


    editControls = 
    <div className = 'imageEditConrols' >
      <img  
        className='closeBtn'
        src = {trash}
        onClick={this.deleteFileFromMemory} 
        />
      <img  
        className='closeBtn'
        src     = { heroImg } 
        onClick = { this.makeHeroFile}
       />
    </div>

    return (
      <Dropzone onDrop={acceptedFiles => this.handleDropfiles(acceptedFiles)}>
        {
          ({getRootProps, getInputProps}) => (              
            <div className='imgcolumn' {...getRootProps()} >
              <MemoryFileViewer 
                memfile           = { this.state.activefile }
                thumbStyleClass   = { 'memoryModalImage'    }
                fileStyleClass    = { 'memoryModalImage'    }
                alternateRenderer = { frender }
              />
              {editControls}
            </div>          
          )
        }
      </Dropzone>
    )
  }else{
    return (
      <div className='imgcolumn'>
        <MemoryFileViewer 
          memfile         = { this.state.activefile }
          thumbStyleClass = { 'memoryModalImage'    }
          fileStyleClass  = { 'memoryModalImage'    }
        />       
      </div>
    )
  }

  
}

onTitleBlur = (e) => {
  
  const newTitle = e.target.value
  this.props.memory.title = newTitle
  mem.updateTitle(this.props.memory.memid,newTitle)
  mem.setMemorySearchWords(this.props.memory.memid,this.state.searchWords)    
  
}
//------------------------------------------------------------------------

onDescriptionBlur = (e) => {
  
  const newDescription = e.target.value
  this.props.memory.description = newDescription
  mem.updateDescription(this.props.memory.memid,newDescription)
  mem.setMemorySearchWords(this.props.memory.memid,this.state.searchWords)
    
}
//------------------------------------------------------------------------

onStoryBlur = (e) => {
 
  const newStory = e.target.value
  this.props.memory.story = newStory
  mem.updateStory(this.props.memory.memid,newStory)    
  mem.setMemorySearchWords(this.props.memory.memid,this.state.searchWords)

}

//------------------------------------------------------------------------

handleDescriptionChange = (event) => {
  let fulltext = this.props.memory.title + ' ' + this.props.memory.story + ' ' + event.target.value
  this.addToSearchWords(fulltext)
  this.props.memory.description = event.target.value
}

handleTitleChange       = (event) => {

  let fulltext = this.props.memory.description + ' ' + this.props.memory.story + ' ' + event.target.value
  this.addToSearchWords(fulltext) 
  this.props.memory.title = event.target.value
}

handleStoryChange       = (event) => {
  let fulltext = this.props.memory.description + ' ' + this.props.memory.title + ' ' + event.target.value
  this.addToSearchWords(fulltext)
  this.props.memory.story = event.target.value
}

addToSearchWords = (textContent) =>{
  let addarray = this.state.searchWords
  let addarray2 = []  
  let words = WordExtractor.extract(textContent,
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
  const mem = this.props.memory

  if( this.state.editMode )
  {
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
  }else{
    return (
      <div className = 'infoColumn'>
        <h4>{ mem.title } </h4>
        <p className="f6 lh-copy i measure mt2 mid-gray">{ mem.description }</p>
        <p className="f6 lh-copy measure mt2 black"> { mem.story } </p>
      </div>  
    )
  }
  
}

//------------------------------------------------------------------------

renderCornerControls =() =>{
  let editBtn = null
  let deleteBtn = null
  if(this.userIsAuthorisedToEdit()){
    editBtn=
      <img  
      className='closeBtn'                   
      src = {edit}
      onClick={this.toggleEditMode} />

    deleteBtn=
    <img  
    className='closeBtn'                   
    src = {trash}
    onClick={this.handleDeleteMemory} />
    
  }
  return (
    <div className='footer'>    
      {deleteBtn}   

      <img  
        className='closeBtn'                   
        src = {x}
        onClick={this.onHide} />

      {editBtn}

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

  const keywords        = this.renderKeyWords()
  const people          = this.renderTaggedPeople()
  const details         = this.renderDetails()
  const clouds          = this.renderClouds()
  const cornerCtrls     = this.renderCornerControls()

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
    
    reader.onload = () => {

      console.log('onload ' + file.name);


      if( mem.isSupportedImageFile( file.name ) ){
        this.prepAndUploadImageFile ( file,false,1)

      }else if( mem.isSupportedVideoFile( file.name )){
        this.prepAndUploadVideoFile ( file,false,1 ) 

      }else{
        alert('File type ' + mem.getExtension(file.name) + ' not yet implemented' )
      }
    }

  reader.readAsArrayBuffer(file) 

  })
}

//------------------------------------------------------------------------

handleDeleteMemory = ( ) => {
 
 this.props.onDeleteMemory(this.props.memory)
 this.onHide()
}

//------------------------------------------------------------------------

prepAndUploadImageFile = (file)=>{
 
  let commonfileName = this.state.author.userid + '-' + this.props.memory.memid + '-' + Date.now()
  let ext = mem.getExtension(file.name)
  let fname = commonfileName + '-original'  + '.' + ext
  let tname = commonfileName + '-thumb'     + '.' + ext
  let filebuffer = null
  let newMemfiles = this.state.memfiles
  let memfile = {
    id:0,
    memid:this.props.memory.memid,
    fileurl:'',
    ishero:false,
    fileext:ext,
    thumburl:'',
    thumbext:ext,
  }
  
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
                newMemfiles.push(memfile)
                this.setState({memfiles:newMemfiles})
                mem.uploadFile(fname,filebuffer)
                .then(result =>{
                  if(result.success){
                    let last = this.state.memfiles.length-1
                    this.state.memfiles[last].fileurl=result.awsurl
                    mem.addFileToMemory({
                        originalURL:this.state.memfiles[last].fileurl,
                        thumbURL:this.state.memfiles[last].thumburl
                    },false,this.props.memory.memid)
                    .then(result => {
                      if(result.success){
                        console.log('file upload success ! : new memory id :' + JSON.stringify(result));

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
}

//------------------------------------------------------------------------

prepAndUploadVideoFile = (file, isHero, uniqueID)=>{

  console.log('prepAndUploadVideoFile : file ' + file.name )
  let commonfileName = this.state.user.userid + '-' + this.state.memid + '-' + Date.now()
  let ext = mem.getExtension(file.name)

  let vFolder = commonfileName + '-' + uniqueID
  let originalfile    = commonfileName + '-' + uniqueID + '-stream'    + '.' + ext
  
  let memfile = {
    id          : 0,
    memid       : this.state.memid,
    fileurl     : '',     // this will be the original
    ishero      : false,
    fileext     : ext,    
    thumburl    : '',    // this will be the transcoded version
    thumbext    : '',
  }
  
  return new Promise((resolve,reject) =>{
    
    mem.uploadFile(originalfile,file.result)
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

  return (
    <div className='controlbox'>
      <img className='closeBtn' src = {left} onClick={this.goBack} /> 
      
      <img className='closeBtn' src = {right} onClick={this.goForward} /> 
    </div>
  )
}

//------------------------------------------------------------------------

goBack = (e) => {
  if(this.state.memfiles)
  {
    let ubound = this.state.memfiles.length-1
    if(this.state.memfileIndex === 0){
      this.state.memfileIndex = ubound 
    }else{
      this.state.memfileIndex--
    }
    this.setState({activefile:this.state.memfiles[this.state.memfileIndex]})
  }
}

//------------------------------------------------------------------------

goForward = (e) => {
  if(this.state.memfiles)
  {
    let ubound = this.state.memfiles.length-1
    if(this.state.memfileIndex === ubound){
      this.state.memfileIndex = 0 
    }else{
      this.state.memfileIndex++
    }
    this.setState({activefile:this.state.memfiles[this.state.memfileIndex]})
  }    
}

};  

export default MemoryModal;