import React from 'react'
import {connect} from 'react-redux'
import MusingForm from './MusingForm'
import Musing from './Musing'
import '../App.css';
import {getMusings} from '../redux/actions.js'
import {postMusing} from '../redux/actions.js'
import {removeMusing} from '../redux/actions.js'

class CurrentUserProfile extends React.Component {
  state = {
    musingForm: false,
    articleForm: false,
    musings: [],
    editForm: false,
    bio: '',
    location: ''
  }
//getting rid of the musings in this state

  componentDidMount(){

// this.props.getMusings(this.props.currentUser.user.id)
  //   if (this.props.currentUser.user !== {}){
  //     debugger
  //   this.props.getMusings(this.props.currentUser.user.id)
  // }
  //   if (this.props.currentUser.user !== undefined){
  //     debugger
  //   this.props.getMusings()
  //   }
  }

  componentDidUpdate(){
    // this.props.getMusings()

    if (this.props.currentUser.user !== undefined && this.props.musings.length === 0){
      this.props.getMusings(this.props.currentUser.user.id)
    // fetch(`http://localhost:3000/api/v1/users/${this.props.currentUser.user.id}/musings`)
    // .then(res => res.json())
    // .then(res => {
    //   if (this.state.musings.length !== res.length){
    //     this.setState({musings: res}, () => console.log(res, "after state update"))
    //   }
    // })
    }
  }
//moving this get fetch to actions getMusings

  submitHandler = (e) => {
    e.preventDefault()

    let musingBody = e.target.body.value
    let userId = this.props.currentUser.user.id
    console.log(musingBody, userId)
    let config = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "Accept": 'application/json',
        Authorization: 'Bearer'
      },
      body: JSON.stringify({
        body: musingBody,
        user_id: userId,
        likes: 0
      })
    }
    console.log(config, "config prior to action")
    this.props.postMusing(this.props.currentUser.user.id, config)
    // console.log(config, "config obj for post")
    // fetch(`http://localhost:3000/api/v1/users/${userId}/musings`, config)
    // .then(res => res.json())
    // .then(res => {
    //
    //     this.setState({musings: [...this.state.musings, res]}, () => console.log(res, "after fetch2"))
    // })
  }
//moving this post fetch to actions postMusing

  renderMusingForm = () => {
    this.setState({musingForm: true})
  }

  renderArticleForm = () => {
    this.setState({articleForm: true})
  }

  showEditForm = () => {
    this.setState({editForm: !this.state.editForm})
  }

  editProfile = (e) => {
    this.setState({[e.target.name]: e.target.value}, () => console.log(this.state))
  }

  submitProfileInfo = (e, id) => {
    e.preventDefault()
    console.log('hi', e, id)
    let config = {
      method: "PATCH",
      headers: {'Content-Type': 'application/json',
      "Accept": 'application/json',
      Authorization: 'Bearer'
      },
      body: JSON.stringify({
        bio: e.target.bio.value,
        location: e.target.location.value
      })
    }
    console.log(config)
    fetch(`http://localhost:3000/api/v1/users/${id}`, config)
    .then(res => res.json())
    .then(res => {
      console.log(res)
    })
  }

  deleteHandler = (id) => {
    console.log(id)
    this.props.removeMusing(id)
    fetch(`http://localhost:3000/api/v1/musings/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Accepts': 'application/json',
         Authorization: `Bearer`
      }
    })
    // .then(res => res.json())
    // .then(res => {
    //   console.log(res, "from delete")
    // })
  }

  render(){

    !!this.props.currentUser.user ?
    console.log(this.props.currentUser.user.id, "is this user id?") : console.log("")
    let allMusings
    if (!!this.props.musings[0]) {
    let allMusingsFiltered = this.props.musings[0].filter(musing => {
        return musing.user_id === this.props.currentUser.user.id
      })

    allMusings = allMusingsFiltered.map(musing => {
      return <Musing musing={musing} deleteHandler={this.deleteHandler}/>
    })

    allMusings = allMusings.reverse()

  }
    return (
      <div>
          {!!this.props.currentUser.user ?
          <div>
          <h1>{this.props.currentUser.user.name}</h1>
          <p>Username: @{this.props.currentUser.user.username}</p>
          {!!this.props.currentUser.user.bio ? <p>Bio: {this.props.currentUser.user.bio}</p> : ''}
          {!!this.props.currentUser.user.location ? <p>Location: {this.props.currentUser.user.location}</p> : ''}
          <div>
            {this.state.editForm ? <form onSubmit={(e) => this.submitProfileInfo(e, this.props.currentUser.user.id)}>
              <label>Bio: </label>
              <input type='text' name="bio" onChange={this.editProfile} value={this.state.bio} />
              <br/>
              <label>Location: </label>
              <input type='text' name="location" onChange={this.editProfile} value={this.state.location} />
              <br/>
              <input type='submit' value="Update Profile" />
              </form> : <button onClick={this.showEditForm}>Edit Profile</button>}
          </div>

            <div className='musings'>

          <h2>Musings</h2>
          <button onClick={this.renderMusingForm}>Post new musing</button>
          {this.state.musingForm ? <MusingForm submitHandler={this.submitHandler}/> : ""}
          <div>{allMusings}</div>
            </div>
          </div> : ''}
      </div>
    )
  }
}

const mapStateToProps = (state) => {

  return state
}

const mapDispatchToProps = (dispatch) => ({getMusings: (user) => dispatch(getMusings(user)), removeMusing: (id) => dispatch(removeMusing(id)), postMusing: ((id, musing) => dispatch(postMusing(id, musing)))})

export default connect(mapStateToProps, mapDispatchToProps)(CurrentUserProfile);
