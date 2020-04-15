import React, {Component} from 'react';
import './App.css';

class App extends Component{
  constructor(){
    super()
    this.state = {
      city:"Lisbon",
      currentCityWeather:"",
      predictionWeather:"",
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
      fetch('http://api.openweathermap.org/data/2.5/weather?q='+that.state.city+'&appid=4c77efd9f8291e2531b89885b49ca00e&units='+that.state.units,{mode : 'cors'}),
      fetch('http://api.openweathermap.org/data/2.5/forecast?q='+that.state.city+'&appid=4c77efd9f8291e2531b89885b49ca00e&units=metric',{mode : 'cors'})
    ])
      .then(async([current, forecast]) => {
        const currentWeather = await current.json();
        const forecastWather = await forecast.json();
        return [currentWeather, forecastWather]
      })

      .then(function(response){
        that.setState({currentCityWeather: response[0]})
        that.setState({predictionWeather: response[1]})
        that.setState({isFetching: false})
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
    await type === "radio" ? this.getData() : console.log("hello");
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
            <label>
              <input
                type="radio"
                name="units"
                value="metric"
                checked={this.state.units==="metric"}
                onChange={this.handleChange}
              />ºC
            </label>
            <label>
              <input
                type="radio"
                name="units"
                value="imperial"
                checked={this.state.units==="imperial"}
                onChange={this.handleChange}
              />Fahrenheit
            </label>
          </div>
          
          
          <input 
            type="text"
            value={this.state.city}
            name="city"
            placeholder="Insert City Name"
            onChange={this.handleChange} 
          />
          
          <button onClick={this.getData}><i className="fas fa-search-location"></i></button>
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
                    <div><i className="fas fa-wind"></i> {this.state.currentCityWeather.wind.speed} m/s</div>
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
