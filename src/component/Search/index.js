
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, TextInput,View,ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {getStatusBarHeight} from '../../common/util'
import city from '../../assets/json/_city'

import {Toast} from 'teaset';

import { connect } from 'react-redux';
import cityDao from '../../assets/cityDAO'

type Props = {};
class Search extends Component<Props> {
    state = {
        value:null,
        searchView:null
    }
    changText(text) {
        this.setState({
            value:text,
            searchView:text ? this.renderLoadingDom() : null
        })
        this.searchCity(text)
    }
    renderLoadingDom() {
        return (
            <View style={{marginVertical: 30,alignItems:'center'}}>
                <ActivityIndicator size="large" color={'#fff'}></ActivityIndicator>
            </View>
        )
    }
    addCityData(data) {
        // console.log({name:data.city_name,cityId:data.city_code})
        cityDao.addCityData({name:data.city_name,cityId:data.city_code})
            .then((res) => {
                console.log(res)
                Toast.message('添加成功')
            })
            .catch(e => {
                Toast.message('添加失败')
                console.log(e)
            })
    }
    renderCityDom(data) {
        return (
            <TouchableOpacity
                style={styles.items}
                onPress={() => {
                    this.addCityData(data)
                }}
            >
                <Text style={{color:'#fff', fontSize: 17, fontWeight: '300'}}>{data.city_name}</Text>
            </TouchableOpacity>
        )
    }
    searchCity(text) {
        for (let x = 0;x < city.length;x++) {
            if (text === city[x].city_name) {
                console.log(city[x])
                this.setState({
                    value:text,
                    searchView:this.renderCityDom(city[x])
                })
                return
            }
            if (x === city.length - 1) {
                // setTimeout(() => {
                    this.setState({
                        searchView:null
                    })
                // },600)
                return
            }
        }
    }
    render() {
        return (
            <View style={styles.content}>
                <View style={{flexDirection:'row',alignItems:'center',backgroundColor: 'rgb(17,17,17)',marginTop:getStatusBarHeight()}}>
                    <Icon name='ios-search' color={'rgba(255,255,255,.8)'} size={30} style={{marginHorizontal:15}}/>
                    <TextInput
                        style={styles.input}
                        value={this.state.value}
                        onChangeText={(text) => this.changText(text)}
                        keyboardAppearance={'dark'}
                        autoFocus={true}
                    ></TextInput>
                    {
                        !this.state.value ? null :
                            <TouchableOpacity
                                onPress={() => this.setState({value:null,searchView:null})}
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
                {this.state.searchView}
            </View>
        );
    }
}


// 获取 state 变化
const mapStateToProps = (state) => {
    return {
        REDUX_city: state,
    }
};

// 发送行为
const mapDispatchToProps = (dispatch) => {
    return {
        onSetWeather: (city) => dispatch(setWeather(city)),
    }
};

// 进行第二层包装,生成的新组件拥有 接收和发送 数据的能力
export default connect(mapStateToProps, mapDispatchToProps)(Search);

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
    },
    items:{
        paddingLeft:10,
        paddingVertical:10,
        borderBottomWidth:1,
        borderColor:'rgb(57,57,57)',
        marginHorizontal:5
    }
});
