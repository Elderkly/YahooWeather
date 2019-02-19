
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, TextInput,View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {getStatusBarHeight} from '../../common/util'


type Props = {};
export default class Search extends Component<Props> {
    state = {
        value:null
    }
    render() {
        return (
            <View style={styles.content}>
                <View style={{flexDirection:'row',alignItems:'center',backgroundColor: 'rgb(17,17,17)',marginTop:getStatusBarHeight()}}>
                    <Icon name='ios-search' color={'rgba(255,255,255,.8)'} size={30} style={{marginHorizontal:15}}/>
                    <TextInput
                        style={styles.input}
                        value={this.state.value}
                        onChangeText={(text) => this.setState({value:text})}
                        keyboardAppearance={'dark'}
                        autoFocus={true}
                    ></TextInput>
                    {
                        !this.state.value ? null :
                            <TouchableOpacity
                                onPress={() => this.setState({value:null})}
                                style={{marginHorizontal:5}}
                            >
                                <Icon name='ios-close-circle' color={'rgb(57,57,57)'} size={22}/>
                            </TouchableOpacity>
                    }
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}
                        style={{marginHorizontal:15}}
                    >
                        <Text style={{color:'#fff',fontSize:18,fontWeight: '300'}}>取消</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    content:{
        flex:1,
        backgroundColor:'#000'
    },
    input:{
        flex:1,
        color:'#fff',
        fontSize: 18,
        fontWeight: '300'
    }
});
