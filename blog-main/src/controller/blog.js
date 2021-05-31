//操作数据层面
const { exec } = require('../db/mysql')

const getList = (author, keyword) => {
  //假数据
  // return [
  //   {
  //     id: 1,
  //     title: '标题1',
  //     content: '内容1',
  //     createTime: 1621885631957,
  //     author: 'zhangsan'
  //   }
  // ]
  let sql =  `select * from blogs where 1=1 `
  if(author) {
    sql += `and author='${author}' `
  }
  if(keyword) {
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createtime desc;`

  //返回的是promise
  return exec(sql)
}

const getDetail = (id) => {
  // //假数据
  // return {
  //   id: 1,
  //   title: '标题1',
  //   content: '内容1',
  //   createTime: 1621885631957,
  //   author: 'zhangsan'
  // }
  const sql = `select * from blogs where id='${id}'`
  return exec(sql).then(rows => {
    return rows[0]
  })
}

const newBlog = (blogData = {}) => {
  //blogData是一个博客对象，包含title content属性
  // console.log('newBlog blogData...', blogData)
  const title = blogData.title
  const content = blogData.content
  const author = blogData.author
  const createTime = Date.now()
  const sql = `
    insert blogs(title, content, createtime, author)
    values('${title}', '${content}', ${createTime}, '${author}');
  `
  return exec(sql).then(insertData => {
    console.log(insertData)
    return {
      id: insertData.insertId
    }
  })
}

const updateBlog = (id, blogData = {}) => {
  //blogData是一个博客对象，包含title content属性
  const title = blogData.title
  const content = blogData.content
  const sql =  `update blogs set title='${title}',content='${content}' where id=${id};`

  return exec(sql).then(updateData => {
    console.log(updateData)
    if(updateData.affectedRows > 0) {
      return true
    }
    return false
  })
}

const delBlog = (id, author) => {
  //id为要删除的blog的id
  const sql = `delete from blogs where id='${id}' and author='${author}'`
  return exec(sql).then(deleteData => {
    console.log(deleteData)
    if(deleteData.affectedRows > 0) {
      return true
    }
    return false
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}