import React, { Component } from 'react'
import { View, ListView, Text, TouchableOpacity, Button } from 'react-native'
import { connect } from 'react-redux'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import apisauce from 'apisauce'

// For empty lists
// import AlertMessage from '../Components/AlertMessage'

// Styles
import styles from './Styles/ControlScreenStyle'

class ControlScreen extends Component {
  api={}
  
  
  constructor (props) {
    super(props)

    /* ***********************************************************
    * STEP 1
    * This is an array of objects with the properties you desire
    * Usually this should come from Redux mapStateToProps
    *************************************************************/
    dataObjects = {
      first: [
        {id:1, title: 'HEADLIGHTS', description: 'Headlights', endPoint: 'headlights', state: 0},
        {id:2, title: 'SPOT LIGHTS', description: 'Second Description', endPoint: 'spotlights', state: 0},
        {id:3, title: 'INDICATORS', description: 'Third Description', endPoint: 'indicators', state: 0},
        {id:4, title: 'REVERSING', description: 'Fourth Description', endPoint: 'reversing', state: 0},
        {id:5, title: 'BRAKES', description: 'Fourth Description', endPoint: 'brakes', state: 0}
      ],
      second: [
        {id:6, title: 'LEFT', description: 'Eleventh Description', endPoint: 'left', state: 0},
        {id:7, title: 'RIGHT', description: '12th Description', endPoint: 'right', state: 0},
        {id:8, title: 'FORWARD', description: '13th Description', endPoint: 'forward', state: 0},
        {id:9, title: 'BACK', description: '14th Description', endPoint: 'back', state: 0},
        {id:10, title: 'GEAR UP', description: '14th Description', endPoint: 'gear', state: 0},
        {id:11, title: 'GEAR DOWN', description: '14th Description', endPoint: 'gear', state: 0}
      ]
    }
    /* ***********************************************************
    * STEP 2
    * Teach datasource how to detect if rows are different
    * Make this function fast!  Perhaps something like:
    *   (r1, r2) => r1.id !== r2.id}
    *   The same goes for sectionHeaderHasChanged
    *************************************************************/
    const rowHasChanged = (r1, r2) => r1 !== r2
    const sectionHeaderHasChanged = (s1, s2) => s1 !== s2

    // DataSource configured
    this.ds = new ListView.DataSource({rowHasChanged, sectionHeaderHasChanged})

    // Datasource is always in state
    this.state = {
      dataSource: this.ds.cloneWithRowsAndSections(dataObjects)
    }

    
    
  }

  componentWillMount(){
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
    
        setTimeout(() => {
  //        dataObjects.first[0].state = dataObjects.first[0].state === 0 ? 1 : 0;
  //        this.setState({dataSource: this.ds.cloneWithRowsAndSections(dataObjects)});
        }, 1000);
  }

  /* ***********************************************************
  * STEP 3
  * `renderRow` function -How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={rowData.title} description={rowData.description} />
  *************************************************************/
  renderRow (rowData, sectionID) {
    // You can condition on sectionID (key as string), for different cells
    // in different sections
    //onPress={() => this.api.getLights().then((result) => {Alert.alert(result)})
    return (
      <TouchableOpacity style={rowData.state > 0 ? styles.rowPressed : styles.row} 
            onPress={() => this.callEndpoint(rowData)}>
        <Text style={styles.boldLabel}>{rowData.title}</Text>
      </TouchableOpacity>
    )
  }

  callEndpoint(rowData) {
    
    // Make the call to the endpoint based on the NEW state
    rowData.state = rowData.state === 0 ? 1 : 0;

    // Build the URL to call
    var url = rowData.endpoint + rowData.state === 0 ? "?OFF" : "?ON";

    // Call the url and wait for the result
    /*
    this.api.get(url)
        .then(response => {
          if (response.ok === false)
            alert("Web call failed : " + response.problem)
          else {
            this.updateState(rowData);
          }
    });
*/
    this.setState({dataSource: this.ds.cloneWithRowsAndSections(dataObjects)});

//    this.updateState(rowData);
  }

  updateState(rowData) {
    // Copy the data array so we can modify it and then update the
    // state with it
    var dup_array = {
      first: {},
      second: {}
    }
    dup_array.first = dataObjects.first.slice();
    dup_array.second = dataObjects.second.slice();

    // Find the row being changed in the data array, update the value...
    objIndex = dup_array.first.findIndex((obj => obj.id === rowData.id));
  //  alert("state = " + rowData.state);

    if (objIndex > -1) {
      dup_array.first[objIndex].state = rowData.state; 
    } 
    else {
      objIndex = dup_array.second.findIndex((obj => obj.id === rowData.id));
      dup_array.second[objIndex].state = rowData.state; 
    }

    this.setState({
      dataSource: this.ds.cloneWithRowsAndSections(dup_array)
    });

  }

  /* ***********************************************************
  * STEP 4
  * If your datasource is driven by Redux, you'll need to
  * reset it when new data arrives.
  * DO NOT! place `cloneWithRowsAndSections` inside of render, since render
  * is called very often, and should remain fast!  Just replace
  * state's datasource on newProps.
  *
  * e.g.
    componentWillReceiveProps (newProps) {
      if (newProps.someData) {
        this.setState(prevState => ({
          dataSource: prevState.dataSource.cloneWithRowsAndSections(newProps.someData)
        }))
      }
    }
  *************************************************************/
  componentWillReceiveProps(newProps) {

  }

  // Used for friendly AlertMessage
  // returns true if the dataSource is empty
  noRowData () {
    return this.state.dataSource.getRowCount() === 0
  }


  renderHeader (data, sectionID) {
    switch (sectionID) {
      case 'first':
        return <View style={styles.sectionHeader}><Text style={styles.boldLabel}>Lights</Text></View>
      default:
        return <View style={styles.sectionHeader}><Text style={styles.boldLabel}>Driving</Text></View>
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <ListView
          renderSectionHeader={this.renderHeader}
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          onLayout={this.onLayout}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlScreen)
