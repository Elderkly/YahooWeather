import React,{Component} from 'react'
import {
  View,
  Text,
  StatusBar,
  StyleSheet, Platform,Dimensions
} from 'react-native';
//  约束props
import PropTypes from 'prop-types'


const NAV_BAR_HEIGHT_ANDROID = 50; //  安卓下的高度
const NAV_BAR_HEIGHT_IOS =  44;  //  IOS下的高度
const STATUS_BAR_HEIGHT = 20;

import {isIphoneX} from './util'

const StatusBarShape = {
  backgroundColor:PropTypes.string, //状态栏颜色
  barStyle:PropTypes.oneOf(['default', 'light-content', 'dark-content']),  //状态栏文本颜色  oneOf() 通过枚举确保返回的props在特定的值范围内 在这里只返回括号内的三个值
  // hidden:PropTypes.bool,  //  状态栏是否隐藏
  hidden:false
}

export default class NavigationBar extends Component {
  //  约束传入的props
  static propTypes = {
    style: PropTypes.object, // 样式
    title: PropTypes.string, //标题
    titleView: PropTypes.element,  //  标题View
    hide: PropTypes.bool,  //是否隐藏
    leftButton: PropTypes.element,//左侧按钮
    rightButton: PropTypes.element,//右侧按钮
    statusBar:PropTypes.shape(StatusBarShape) //状态栏样式    shape() 采用特定样式的对象
  };

  static defaultProps = {
    statusBar:{
      barStyle: 'light-content',
      hidden:false
    }
  }
  constructor(props) {
    super(props)
    //  设置默认值
    this.state = {
      title: '',
      hide:false
    }
  }

  render() {
    // console.log(DeviceInfo.getModel())
    //  状态栏
    //  IOS不支持直接修改StatusBar 所以只能修改外层view
    let status = <View style={[styles.statusBar,this.props.statusBar]}>
      <StatusBar
          {...this.props.statusBar}
          translucent={true}
          backgroundColor={'rgba(0,0,0,0)'}
      ></StatusBar>
    </View>
    //  如果同时传入title和titleview 则优先显示titleview
    let titleView = this.props.titleView ? this.props.titleView : <Text style={styles.title}>{this.props.title}</Text>

    let content = <View style={styles.navBar}>
      {this.props.leftButton}
      <View style={styles.titleView}>
        {titleView}
      </View>
      {this.props.rightButton}
    </View>
    return (
        <View style={[styles.container,this.props.style]}>
          {status}
          {content}
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    // backgroundColor:'#ddd'
    paddingTop: isIphoneX() ? 20 : 0,
    paddingBottom: isIphoneX() ? 8 : 0
  },
  navBar:{
    justifyContent: 'space-between',
    alignItems:'center',
    height:Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
    flexDirection: 'row'
  },
  titleView:{
    position:'absolute',
    left:40,
    right:40,
    bottom:0,
    top:0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title:{
    fontSize:20,
    color:'#fff'
  },
  statusBar:{
    height:Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
    paddingTop: Platform.OS === 'ios' ? 0 : 20
  }
})