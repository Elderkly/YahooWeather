
import React, {Component} from 'react';
import {StyleSheet, Text,TouchableOpacity,ImageBackground} from 'react-native';
import NavigationBar from '../../common/NavigationBar'
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {};
export default class Home extends Component<Props> {
    renderRightButton() {
        return (
            <TouchableOpacity
                style={{marginRight:15}}
                onPress={() => this.props.navigation.navigate('Search')}
            >
                <Icon name='ios-add' color={'#fff'} size={40} />
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <ImageBackground
                style={{width: '100%', height: '100%'}}
                source={{uri:'http://attachments.gfan.net.cn/forum/201412/26/1550331rqpm15mnututn7v.jpg'}}
            >
                <NavigationBar
                    title={'YahooWeather'}
                    style={{
                        backgroundColor:'rgb(0,0,0,0)'
                    }}
                    leftButton={<TouchableOpacity
                        style={{marginLeft:15}}
                        onPress={() => {
                            this.props.navigation.openDrawer()
                        }}
                    >
                        <Icon name='ios-menu' color={'#fff'} size={28} />
                    </TouchableOpacity>}
                    rightButton={this.renderRightButton()}
                />
                <Text style={styles.text}>首页</Text>
                <Text
                    style={styles.text}
                    onPress={() => {
                        const {navigation} = this.props
                        navigation.openDrawer()
                    }}
                >打开抽屉</Text>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    text:{
        fontSize:26,
        color:'#fff'
    }
});
