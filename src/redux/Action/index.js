export const initWeather = {
    city:[
        {
            city: "深圳",
            cityId: "101280601"
        }
    ]
}

export const setWeather = (weather) => (
    {
        type:'setWeather',
        weather
    }
)