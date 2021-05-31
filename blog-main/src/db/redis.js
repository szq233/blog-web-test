const redis = require('redis')
const { REDIS_CONF }= require('../conf/db')

//创建redis客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

redisClient.on('error', err=> {
  console.error(err)
})

function set(key, val) {
  //只保存字符串，默认对val执行toString()
  //对对象使用JSON.stringify()比使用.toSting()更符合预期
  if(typeof val === 'object') {
    val = JSON.stringify(val)
  }
  redisClient.set(key, val, redis.print)
}
function get(key) {
  const promise = new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if(err){
        reject(err)
        return
      }
      if(val == null) {
        resolve(null)
        return
      }
      try {
        resolve(JSON.parse(val))
      }catch (ex) {
        resolve(val)
      }
    })
  })
  return promise
}
module.exports = {
  set,
  get
}