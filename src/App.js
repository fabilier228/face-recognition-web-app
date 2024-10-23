import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import 'tachyons';
import './App.css';
import ParticlesBg from 'particles-bg';

const PAT = 'ea705a754d4146989e8d8053c8d8e7c7';
const USER_ID = 'fabilier228';
const APP_ID = 'test';
const MODEL_ID = 'face-detection';

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
      imageUrl:"",
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height)
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
   this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})

    fetch("v2/models/" + MODEL_ID + "/outputs", clarifaiRequestOption(this.state.input))
    .then(response => {
      response.json().then((res) =>  this.displayFaceBox(this.calculateFaceLocation(res)));
    })
    .catch(err => console.log("Bad response", err));

  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

    
  render() {
    const {isSignedIn, imageUrl, route, box} = this.state
    return (
      <div className="App">
        <>
          <div>...</div>
          <ParticlesBg type="tadpole" bg={true} className="particles"/>
        </>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      { this.state.route === 'home'
        ? <div>
            <Logo />
            <Rank />
            <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>
      : (
        this.state.route === 'signin'
        ? <Signin onRouteChange={this.onRouteChange}/>
        : <Register onRouteChange={this.onRouteChange}/>
        )
      }
      </div>
    );
  }
}

export default App;
