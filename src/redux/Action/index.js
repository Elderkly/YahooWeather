export const initWeather = {
    city:{
        city: "深圳市",
        cityId: "101280601"
    }
}

export const setWeather = (weather) => (
    {
        type:'setWeather',
        weather
    }
)