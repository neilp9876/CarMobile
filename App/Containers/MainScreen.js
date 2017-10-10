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
  api={}

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
   // this.props.commands = {Forward:1, Reverse:2, Right:3, Left:4 }

   // this.state = {
     // commands: {Forward:1, Reverse:2, Right:3, Left:4 }
   // }
  }

  SendCommand = (buttonName, state) => {
    console.log(buttonName + " pressed " + (state == 1 ? 'ON' : 'OFF'))
    var stateText = (state == 1 ? "ON" : "OFF");
    var url = buttonName + '?' + stateText;
    console.log(url);
    
    // Call the url and wait for the result
    this.api.get(url)
      .then(response => {
        if (response.ok === false)
          alert("Web call failed : " + response.problem);
        else {
          console.log('State set on Pi');

          currentGear = this.state.gearPosition;
          if (url == "Gear_up?OFF") {
            newGear = currentGear + 1;
            this.setState({gearPosition: (newGear > 3 ? 3 : newGear)})
          }
          else if (url == "Gear_down?OFF") {
            newGear = currentGear - 1;
            this.setState({gearPosition: (newGear < 1 ? 1 : newGear)})
          }
        }
      });
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
