export const initWeather = {
    city:[
        {
            name: "深圳",
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