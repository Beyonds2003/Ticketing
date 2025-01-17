import mongoose from "mongoose";

interface userAttrs {
  email: string,
  password: string
}

interface userModel extends mongoose.Model<userDoc> {
  build(attrs: userAttrs): userDoc
}

interface userDoc extends mongoose.Document {
  email: string,
  password: string
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

userSchema.statics.build = (attrs: userAttrs) => {
  return new User(attrs)
}

const User = mongoose.model<userDoc, userModel>("User", userSchema)


export { User }
