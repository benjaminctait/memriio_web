import React from 'react';
import Navigation from './components/navigation/navigation.js';
import CardCollection from './components/cardcollection/cardcollection.js';
import Signin from './components/signin/signin.js';
import Register from './components/register/register.js';
import Admin from './components/admin/admin.js'
import * as mem from './components/memriioserver.js'
import './App.css';


class App extends React.Component {
  constructor(){
    super();
    
    this.state ={
      route: 'signin',
      isSignedIn: false,
      activeMemory:null,
      cloudSelection:[],
      user:{
        id:'',
        name:'',
        email:'',
        joined:''
      },
      searchResult:{
        memories:[]
      }
    }
  }

//---------------------------------------------------------------------------------

  userSignedin = () => {
    return this.state.isSignedIn;
  }

//---------------------------------------------------------------------------------

  loadUser = (data) => {
    
    this.setState({ user : {  userid    : data.userid, 
                              firstname : data.firstname,
                              lastname  : data.lastname,
                              email     : data.email,
                              joined    : data.joined,
                              cloudSelection : this.extractSelectedClouds(data.webclouds)
                            }
      })
      
  } 
//---------------------------------------------------------------------------------

extractSelectedClouds = (webClouds) => {
  let tempArray = []
  if(webClouds){
    webClouds.split(',').map(cid => {tempArray.push(parseInt(cid))})
  }
  return tempArray
}

//---------------------------------------------------------------------------------

  handleNewMemory = (memory) => {
    console.log('handleNewMemory : ' + JSON.stringify(memory));
    
    let newMemories = this.state.searchResult.memories
    newMemories.push(memory)
    this.loadMemories(newMemories)
  } 

//---------------------------------------------------------------------------------

  loadMemories =(memories) => {

    if(memories){
      console.log('App-loadMemories : memory count : ' + memories.length);
    }else{
      console.log('App-loadMemories : memory count : ' + 0);
    }

      
    this.setState({searchResult:{memories : memories}})
    
  }

//---------------------------------------------------------------------------------

  onRouteChange = (route) =>{
   
    console.log('app.onRouteChange : route = ' + route);
    
    if(route === 'signin'){
      this.setState({
        searchResult:{memories:[]},
        route:route, 
        isSignedIn : false
      })
    }else if (route === 'home'){
      this.setState({route:route, isSignedIn: true})
    }else if (route === 'memoryUpdated'){
      this.loadUser(this.state.user)
      this.setState({route:'home', isSignedIn: true})
    }else if (route === 'admin'){
      
     this.setState({route:route, isSignedIn: true})
    }else{
      this.setState({route:route})
    }
    
  }

//---------------------------------------------------------------------------------

handleEditMemory = (memory) => {
  this.state.activeMemory = memory;
  console.log('App.displayMemory : activeMemory.id ' + memory.memid);
  this.onRouteChange('displayMemory')
}

//---------------------------------------------------------------------------------

render() {

  
    let routeName = this.state.route
    let content = null
    console.log('Navigation.render.user ' , this.state.user);
    
    
    let nav = <Navigation 
                onRouteChange   = { this.onRouteChange    }   
                userSignedin    = { this.userSignedin       }
                loadMemories    = { this.loadMemories       }     
                onNewMemory     = { this.handleNewMemory    }     
                startingClouds  = { this.state.user.cloudSelection }    
                currentRoute    = { this.state.route        }
                userid          = { this.state.user.userid  }
              />

    if(routeName === 'home'){
      content = <CardCollection 
              memories      = { this.state.searchResult.memories } 
              userid        = { this.state.user.userid } 
              onEditMemory  = { this.handleEditMemory  }/>
              
    }else if(routeName === 'signin'){
      content = <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />

    }else if (routeName === 'admin'){
      console.log('app.render : route = ' + routeName);
      content = <Admin/>

    }else if (routeName === 'register'){
      content = <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
    }


    return (
      <div className="App">
          { nav     }
          { content }
      </div>
    );
  }
};

export default App;
