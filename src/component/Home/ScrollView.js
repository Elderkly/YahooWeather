import React, {Component} from 'react';
import {StyleSheet, Text,TouchableOpacity,View,ScrollView,Dimensions,RefreshControl,Animated} from 'react-native';
import {getNavigationBarHeight,getRandomImg} from '../../common/util'
import { Toast} from 'teaset';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Weather} from '../../assets/json/weather'
import {Echarts, echarts} from 'react-native-secharts';

const ViewHeight = Dimensions.get('window').height - getNavigationBarHeight()

type Props = {};
export default class HomeScrollView extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            refreshing:false,
            startMoveY:null,
            ScrollAdsorbent:'bottom',
            middleHeight:null,   //  滚动吸附
            fadeHeight:new Animated.Value(350), // 动画高度
            option1: {              //  图表数据

            },
        }
    }
    onScroll(e) {
        // console.log(e.nativeEvent.contentOffset.y)
        this.props.onScroll(e.nativeEvent.contentOffset.y)
    }
    BeginScroll(e) {
        this.setState({startMoveY:e.nativeEvent.contentOffset.y})
        //  记录中间位置
        ! this.state.middleHeight ?
            this.refs.title.measure((fx, fy, width, height) => {
                this.setState({middleHeight:ViewHeight - height})
            }) : null
    }

    EndScroll(e) {
        const {ScrollAdsorbent,middleHeight} = this.state    //  滚动吸附方向  中间高度
        const velocity = e.nativeEvent.velocity.y  //   滚动速度
        const contentOffset = e.nativeEvent.contentOffset.y  // 滚动高度
        const Move = e.nativeEvent.contentOffset.y  - this.state.startMoveY  // 滚动距离


        if (ScrollAdsorbent === 'bottom') { //  向下吸附
            if (Move > 0) { //  向下滚动
                if (
                    ( Move > middleHeight * .3)
                ) {
                    this.refs.scrollView.scrollTo({y:middleHeight,animated:true})
                    this.setState({ScrollAdsorbent:'top'})
                } else {
                    this.refs.scrollView.scrollTo({y:0,animated:true})
                }
            }
        } else {
            if (Move < 0) { // 向上滚动
                if ( contentOffset > middleHeight) {    //  移动位置在中间以下
                    if (velocity > 8)
                     {
                        this.refs.scrollView.scrollTo({y:0,animated:true})
                        this.setState({ScrollAdsorbent:'bottom'})
                    } else {
                        // this.refs.scrollView.scrollTo({y:middleHeight,animated:true})
                    }
                } else {    //  位置在中间或以上 即已经是吸附状态
                    if (
                        ( (middleHeight - 200) > contentOffset )
                    ) {
                        this.refs.scrollView.scrollTo({y:0,animated:true})
                        this.setState({ScrollAdsorbent:'bottom'})
                    } else {
                        this.refs.scrollView.scrollTo({y:middleHeight,animated:true})
                    }
                }

            }
        }
    }
    _onRefresh = () => {
        this.setState({
            refreshing:true
        })
        getRandomImg()
            .then(res=>{
                this.props.getImgUrl(res)
                this.setState({
                    refreshing:false
                })
            })
            .catch(e => {
                console.log('图片请求失败',e)
                Toast.message('图片获取失败,请稍后再试')
                this.setState({
                    refreshing:false
                })
            })
    }
    //  提取天气数据中的数字
    renderNumber(str) {
        return parseInt(str.substring(1).substring(1).substring(1))
    }
    renderWeatherList(list) {
        const obj = []
        list.map(e => {
            obj.push(
                <View
                    key={e.date}
                    style={styles.items}
                >
                    <Text style={styles.items_text}>{e.week}</Text>
                    <View style={{flex:1,alignItems: 'center'}}>
                        <Icon name={Weather[e.type]} style={{fontSize: 24}} color={'#fff'}/>
                    </View>
                    <Text style={styles.items_text}>{this.renderNumber(e.high)}°</Text>
                    <Text style={styles.items_blue_text}>{this.renderNumber(e.low)}°</Text>
                </View>
            )
        })
        return obj
    }

    renderChartsData(list) {
        // console.log(list)
        const [Xdata,seriesData] = [[],[]]
        for (let x  in list) {
            Xdata.push(list[x].week)
            seriesData.push((this.renderNumber(list[x].high) + this.renderNumber(list[x].low)) / 2)
        }
        this.setState({
            option1: {              //  图表数据
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: Xdata,
                    nameGap:30
                },
                textStyle:{
                    color:'#fff',
                    fontSize:18
                },
                yAxis: {
                    show: false
                },
                color: 'rgba(255,255,255,.5)',
                series: [{
                    data: seriesData,
                    type: 'line',
                    smooth: true,
                    areaStyle: {}
                }],
                tooltip:{
                    trigger:'axis',
                    axisPointer:{

                    }
                },
            }
        })
        // console.log(Xdata,seriesData)
    }

    renderCharts() {
        return (
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={true}
                style={{flex:1,height:250}}
            >
                <View style={{width:1500,height:250}}>
                    <Echarts ref="echarts1" option={this.state.option1} height={250} />
                </View>
            </ScrollView>
        )
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        // console.log(this.props.Items)
        // this.state.weatherList.length < 1 && this.props.Items ? this.setState({weatherList:this.props.Items.data.forecast.slice(0,7)}) : null
        !this.state.option1.xAxis && this.props.Items ? this.renderChartsData(this.props.Items.data.forecast) : null
    }

    render () {
        const data = this.props.Items
        console.log(data)
        return (
            <ScrollView
                style={{flex:1}}
                onScroll={e => this.onScroll(e)}
                scrollEventThrottle={1}
                onScrollBeginDrag={e => this.BeginScroll(e)}
                onScrollEndDrag={e => this.EndScroll(e)}
                ref={'scrollView'}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                }
                contentContainerStyle={styles.scrollView}
            >
                {
                    data ?
                        <View>
                            <View style={styles.firstView}>
                                <View style={styles.RowView}>
                                    <Icon name={Weather[data.data.forecast[0].type]} style={{fontSize: 24}} color={'#fff'}/>
                                    <Text style={styles.text}>{data.data.forecast[0].type}</Text>
                                </View>
                                <View style={styles.RowView}>
                                    <Icon name={'angle-double-up'} style={{fontSize: 24}} color={'#fff'}/>
                                    <Text style={styles.text}>{this.renderNumber(data.data.forecast[0].high)}°</Text>
                                    <Icon name={'angle-double-down'} style={{fontSize: 24}} color={'#fff'}/>
                                    <Text style={styles.text}>{this.renderNumber(data.data.forecast[0].low)}°</Text>
                                </View>
                                 <Text style={styles.h1} ref={'title'}>{data.data.wendu}°</Text>
                            </View>
                            <View style={styles.items_box}>
                                <View style={styles.titleView}>
                                    <Text style={styles.title}>预报</Text>
                                </View>
                                {this.renderCharts()}
                                <Animated.View style={{height:this.state.fadeHeight,overflow:'hidden'}}>
                                    {this.renderWeatherList(data.data.forecast)}
                                </Animated.View>
                                <View style={{flexDirection:'row',marginVertical: 10}}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            Animated.timing(                       // 随时间变化而执行动画
                                                this.state.fadeHeight,            // 动画中的变量值
                                                {
                                                    toValue: 350,                        // 初始高度350
                                                    duration: 800,                   // 让动画持续一段时间
                                                }
                                            ).start();
                                        }}
                                    >
                                        <Text style={styles.bottomViewText}>7天</Text>
                                    </TouchableOpacity>
                                    <Text style={{color:'#fff',fontSize:14,marginHorizontal:10}}>|</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            Animated.timing(                       // 随时间变化而执行动画
                                                this.state.fadeHeight,            // 动画中的变量值
                                                {
                                                    toValue: 750,                        // 完整高度750
                                                    duration: 800,                   // 让动画持续一段时间
                                                }
                                            ).start();
                                        }}
                                    >
                                        <Text style={styles.bottomViewText}>14天</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.items_box}>
                                <View style={styles.titleView}>
                                    <Text style={styles.title}>详细信息</Text>
                                </View>
                                <View style={styles.items_details}>
                                    <View style={[styles.details_box,{alignItems:'center',justifyContent:'center'}]}>
                                        <Icon name={Weather[data.data.forecast[0].type]} style={{fontSize: 60}} color={'#fff'}/>
                                    </View>
                                    <View style={styles.details_box}>
                                        <View style={styles.details_items}>
                                            <Text style={styles.de_items_text}>体感温度</Text>
                                            <Text style={styles.de_items_text}>{data.data.wendu}°</Text>
                                        </View>
                                        <View style={styles.details_items}>
                                            <Text style={styles.de_items_text}>湿度</Text>
                                            <Text style={styles.de_items_text}>{data.data.shidu}</Text>
                                        </View>
                                        <View style={styles.details_items}>
                                            <Text style={styles.de_items_text}>空气质量</Text>
                                            <Text style={styles.de_items_text}>{data.data.quality}</Text>
                                        </View>
                                        <View style={[styles.details_items,{borderBottomWidth:0}]}>
                                            <Text style={styles.de_items_text}>PM2.5</Text>
                                            <Text style={styles.de_items_text}>{data.data.pm25}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        : null
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    h1:{
      fontSize:120,
      color:'#fff',
      fontWeight: '100',
      marginTop:-35
    },
    firstView:{
        justifyContent:'flex-end',
        height:ViewHeight,
        alignItems:'flex-start',
        marginHorizontal: 10
    },
    scrollView:{
        paddingHorizontal:5,
        paddingBottom: 50,
    },
    RowView:{
        flexDirection:'row',
        marginBottom:8,
        paddingLeft:8
    },
    text:{
        color:'#fff',
        fontSize:20,
        marginHorizontal:20
    },
    items:{
        flexDirection: 'row',
        paddingVertical:10,
        borderBottomWidth:.5,
        paddingHorizontal:5,
        borderColor:'rgba(255,255,255,.8)',
        borderStyle:'dashed'
    },
    items_text:{
        fontSize:22,
        color:'#fff'
    },
    items_blue_text:{
        fontSize:22,
        color:'rgb(160,176,250)',
        marginLeft:20
    },
    titleView:{
        marginVertical:5,
        borderBottomWidth: .5,
        borderColor: '#fff',
        paddingVertical: 5
    },
    title:{
        fontSize:28,
        color:'#fff'
    },
    bottomViewText:{
        fontSize:16,
        color:'#fff'
    },
    items_box:{
        backgroundColor:'rgba(0,0,0,.5)',
        paddingHorizontal: 10,
        borderRadius:5,
        flex:1,
        marginBottom:10
    },
    items_details:{
        flexDirection:'row',
        paddingBottom:10
    },
    details_box:{
        flex:1
    },
    details_items:{
        flexDirection:'row',
        padding:5,
        justifyContent:'space-between',
        borderBottomWidth:.5,
        borderColor:'rgba(255,255,255,.8)',
    },
    de_items_text:{
        fontSize:17,
        color:'#fff'
    }
})