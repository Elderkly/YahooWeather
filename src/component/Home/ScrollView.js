import React, {Component} from 'react';
import {StyleSheet, Text,TouchableOpacity,View,ScrollView,Dimensions,RefreshControl,Animated} from 'react-native';
import {getNavigationBarHeight,getRandomImg} from '../../common/util'
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

        // console.log('速度',velocity)
        // console.log('移动距离',Move)
        // console.log('方向',ScrollAdsorbent)
        // console.log('位置',contentOffset,'中间高度',this.state.middleHeight)



        // if (ScrollAdsorbent === 'bottom') { //  向下滚动
        //     if (velocity > -2 && Move < ViewHeight * 0.4) { //  如果滚动距离小于40%并且滚动速度小于2则回退滚动
        //         this.refs.scrollView.scrollTo({y:0,animated:true})
        //     }else if (Move < ViewHeight * 0.9 && velocity > -8) {   //  否则吸附在标题位置
        //         this.refs.title.measure((fx, fy, width, height, px, py) => {
        //             this.setState({middleHeight:ViewHeight - height})
        //             this.refs.scrollView.scrollTo({y:ViewHeight - height,animated:true})
        //         })
        //         this.setState({ScrollAdsorbent:'top'})
        //     }else if ( velocity < -8) { //  如果速度大于8则不需要吸附
        //         this.setState({ScrollAdsorbent:'top'})
        //     }
        // } else {    //  向上滚动
        //     if (velocity < 4 && Move < 0 && (this.state.middleHeight - contentOffset) < 200) { //  向上滚但速度小于2则回退滚动
        //         this.refs.scrollView.scrollTo({y:this.state.middleHeight,animated:true})
        //     /*
        //     * contentOffset < this.state.middleHeight 滚动高度小于中间高度 即向上滚
        //     * */
        //     }else if ((contentOffset < this.state.middleHeight) ||
        //         (velocity > 8 && Move < -150) ||
        //         (contentOffset > this.state.middleHeight && Move < -50 && velocity > 4.5))  {     //  滚回到最顶部
        //         this.refs.scrollView.scrollTo({y:0,animated:true})
        //         this.setState({ScrollAdsorbent:'bottom'})
        //     } else {
        //         // console.log('缺省判断')
        //         // console.log('速度',e.nativeEvent.velocity.y)
        //         // console.log('移动距离',Move)
        //         // console.log('方向',ScrollAdsorbent)
        //         // console.log('位置',contentOffset,'中间高度',this.state.middleHeight)
        //     }
        // }
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
        // console.log(data)
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
                            <View style={{backgroundColor:'rgba(0,0,0,.5)',paddingHorizontal: 10,borderRadius:5,flex:1}}>
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
                            <View style={{backgroundColor:'rgba(255,255,225,7)',height:500,}}>
                                <Text>789</Text>
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
        paddingHorizontal:5
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
    }

})