// import Icon from 'react-native-vector-icons'
import {createAppContainer,createStackNavigator} from 'react-navigation'

import Home from '../component/Home'
import Search from '../component/Search'

// export default createAppContainer(createDrawerNavigator({
//     Home:createStackNavigator({
//         Home:{
//             screen:Home,
//             navigationOptions:{
//                 header:null
//             }
//         }
//     }),
//     Search:createStackNavigator({
//         Search:{
//             screen:Search,
//             navigationOptions:{
//                 header:null
//             }
//         }
//     })
// },{
//     // mode:'card',
//     // headerMode:'float'
// }))

export default createAppContainer(createStackNavigator({
    Home:{
        screen:Home,
        navigationOptions:{
            header:null
        }
    },
    Search:{
        screen:Search,
        navigationOptions:{
            header:null
        }
    }
}))