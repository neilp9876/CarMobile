import React, { Component } from 'react'
//import { ScrollView, Text, Image, View, ToolbarAndroid, Navigator } from 'react-native'
import { View, Text }  from 'react-native'
import { Images, Colors } from '../Themes'
import { Button, Icon, Badge } from 'react-native-elements'
import apisauce from 'apisauce'

// Styles
import styles from './Styles/MainScreenStyles'
import {LightButton, ArrowButton} from './Buttons'


export default class LaunchScreen extends Component {
  steerActionEnum = {
      NEUTRAL: 1,
      CENTERING: 2,
      LEFT: 3,
      RIGHT: 4
  }
  api={}
  steeringAction = this.steerActionEnum.NEUTRAL;
  steeringDirection = 5; // Scale of 1 to 9

  // CommandEnum = Object.freeze({Forward:1, Reverse:2, Right:3, Left:4 })
  
  constructor (props) {
    super(props)

    piURL = 'http://192.168.16.44:9997'
    
    this.api = apisauce.create({
      // base URL is read from the "constructor"
      baseURL: piURL,
      // here are some default headers
      headers: {
        'Cache-Control': 'no-cache'
      },
      // 10 second timeout...
      timeout: 2000
    })

    this.state = {
        gearPosition: 1
    }
  }

  componentDidMount() {
        console.log('component mounted - starting timer');
        setInterval(this.PerformSteer, 100);
  }

    SendCommand = (buttonName, state) => {
        var url = "";

        if (buttonName == "Gear_up" || buttonName == "Gear_down")
        {
            if (state == 1)
                return;
            url = this.HandleGearChange(buttonName, state);
        }
        else
        {
            if (buttonName == "Right" || buttonName == "Left") {
                this.HandleSteering(buttonName, state);
            }
            
            // Do the le.log(buttonName + " pressed " + (state == 1 ? 'ON' : 'OFF'))
            var stateText = (state == 1 ? "ON" : "OFF");
            url = buttonName + '?' + stateText;
        }

        this.PostMessage(url);
    }

    PostMessage = (url) => {
        console.log(url);

        this.api.get(url)
            .then(response => {
                if (response.ok === false)
                    alert("Web call failed : " + response.problem);
                else {
                    console.log('State set on Pi');
                }
            });
    }

    HandleGearChange = (buttonName, state) => {
        currentGear = this.state.gearPosition;

        if (buttonName == "Gear_up") {
            newGear = currentGear + 1;
            if (newGear > 3)
                newGear = 3;
            this.setState({gearPosition: (newGear)})
        }
        else if (buttonName == "Gear_down") {
            newGear = currentGear - 1;
            if (newGear < 1)
                newGear = 1;
            this.setState({gearPosition: (newGear)})
        }
        url = "Gear?" + newGear;

        return url;
    }

  HandleSteering = (buttonName, state) => {
        // We need a timer to keep sending the signals to steer constantly
        if (state == 0)
        {
            // OFF - So return to centre
            this.steeringAction = this.steerActionEnum.CENTERING;
            console.log('Steering is now centering');            
        }
        else {
            // Steering - so set the direction
            if (buttonName == "Left") {
                this.steeringAction = this.steerActionEnum.LEFT;
                this.steeringDirection += 1;
                console.log('Steering Left');                
            }
            else {
                this.steeringAction = this.steerActionEnum.RIGHT;      
                this.steeringDirection -= 1;
                console.log('Steering Right');                
            }
        }
        this.PostMessage(this.BuildSteeringUrl());
    }

    PerformSteer = () => {
        
        if (this.steeringAction == this.steerActionEnum.NEUTRAL)
            return;

        console.log('Steering Update...');                
            
        // Otherwise we need to steer...
        switch(this.steeringAction)
        {
            case this.steerActionEnum.CENTERING:
                // Change the direction towards the neutral
                if (this.steeringDirection > 5)
                    this.steeringDirection -= 1;
                else if (this.steeringDirection < 5)
                    this.steeringDirection += 1;
                
                // Check whether we have now centred
                if (this.steeringDirection == 5) {
                    // Its centred so set the action so we stop
                    this.steeringAction = this.steerActionEnum.NEUTRAL;
                }
                break;

            case this.steerActionEnum.LEFT:
                this.steeringDirection += 1;
                if (this.steeringDirection > 9)
                    this.steeringDirection = 9;
                break;

            case this.steerActionEnum.RIGHT:
                this.steeringDirection -= 1;
                if (this.steeringDirection < 1)
                    this.steeringDirection = 1;  
                break;       
        }

        console.log('Steering direction = ' + this.steeringDirection);                
        
        // Get the URL and send it 
        url = this.BuildSteeringUrl();
        this.PostMessage(url);
    }

    BuildSteeringUrl = () => {
        url = "Steer?" + this.steeringDirection;
        return url;
    } 

  //flex-start, center, flex-end, space-around, and space-between
  render () {
    return (
      
    <View style={styles.mainContainer}>
      <View style={{flexDirection: 'row', justifyContent:'space-around'}}>
        <LightButton name='Headlight' iconName='drive-eta' onReport={this.SendCommand}/>
        <LightButton name='Hazards' iconName='error' onReport={this.SendCommand}/>
        <LightButton name='Spotlight' iconName='lightbulb-outline' onReport={this.SendCommand}/>
        <LightButton name='Foglight' iconName='cloud' onReport={this.SendCommand}/>
      </View>
      <View style={{flex: 3, flexDirection: 'row', justifyContent:'space-around'}}>
      <View style={{flex:1, flexDirection: 'column', justifyContent:'center', alignItems:'center'}}>
        <ArrowButton name='Forward' iconName='arrow-up-bold-box-outline' onReport={this.SendCommand}/>
        <ArrowButton name='Reverse' iconName='arrow-down-bold-box-outline' onReport={this.SendCommand}/>
      </View>
      <View style={{flex:1, flexDirection: 'column', justifyContent:'center', alignItems:'center'}}>
        <ArrowButton name = 'Gear_up' iconName='plus' size='small' onReport={this.SendCommand}/>
        <Badge value={this.state.gearPosition} width={60} height={60} textStyle={{ color: 'orange', fontSize: 40 }}/>
        <ArrowButton name='Gear_down' iconName='minus' size='small' onReport={this.SendCommand}/>
      </View>        
      <View style={{flex:1, flexDirection: 'row', justifyContent:'center', alignItems:'center'}}>
        <ArrowButton name='Left' iconName='arrow-left-bold-box-outline' onReport={this.SendCommand}/>
        <ArrowButton name='Right' iconName='arrow-right-bold-box-outline' onReport={this.SendCommand}/>     
      </View>        
      </View>

   </View>
    )
  }
}
