import {initWeather} from '../Action'

export default (state = initWeather,action) => {
    switch (action.type) {
        case 'setWeather' : 
            return {
                city:action.weather,
                text:'reducer-setWeather'
            }
        default : 
            return {
                ...state
            }
    }
}