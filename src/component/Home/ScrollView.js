import React, {Component} from 'react';
import {StyleSheet, Text,TouchableOpacity,View,ScrollView,Dimensions,RefreshControl} from 'react-native';
import {getNavigationBarHeight,getRandomImg} from '../../common/util'

const ViewHeight = Dimensions.get('window').height - getNavigationBarHeight()

type Props = {};
export default class HomeScrollView extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            refreshing:false,
            startMoveY:null,
            ScrollAdsorbent:'bottom',
            middleHeight:null   //  滚动吸附
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
                        this.refs.scrollView.scrollTo({y:middleHeight,animated:true})
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
    render () {
        const data = this.props.Items
        return (
            <ScrollView
                style={{flex:1}}
                onScroll={e => this.onScroll(e)}
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
                                <Text style={styles.h1} ref={'title'}>{data.data.wendu}°</Text>
                            </View>
                            <View style={{height:500,backgroundColor:'rgba(255,255,225,.2)'}}>
                                <Text>456</Text>
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
      fontSize:100,
      color:'#fff',
      fontWeight: '100'
    },
    firstView:{
        justifyContent:'flex-end',
        height:ViewHeight,
        alignItems:'flex-start',
    },
    scrollView:{
        paddingHorizontal:15
    }
})