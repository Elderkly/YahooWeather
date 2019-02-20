import React, {Component} from 'react';
import {StyleSheet, Text,TouchableOpacity,View,ScrollView,Dimensions,RefreshControl} from 'react-native';
import {getNavigationBarHeight} from '../../common/util'

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
        const {middleHeight} = this.state
        const contentOffset = e.nativeEvent.contentOffset.y
        middleHeight ?
            contentOffset > middleHeight ? this.setState({ScrollAdsorbent:'top'})
                : this.setState({ScrollAdsorbent:'bottom'}) : ''
        this.props.onScroll(e.nativeEvent.contentOffset.y)
    }
    BeginScroll(e) {
        this.setState({startMoveY:e.nativeEvent.contentOffset.y})
    }
    EndScroll(e) {
        const {ScrollAdsorbent} = this.state    //  滚动吸附方向
        const velocity = e.nativeEvent.velocity.y  //   滚动速度
        const contentOffset = e.nativeEvent.contentOffset.y  // 滚动高度
        const Move = e.nativeEvent.contentOffset.y  - this.state.startMoveY  // 滚动距离
        if (ScrollAdsorbent === 'bottom') { //  向下滚动
            if (velocity > -2 && Move < ViewHeight * 0.4) { //  如果滚动距离小于40%并且滚动速度小于2则回退滚动
                this.refs.scrollView.scrollTo({y:0,animated:true})
            }else if (Move < ViewHeight * 0.9 && velocity > -8) {   //  否则吸附在标题位置
                this.refs.title.measure((fx, fy, width, height, px, py) => {
                    this.setState({middleHeight:ViewHeight - height})
                    this.refs.scrollView.scrollTo({y:ViewHeight - height,animated:true})
                })
                this.setState({ScrollAdsorbent:'top'})
            }else if ( velocity < -8) { //  如果速度大于8则不需要吸附
                this.setState({ScrollAdsorbent:'top'})
            }
        } else {    //  向上滚动
            if (velocity < 4 && Move < 0 && (this.state.middleHeight - contentOffset) < 200) { //  向上滚但速度小于2则回退滚动
                this.refs.scrollView.scrollTo({y:this.state.middleHeight,animated:true})
            /*
            * contentOffset < this.state.middleHeight 滚动高度小于中间高度 即向上滚
            * */
            }else if ((contentOffset < this.state.middleHeight) ||
                (velocity > 8 && Move < -150) ||
                (contentOffset > this.state.middleHeight && Move < -50 && velocity > 4.5))  {     //  滚回到最顶部
                this.refs.scrollView.scrollTo({y:0,animated:true})
                this.setState({ScrollAdsorbent:'bottom'})
            } else {
                // console.log('缺省判断')
                // console.log('速度',e.nativeEvent.velocity.y)
                // console.log('移动距离',Move)
                // console.log('方向',ScrollAdsorbent)
                // console.log('位置',contentOffset,'中间高度',this.state.middleHeight)
            }
        }
    }
    _onRefresh = () => {
        this.setState({
            refreshing:true
        })
        setTimeout(() => {
            this.setState({
                refreshing:false
            })
        },600)
    }
    render () {
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
            >
                <View style={styles.firstView}>
                    <Text style={{fontSize:50,color:'#fff'}} ref={'title'}>123</Text>
                </View>
                <View style={{height:500,backgroundColor:'rgba(255,255,225,.2)'}}>
                    <Text>456</Text>
                </View>
                <View style={{backgroundColor:'rgba(255,255,225,7)',height:500,}}>
                    <Text>789</Text>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    firstView:{
        justifyContent:'flex-end',
        height:ViewHeight,
        alignItems:'flex-start',
        // backgroundColor:'rgba(255,255,255,.8)'
    }
})