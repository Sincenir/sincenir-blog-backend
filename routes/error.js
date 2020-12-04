class BusinessError extends Error {
    constructor (code, msg) {
      super(msg)
      this.status = code
      this.msg = msg
      this.name = 'BusinessError'
    }
  }
  
module.exports = BusinessError;
// export default BusinessError