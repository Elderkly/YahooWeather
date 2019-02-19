
import React, {Component} from 'react';
import {StyleSheet, Text,TouchableOpacity,ImageBackground,View} from 'react-native';
import NavigationBar from '../../common/NavigationBar'
import Icon from 'react-native-vector-icons/Ionicons';
import { Drawer, ListRow ,Button } from 'teaset';

type Props = {};
export default class Home extends Component<Props> {
    // 显示或隐藏侧边菜单(抽屉)
    toggleMenu(side){
        this.drawer = Drawer.open(this.renderDrawerMenu(), side);
    }

    // 侧边菜单(抽屉)
    renderDrawerMenu(){
        return (
            <View style={{ width: 260, flex: 1,backgroundColor: '#ddd'}}>
                <View style={{height: 60}} />
                <ListRow
                    icon={ <Icon name='ios-add' color={'#000'} size={40} />}
                    title='搜索'
                    accessory='none'
                    onPress={() => (this.props.navigation.navigate('Search'),this.drawer.close())}
                />
                <ListRow
                    icon={ <Icon name='ios-add' color={'#000'} size={40} />}
                    title='Home'
                />
                <ListRow
                    icon={ <Icon name='ios-add' color={'#000'} size={40} />}
                    title='Store'
                    bottomSeparator='none'
                />
                <View style={{flex: 1}} />
                <Button type='link' size='sm' title='Hide' onPress={() => this.drawer && this.drawer.close()} />
            </View>
        );
    }

    renderRightButton() {
        return (
            <TouchableOpacity
                style={{marginRight:15}}
                onPress={() => this.props.navigation.navigate('Search') }
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
                            this.toggleMenu('left')
                        }}
                    >
                        <Icon name='ios-menu' color={'#fff'} size={28} />
                    </TouchableOpacity>}
                    rightButton={this.renderRightButton()}
                />
                <Text style={styles.text}>首页</Text>
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
