//一些主要处理的逻辑代码，比如数据解析，引入路由处理
const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const {set, get} = require('./src/db/redis')

//获取cookie的过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  console.log('d.toGMTString() is', d.toGMTString())
  return d.toGMTString()
}

//通过promise解析postData
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if(req.method !== 'POST') {
      resolve({})
      return
    }
    if(req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if(!postData) {
        resolve({})
        return
      }
      resolve(JSON.parse(postData))
    })
  })
  return promise
}

const serverHandle = (req, res) => {
  res.setHeader('Content-type', 'application/json')
  //获取path
  const url = req.url
  req.path = url.split('?')[0]

  //解析query
  req.query = querystring.parse(url.split('?')[1])

  //解析cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if(!item) {
      return
    }
    const arr = item.split('=')
    const key = arr[0].trim()
    const val = arr[1].trim()
    req.cookie[key] = val
  })
  console.log('req.cookie:',req.cookie);

  //解析session
  let needSetCookie = false
  let userId = req.cookie.userid
  if(!userId) {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    // 初始化 redis 中的 session 值
    set(userId, {})
  }
  req.sessionId = userId
  get(req.sessionId).then(sessionData => {
    if(sessionData == null) {
      // 初始化 redis 中的 session 值
      set(req.sessionId, {})
      // 初始化 session 值
      req.session = {}
    } else {
      // 设置 session 值
      req.session = sessionData
    }
    // post data
    return getPostData(req)//解析postData
  }).then(postData => {
    req.body = postData
    //处理blog路由
    const blogResult = handleBlogRouter(req, res)
    if(blogResult) {
      // console.log(blogResult)
      blogResult.then(blogData => {
        if(needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly;expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(blogData))
      })
      return
    }

    //处理user路由
    const userResult = handleUserRouter(req, res)
    if(userResult) {
      userResult.then(userData => {
        if(needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly;expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(userData))
      })
      return
    }
    //未命中路由，返回404
    res.writeHead(404, {"Content-type": "text/plain"})
    res.write("404 Not Found\n")
    res.end()
  })
}

module.exports = serverHandle

//process.env.NODE_ENV