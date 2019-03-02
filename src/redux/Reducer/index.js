import {initWeather} from '../Action'

export default (state = initWeather,action) => {
    switch (action.type) {
        case 'setWeather' : 
            return {
                ...state,
                text:'reducer-setWeather'
            }
        default : 
            return {
                ...state
            }
    }
}