import {Dimensions, Platform} from "react-native";

/*
* 判断是否是IphoneX
* */
// export function isIphoneX() {
//     const X_WIDTH = 375;
//     const X_HEIGHT = 812;
//
//     const screenW = Dimensions.get('window').width;
//     const screenH = Dimensions.get('window').height;
//
//     console.log(Dimensions.get('window'))
//     return (
//         Platform.OS === 'ios' &&
//         ((screenH === X_HEIGHT && screenW === X_WIDTH) ||
//             (screenH === X_WIDTH && screenW === X_HEIGHT))
//     )
// }

export function isIphoneX() {
    const {width,height} = Dimensions.get('window')
    //iphoneX 序列机型的屏幕高宽
    //XSM SCREEN_HEIGHTL = 896.000000,SCREEN_WIDTHL = 414.000000  2.1642512077
    //XS  SCREEN_HEIGHTL = 812.000000,SCREEN_WIDTHL = 375.000000  2.1653333333
    //XR  SCREEN_HEIGHTL = 896.000000,SCREEN_WIDTHL = 414.000000  2.1642512077
    //X   SCREEN_HEIGHTL = 812.000000,SCREEN_WIDTHL = 375.000000  2.1653333333

    //目前iPhone X序列手机的适配算法：高宽比先转换为字符串，截取前三位，转换为number类型 再乘以100
    const IsX = Platform.OS === 'ios' && (Number(height / width) + "").substr(0,4) * 100 === 216
    console.log(IsX)
    return IsX
}