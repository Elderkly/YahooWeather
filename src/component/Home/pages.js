import React, {Component} from 'react'
import {StyleSheet, Text,TouchableOpacity,ImageBackground,View,Dimensions,AsyncStorage} from 'react-native'

import { Toast} from 'teaset'
import ScrollView from './ScrollView'
import HttpRequest from '../../common/HttpRequest'
import NavigationBar from '../../common/NavigationBar'
import Icon from 'react-native-vector-icons/Ionicons'
import {getNavigationBarHeight,getRandomImg} from '../../common/util'

export default class pages extends Component {
    constructor(props){
        super(props)
        this.state = {
            MaskOpacity:0,
            imgUrl:'https://castle.womany.net/images/content/pictures/29362/content_womany_slide_340176_3496701_free_1432883330-23387-6973.jpg',
            items:null
        }
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
        console.log(this.props.CITYDATA)
        HttpRequest.get(`http://t.weather.sojson.com/api/weather/city/${this.props.CITYDATA.cityId}`)
            .then(res => {
                // console.log(res)
                this.setState({items:res})
            })
        this.getBgImgUrl()
    }
    //  写入图片缓存
    setBgImgUrl(url){
        AsyncStorage.setItem('bgImg',JSON.stringify({url:url,Time:new Date().getTime()}),error => {
            !error ? (this.setState({imgUrl:url}),Toast.message('刷新成功')) : console.log('写入缓存失败',error)
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
                    // Toast.message('启动自动刷新');
                    getRandomImg()
                        .then(res=>{
                            this.setState({imgUrl:res})
                            this.setBgImgUrl(res)
                        })
                        .catch(e => {
                            console.log('图片请求失败',e)
                            Toast.message('获取图片失败,请稍后再试');
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
                        title={this.props.CITYDATA.name}
                        style={{
                            backgroundColor:`rgb(0,0,0,${this.state.MaskOpacity}))`
                        }}
                        leftButton={<TouchableOpacity
                            style={{marginLeft:15}}
                            onPress={() => {
                                this.props.onSetWeather(
                                    {
                                        city: "深圳龙华",
                                        cityId: "8888888"
                                    }
                                )
                                this.props.cloneDrawer()
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
        )
    }
}

const styles = StyleSheet.create({
    text:{
        fontSize:26,
        color:'#fff'
    }
});