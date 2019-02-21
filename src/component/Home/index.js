
import React, {Component} from 'react';
import {StyleSheet, Text,TouchableOpacity,ImageBackground,View,Dimensions,AsyncStorage} from 'react-native';
import NavigationBar from '../../common/NavigationBar'
import Icon from 'react-native-vector-icons/Ionicons';
import { Drawer, ListRow ,Button } from 'teaset';
import HttpRequest from '../../common/HttpRequest'
import ScrollView from './ScrollView'
import {getNavigationBarHeight,getRandomImg} from '../../common/util'

type Props = {};
export default class Home extends Component<Props> {
    state = {
        MaskOpacity:0,
        imgUrl:'https://castle.womany.net/images/content/pictures/29362/content_womany_slide_340176_3496701_free_1432883330-23387-6973.jpg',
        items:null
    }

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

    componentWillMount(){
        HttpRequest.get('http://t.weather.sojson.com/api/weather/city/101280601')
            .then(res => {
                // console.log(res)
                this.setState({items:res})
            })
        this.getBgImgUrl()
    }

    //  写入图片缓存
    setBgImgUrl(url){
        AsyncStorage.setItem('bgImg',JSON.stringify({url:url,Time:new Date().getTime()}),error => {
            !error ? this.setState({imgUrl:url}) : console.log('写入缓存失败',error)
        })
    }

    //  读取图片缓存
    getBgImgUrl(){
        AsyncStorage.getItem('bgImg',(error,res) => {
            const url = 'https://castle.womany.net/images/content/pictures/29362/content_womany_slide_340176_3496701_free_1432883330-23387-6973.jpg'
            if (!error && res) {
                const data = JSON.parse(res)
                const time = (new Date().getTime() - data.Time)  / 1000 / 60 % 60
                console.log('距离上一次刷新背景图片已经过去',time,'分钟')
                if (time > 5) {
                    console.log('刷新图片')
                    getRandomImg()
                        .then(res=>{
                            this.setState({imgUrl:res})
                            this.setBgImgUrl(res)
                        })
                        .catch(e => {
                            console.log('图片请求失败',e)
                            this.setState({imgUrl:url})
                        })
                } else {
                    this.setState({imgUrl:data.url})
                }
            } else {
                this.setState({imgUrl:url})
                this.setBgImgUrl(url)
            }
        })
    }

    render() {
        return (
            <ImageBackground
                style={{width: '100%', height: '105%',position:'relative',bottom:this.state.MaskOpacity * 10}}
                source={{uri:this.state.imgUrl}}
            >
                <View style={{flex:1,backgroundColor:`rgba(0,0,0,${this.state.MaskOpacity})`}}>
                    <NavigationBar
                        title={'深圳市'}
                        style={{
                            backgroundColor:`rgb(0,0,0,${this.state.MaskOpacity}))`
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
                    <ScrollView
                        Items={this.state.items}
                        onScroll={scrollY => {
                            const ViewHeight = Dimensions.get('window').height - getNavigationBarHeight()
                            this.setState({MaskOpacity:Math.min(scrollY / ViewHeight,.7) })
                            // console.log(Math.min(scrollY / ViewHeight,.7) )
                        }}
                        getImgUrl={url => {
                           console.log(url)
                           this.setBgImgUrl(url)
                        }}
                    />
                </View>
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
