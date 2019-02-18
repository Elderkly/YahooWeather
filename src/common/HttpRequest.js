
export default class Fetch {
  static get(url) {
    return new Promise((resolve,reject) => {
      fetch(url)
        .then(response => response.json())
        .then( result => {
          resolve(result)
        })
        .catch(error => {
          reject(erroe)
        })
    })
  }
  static post(url,data) {
    //  query string
    let string = ''
    for (let x  in data) {
      string += string == '' ?  `${x}=${data[x]}` : `&${x}=${data[x]}`
    }
    return new Promise((resolve,reject) => {
      fetch(url,{
        method:'POST',
        header: {
          'Accept':'application/json',
          'Content-Type':'application/json'
          // 'Content-Type':'application/x-www-form-urlencoded'
        },
        body: JSON.stringify(data)
        // body:string
      })
        .then(response => response.json())
        .then( result => {
          resolve(result)
        })
        .catch(error => {
          reject(erroe)
        })
    })
  }
}