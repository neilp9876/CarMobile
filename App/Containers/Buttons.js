import React, { Component } from 'react'
//import { ScrollView, Text, Image, View, ToolbarAndroid, Navigator } from 'react-native'
import { View, Text }  from 'react-native'
import { Images, Colors } from '../Themes'
import { Button, Icon } from 'react-native-elements'

// Styles
import styles from './Styles/MainScreenStyles'

export class LightButton extends Component {
    constructor(props) {
        super(props);
        this.state = {pressed: 0};
        this.onPressed = this.onPressed.bind(this);
    }

    onPressed () {
        newState = !this.state.pressed;
        this.setState({pressed: newState});
        this.props.onReport(this.props.name, newState);
    }

    render () {
        let colour = this.state.pressed ? 'white' : 'black';
        let backColour = this.state.pressed ? '#FF0000' : '#00CCFF';
        var backStyle = {backgroundColor: backColour};

        return (
            <Button
                raised
                large
                title={this.props.name}
                icon={{
                    name: this.props.iconName, 
                    size:32, 
                    color: colour}}
                textStyle={{fontSize:20}}
                containerViewStyle={{borderRadius: 20}}
                color={colour}      
                buttonStyle={[styles.button, backStyle]}
                onPress={this.onPressed}
            />
        );
    }
}

export class ArrowButton extends Component {

    constructor(props) {
        super(props);
        this.state = {pressed: 0};
        this.handlePressIn = this.handlePressIn.bind(this);
        this.handlePressOut = this.handlePressOut.bind(this);
    }

    handlePress () {
        console.log("Standard press - icon")
    }

    handlePressIn () {
        console.log("press IN - icon")
        this.setState({pressed: 1});
        this.props.onReport(this.props.name, 1);        
    }

    handlePressOut () {
        console.log("press OUT - icon")
        this.setState({pressed: 0});
        this.props.onReport(this.props.name, 0);        
    }

    render () { 
        let iconName = this.props.iconName;
        let colour = this.state.pressed ? '#b8b4ed' : '#4a40b7';
        let size = 50;
        if (this.props.size === 'small')
            size = 35;

        return (
            <Icon
                name={iconName}
                type='material-community'
                reverse = {true}
                size={size}
                color={colour}
                //backgroundColor={'white'}//{backColour}
                onPressIn={this.handlePressIn} 
                onPressOut={this.handlePressOut}
                onPress={this.handlePress}
          />
        )
    }
}

  /*



*/
/*
          <Icon
      //      onPress={this.onForward}
          />

          name='arrow-up-bold-box-outline'
            size={50}
            type='material-community'
            buttonStyle={{borderRadius: 100}}
            reverse
            color="#00aced"


<Icon
            name='arrow-down-bold-box-outline'
            type='material-community'
            reverse
            size={50}
            color='#00aced'
           // onPress={this.onForward}
          />
          <Icon
              name='arrow-up-bold-box-outline'
              type='material-community'
              reverse
              size={50}
              color='#1a237e'
        //      onPress={this.SendCommand(1)}
            />
            <Icon
              name='arrow-down-bold-box-outline'
              type='material-community'
              reverse
              size={50}
              color='#1a237e'
            />
            <Icon
                name='arrow-left-bold-box-outline'
                type='material-community'
                reverse
                size={50}
                color='#1a237e'
              />
              <Icon
                name='arrow-right-bold-box-outline'
                type='material-community'
                reverse
                size={50}
                color='#1a237e'
              />
    }
  }  
  */