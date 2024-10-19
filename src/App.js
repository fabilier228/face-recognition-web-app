import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Rank from './components/Rank/Rank'
import 'tachyons';
import './App.css';
import ParticlesBg from 'particles-bg';
import Clarifai from 'clarifai'

const PAT = 'ea705a754d4146989e8d8053c8d8e7c7';
const USER_ID = 'clarifai';
const APP_ID = 'test';
const MODEL_ID = 'general-image-recognition';

const clarifaiRequestOption = (imageUrl) => {
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
    };
    
    return requestOptions;
  }


class App extends React.Component {
  constructor() {
    super()
    this.state = {
      input: " ",
      imageUrl:""
    }
  }

  onInputChange = (event) => {
   this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", clarifaiRequestOption(this.state.input))
    .then(response => {
      console.log("hi", response)
      if (response) {
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log("Bad response"));

  }

    
  render() {
    return (
      <div className="App">
        <>
          <div>...</div>
          <ParticlesBg type="tadpole" bg={true} className="particles"/>
        </>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
}

export default App;
