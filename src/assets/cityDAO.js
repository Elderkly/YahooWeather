
import react from 'react'
import {AsyncStorage} from 'react-native'

const initCity = {
    city:[
        {
            name: "深圳",
            cityId: "101280601"
        }
    ]
}

export default class CityDao {
    static getCityData = () => {
        return new Promise((resolve) => {
            AsyncStorage.getItem('USER_CITY',(error,res) => {
                // console.log('getAsync',error,res)
                !error && res ? (resolve(JSON.parse(res))) : resolve(initCity.city)
            })
        }) 
    }
    static addCityData = (city) => {
        return new Promise((resolve,reject) => {
            CityDao.getCityData()
                .then(res => {
                    const CITY = res
                    let Result = null
                    const index = CITY.findIndex(e => e.cityId === city.cityId)
                    city.cityId === '' ? reject('无城市ID') : null
                    index === -1 && city.cityId != '' ? (CITY.splice(0,0,city),Result = 'add') : null
                    AsyncStorage.setItem('USER_CITY',JSON.stringify(CITY) ,error => {
                        // console.log('setAsync',error)
                        // console.log(this.CITY)
                        !error ? resolve({CITY:CITY,Result:Result,length:CITY.length,index}) : reject(e)
                    })
                })
        })
    }
}