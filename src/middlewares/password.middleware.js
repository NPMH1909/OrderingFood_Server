import bcrypt from "bcrypt"

const createHash = async (data) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(data, salt)
        return hash
    } catch (error) {
        throw error
    }
}

const checkPassword = async (data, hash) => {
    try {
      const result = await bcrypt.compare(data, hash)
      return result
    } catch (error) {
      console.error('Error comparing password:', error)
      throw error
    }
  }
  export { createHash, checkPassword }
