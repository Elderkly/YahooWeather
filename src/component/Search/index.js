
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import NavigationBar from '../../common/NavigationBar'
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {};
export default class Search extends Component<Props> {
    render() {
        return (
            <View>
                <NavigationBar
                    title={'搜索'}
                    style={{
                        backgroundColor:'rgb(0,0,0)'
                    }}
                    leftButton={<TouchableOpacity
                        style={{marginLeft:15}}
                        onPress={() => {
                            console.log(this.props)
                            this.props.navigation.goBack()
                        }}
                    >
                        <Icon name='ios-arrow-back' color={'#fff'} size={28} />
                    </TouchableOpacity>}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({

});
