import React from 'react';
import * as mem from '../memriioserver'
import './admin.css'
import Modal from 'react-modal'
import {Grid,Input} from 'react-spreadsheet-grid'
import * as DropSearch from '../dropsearch/dropsearch'


class Admin extends React.Component{

state ={
  clouds:[],
  users:[],
  memberships:[],
  personModalIsOpen:false,
  columns:null,
  newuser:null,
  modalState:'add'
}

//---------------------------------------------------------------

componentDidMount(){
  console.log('Administration.componentDidMount ' )
  this.state.newuser =
    {
      userid:0,
      firstname:'',
      lastname:'',
      email:'',
      password:''
    }
  mem.getAllClouds().then(clouds => {
    this.setState({clouds:clouds})
    this.handleShowAllUsers()
  })
}

//---------------------------------------------------------------

handleCloudSearch = (e) => {
  console.log(e.target.value);
  
}

//---------------------------------------------------------------

handleSelectCloud = ( cloud ) => {
  console.log(cloud.name);
  let clouds = []
  clouds.push(cloud)
  mem.getCloudPeople(clouds,null).then(people => {this.setState({people:people})})
  
}

//---------------------------------------------------------------

handleShowAllUsers = () =>{
  let ppl = null
  mem.getAllUsers().then(people=> {
    ppl = people
    mem.getCloudMemberships().then(result =>{
      console.log('memberships');
      console.log(mem.stry(result.data));      
      this.setState({people:ppl,memberships:result.data})
    })})
}
//---------------------------------------------------------------

handlePeopleSearch = ( ) => { 

}
//---------------------------------------------------------------

handleSelectPerson = (Person) => {

}

//---------------------------------------------------------------

handleUserUpdateClouds = (clouds,userid) =>{
  let cloudids = []
  clouds.map(cloud =>{cloudids.push( parseInt(cloud.value))})
  console.log('handleUserUpdateClouds for user : ' + userid + ' clouds : ' + mem.stry(cloudids));
  mem.setUserMemberships( userid , cloudids )
  
}

//---------------------------------------------------------------

render(){
 
  const cloudpeople     = this.renderCloudPeople()
  const addPersonModel  = this.renderAddPersonModal()
    return (
      <div className='some-page-wrapper'>
        {addPersonModel}
        <div className ='headerrow'></div>               
          {cloudpeople}        
      </div>
    )
}

//---------------------------------------------------------------

renderCloudPeople = () =>{
  
  if(this.state.people){
    if(!this.state.columns) this.state.columns = this.initColumns()
    
    return ( 
      <div className='admin-zone '>
        <div className='floatLeft headtext'>Users</div>
        <div className = 'searchHeader'>
          <input className='textBox' placeholder='..people search' onChange={this.handlePeopleSearch}/>
          <input className='textBox' placeholder='..cloud filter' onChange ={this.handleCloudSearch}/>
          <button id='newuserbtn' className='newButton' onClick={this.handleShowAddPersonModel}>New User</button>
        </div>
        
        <div className='floatLeft'>
          <Grid 
            rows={this.state.people}
            columns = {this.state.columns}            
            getRowKey={row => row.userid}
            isColumnsResizable
            onColumnResize = {this.onColumnResize}
          />
        </div>
      </div>
    )
  }else{
    return null
  }
  

}

//--------------------------ADD PERSON MODAL -----------------------------
//--------------------------================------------------------------

handleShowAddPersonModel  = ()  =>  { this.setState({modalState:'add',personModalIsOpen:true})}
handleFirstNameChange     = (e) =>  { this.state.newuser.firstname = e.target.value }
handleLastNameChange      = (e) =>  { this.state.newuser.lastname  = e.target.value }
handleEmailChange         = (e) =>  { this.state.newuser.email     = e.target.value }
handlePasswordChange      = (e) =>  { this.state.newuser.password  = e.target.value }
handleCloseModal          = ()  =>  { this.setState({personModalIsOpen:false})}

//-------------------------------------------------------------------------

handleDeleteUser          = ()  =>  {
  let ppl = this.state.people
  let idx = ppl.findIndex((person) => {return person.userid === this.state.newuser.userid})
  ppl.splice( idx , 1 )
  this.setState({people:ppl,personModalIsOpen:false})
  mem.deleteUser(this.state.newuser)
  .then(result=>{},error=>{ alert('there was a problem trying to delete user')})
}

//-------------------------------------------------------------------------

handleAddPerson           = ()  =>  { 
  const n = this.state.newuser 
 
  if(n.firstname === '' || n.lastname === '' || n.email===''){
    alert('Cannot have blank fields')
  }else if (!mem.isEmailFormat(n.email)) {
    alert('email format is invalid')
  }else{    
    mem.getUserByEmail(n.email)
    .then(result =>{
        alert('A user with this email already exists')
      },error=>{
        mem.setNewUser(n)
        .then(result=>{
          console.log('new user added : ' + mem.stry(result));
          this.setState({personModalIsOpen:false})
          },error=>alert('Opps ! something went wrong ' + mem.stry(error)))
      })               
  }    
} 
  
 

//-------------------------------------------------------------------------

renderAddPersonModal (){
let content = null
let user = this.state.newuser

if(this.state.modalState === 'add'){
  content = 
  <div>
    <div className='headtext' >Add Person</div>
    <div className='labelpair'>
      <label className='labeltext spacer' htmlFor="name">First Name</label>
      <input className='textBox mw'  placeholder='...first Name'id='firstname' onChange={this.handleFirstNameChange}/>  
    </div>

    <div className='labelpair'>
      <label className='labeltext spacer' htmlFor="name">Last Name</label>
      <input className='textBox mw'  placeholder='...last Name' id='lastname' onChange={this.handleLastNameChange}/>  
    </div>

    <div className='labelpair'>
      <label className='labeltext spacer' htmlFor="name">Email</label>
      <input className='textBox mw'  placeholder='...email' id='email' onChange={this.handleEmailChange}/>  
    </div>

    <div className='labelpair'>
      <label className='labeltext spacer' htmlFor="name">Password</label>
      <input  className='textBox mw' placeholder='...password' id='password' onChange={this.handlePasswordChange}/>  
    </div>
    <div className='spacer'></div>
    <div className='modalfooter '>
      <button className='newButton small spacer' onClick={this.handleCloseModal}> Cancel </button>
      <button className='newButton small spacer' onClick={this.handleAddPerson}> Add </button>
    </div>   
  </div> 
}else{ 
  content = 
  <div>
    <div className='headtext' >Delete Person</div>
    <div className='labelpair'>
      <label className='labeltext spacer' htmlFor="name">First Name</label>
      <input className='textBox mw' contentEditable={false} value={user.firstname} id='firstname' />  
    </div>

    <div className='labelpair'>
      <label className='labeltext spacer' htmlFor="name">Last Name</label>
      <input className='textBox mw' contentEditable={false} value={user.lastname} id='firstname' />  
    </div>

    <div className='labelpair'>
      <label className='labeltext spacer' htmlFor="name">Email</label>
      <input className='textBox mw' contentEditable={false} value={user.email} id='firstname' />  
    </div>

    <div className='labelpair'>
      <label className='labeltext spacer' htmlFor="name">Password</label>
      <input className='textBox mw' contentEditable={false} value='********' id='firstname' />  
    </div>
    <div className='spacer'></div>
    <div className='modalfooter '>
      <button className='newButton small spacer' onClick={this.handleCloseModal}> Cancel </button>
      <button className='newButton small spacer' onClick={this.handleDeleteUser}> Delete </button>
    </div>   
  </div> 
  
} 

  return(
    <Modal
          isOpen          = {this.state.personModalIsOpen}          
          onRequestClose  = {this.closeModal}
          className       = 'modal'
          overlayClassName= 'backdropStyle'
          contentLabel    = "Example Modal"
    >{content}</Modal>    
  )
  
}

//---------------------------------------------------------------

onColumnResize = (widthValues) => {
  
  const newColumns = [].concat(this.state.columns)
  Object.keys(widthValues).forEach((columnId) => {
      const column = this.state.columns.find(({ id }) => id === columnId);
      column.width = widthValues[columnId]
  })
  this.setState({columns:newColumns})
}

//---------------------------------------------------------------
handleShowDeleteUser = (user) => {

  this.setState({modalState:'delete', newuser:user, personModalIsOpen:true})
}

//---------------------------------------------------------------

getUserMemberships = ( userid ) =>{
  let clouds=[]

  if(this.state.memberships){
    this.state.memberships.map(membership =>{
      if (membership.userid === userid){
        clouds.push({
          id:membership.id,
          name:membership.name})}})
  }
  
  return clouds
}

//---------------------------------------------------------------

initColumns = () =>{
  return(
    [
      {
        id: 'photo',
        title: () => 'Photo',
        value: (row, { focus }) => {
            return ( <img src={row.avatar} /> )
        },
        width:5,
      }, {
        id: 'userid',
        title: () => 'Id',
        value: (row, { focus }) => {
          return ( <Input value={row.userid} focus={focus} /> )
        },
        width:3,
      }, {
        id: 'firstname',
        
        title: () => 'First Name',
        value: (row, { focus }) => {
          return ( <Input value={row.firstname} focus={focus} /> )
        },
        width:10,
      }, {
        id: 'lastname',
        title: () => 'Last Name',
        value: (row, { focus }) => {
          return ( <Input value={row.lastname} focus={focus} /> )
        },
        width:10,
      }, {
        id: 'email',
        title: () => 'email',
        value: (row, { focus }) => {
          return ( <Input value={row.email} focus={focus} /> )
        },
        width:12,
      }, {
        id: 'username',
        title: () => 'Username',
        value: (row, { focus }) => {
          return ( <Input value={row.email} focus={focus} /> )
        },
        width:12,
      }, {
        id: 'mobile',
        title: () => 'mobile',
        value: (row, { focus }) => {
          return ( <Input value={row.mobile} focus={focus} /> )
        },
        width:10,
      }, {
        id: 'joined',
        title: () => 'Joined',
        value: (row, { focus }) => {
          return ( <Input value={ mem.getShortDate(row.joined)} focus={focus} /> )
        },
        width:8,
      }, {
        id: 'clouds',
        title: () => 'Clouds',
        value: (row, { focus }) => {
          let selected = this.getUserMemberships(row.userid)                
          return ( DropSearch.cloudDropSearch(null,this.state.clouds,selected,true,false ,this.handleUserUpdateClouds,row.userid) )
          },
        width:24,
      },{
        id: 'delete',
        title: () => 'Delete',
        
        value: (row, { active,focus }) => {
          return ( <button className={'newButton small2'} active={active} focus={focus} onClick={()=>this.handleShowDeleteUser(row)}>Delete</button> )
          },
        width:6,
      }
    ]
  )
}

//---------------------------------------------------------------

}
export default Admin