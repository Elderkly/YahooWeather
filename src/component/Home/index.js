
import React, {Component} from 'react'
import {View,ViewPagerAndroid} from 'react-native'

import Pages from './pages'
import { connect } from 'react-redux'
import cityDao from '../../assets/cityDAO'
import {setWeather} from '../../redux/Action'
import Icon from 'react-native-vector-icons/Ionicons'
import { Drawer, ListRow ,Button,Carousel} from 'teaset'

class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            city:null
        }
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

    componentWillMount(){
        this.getUSERCITY()
    }
    //  获取用户收藏的城市
    getUSERCITY(){
        cityDao.getCityData()
            .then(res => {
                // console.log('city缓存',res)
                this.setState({city:res})
            })
    }
    render() {
        console.log('Home',this.props)
        return (
            <ViewPagerAndroid
                style={{flex:1}}
                // carousel={false}
                initialPage={0}
            >
                {
                    this.state.city ? this.state.city.map((e,index) => (<View key={index}>
                        <Pages 
                            {...this.props} 
                            cloneDrawer={() => this.toggleMenu('left')}
                            CITYDATA={e}
                        />
                    </View>)) : null
                }
            </ViewPagerAndroid>
            
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
export default connect(mapStateToProps, mapDispatchToProps)(Home);