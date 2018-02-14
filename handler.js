const request = require('request-promise')
const storage = require('azure-storage')
const uuid = require('uuid/v4')

const getFile = (dir, filename) => {
  return new Promise((resolve, reject) => {
    const fs = storage.createFileService(process.env.CONN_STR)

    fs.getFileToText(process.env.CONN_SHARE,
      dir,
      filename,
      (err, data) => {
        if (err) return reject(err)
        resolve(data)
      })
  })
}

const deleteFile = (dir, filename) => {
  return new Promise((resolve, reject) => {
    const fs = storage.createFileService(process.env.CONN_STR)

    fs.deleteFileIfExists(process.env.CONN_SHARE,
      dir,
      filename,
      (err, data) => {
        if (err) return reject(err)
        resolve(data)
      })
  })
}

const createFile = (dir, filename, data) => {
  return new Promise((resolve, reject) => {
    const fs = storage.createFileService(process.env.CONN_STR)

    fs.createFileFromText(process.env.CONN_SHARE,
      dir,
      filename,
      data,
      (err, data) => {
        if (err) return reject(err)
        resolve(data)
      })
  })
}

module.exports.upload = (context) => {
  const id = uuid()
  const img = context.req.body

  if (!img) {
    context.res = { status: 400 }
    return context.done()
  }

  createFile(process.env.IN_DIR, `${id}.dat`, img)
    .then(() => {
      context.res = {
        // status: 200, /* Defaults to 200 */
        body: JSON.stringify({id}),
      }
    })
    .catch((err) => {
      context.res = {
        status: err ? 500 : 400,
        body: JSON.stringify({error: err || 'missing body'})
      }
    })
    .then(() => {
      context.done()
    })
}

module.exports.download = (context) => {
  const filename = context.req.query.filename
  
  if (!filename) {
    context.res = { status: 400 }
    return context.done()
  }

  getFile(process.env.OUT_DIR, filename)
    .then((data) => {
      context.res = {
        // status: 200, /* Defaults to 200 */
        body: data,
      }
    })
    .catch((err) => {
      context.res = {
        status: err ? 500 : 400,
        body: JSON.stringify({error: err || 'missing body'})
      }
    })
    .then(() => {
      context.done()
    })
}
