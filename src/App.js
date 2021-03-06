import React, {Component} from 'react';
import './App.css';

class App extends Component{
  constructor(){
    super()
    this.state = {
      city:"Lisbon",
      currentCityWeather:"",
      invisible: true,
      isFetching : true,
      units: "metric"
    }
  this.getData = this.getData.bind(this)
  this.handleChange = this.handleChange.bind(this)
  this.toggleClass = this.toggleClass.bind(this)
  }

  getData() {
    const that = this;
    Promise.all([
      fetch('https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q='+that.state.city+'&appid=4c77efd9f8291e2531b89885b49ca00e&units='+that.state.units,{mode : 'cors'}),

    ])
      .then(async([current]) => {
        const currentWeather = await current.json();
        return [currentWeather]
      })
      .then(function(response){
        if(parseInt(response[0].cod) === 404){
          that.setState({city: response[0].message})
        }else{
          that.setState({currentCityWeather: response[0]})
          that.setState({isFetching: false})
        }
      })
      
      .catch(function(error){
        console.log(error)
      })

      if(this.state.invisible === true){
        that.toggleClass()
      }
      
  }

  async handleChange(event){
    const {name, value, type} = event.target
    this.setState({[name]: value})
    await type === "radio" ? this.getData() : console.log("");
    this.setState({[name]: value})
    

  }


  toggleClass(){
    const currentState = this.state.invisible;
    this.setState({invisible: !currentState});
  }

  componentDidMount() {
    this.getData();
  }


  render(){
  
    return(
      <div className = "mainContainer">
        <div className = "topbar">
          <div className="units">
            <label className="units-label">
              <input
                type="radio"
                name="units"
                value="metric"
                checked={this.state.units==="metric"}
                onChange={this.handleChange}
              />ºC
            </label>
            <label className="units-label">
              <input
                type="radio"
                name="units"
                value="imperial"
                checked={this.state.units==="imperial"}
                onChange={this.handleChange}
              />Fahrenheit
            </label>
          </div>
          
          <div className="search-bar">
          <input 
            type="text"
            value={this.state.city}
            name="city"
            placeholder="Insert City Name"
            onChange={this.handleChange} 
          />
          
          <button onClick={this.getData}><i className="fas fa-search-location"></i></button>
          </div>
        </div>

        {this.state.isFetching? null : (
          <div className={this.state.invisible ? "invisible" : null}>
            <div className = "topContainer">
              <h1>{this.state.currentCityWeather.name}</h1>
            </div>

             
            <div className = "middleContainer"> 
              <div className="leftCollumn"> 
                  <div className="temperature"><i className="fas fa-thermometer-half"></i> {this.state.currentCityWeather.main.temp}º</div>
                  <div> <i className="fas fa-user"></i> Feels Like :{this.state.currentCityWeather.main.feels_like}º</div>
                </div>

                <div className="rightCollumn"> 
                  <img className="weatherImage" alt="icon" src={"http://openweathermap.org/img/w/"+ this.state.currentCityWeather.weather[0].icon + ".png" }/>
                  <div>{this.state.currentCityWeather.weather[0].description}</div>
                  <div className="row">
                    <div><i className="fas fa-wind"></i> {this.state.currentCityWeather.wind.speed} {this.state.units==="metric" ? "m/s" : "mph"}</div>
                    <div><i className="fas fa-compass"></i> {this.state.currentCityWeather.wind.deg} º</div>
                  </div>
                  <div className="row">
                    <div><i className="fas fa-tint"></i> Humidity :  {this.state.currentCityWeather.main.humidity} %</div>
                  </div>
                  
              </div>
            </div>

            <div className = "bottomContainer">
              <div>
              </div>
            </div>
          </div>
        )}  
      </div>
      
    )
  }

}

export default App;
