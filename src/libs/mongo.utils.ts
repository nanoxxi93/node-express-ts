import mongoose from 'mongoose'

export const mongoInit = async () => {
  mongoose.connect(process.env.MONGO_DB_URI!, {
    dbName: process.env.MONGO_DB_NAME,
    user: process.env.MONGO_DB_USER,
    pass: process.env.MONGO_DB_PASS,
  })
  mongoose.connection.on('connected', function () {
    console.log(
      `Mongoose default connection is open to ${process.env.MONGO_DB_URI}`,
    )
  })
  mongoose.connection.on('error', function (err) {
    console.log(`Mongoose default connection has occured ${err} error`)
  })
  mongoose.connection.on('disconnected', function () {
    console.log(`Mongoose default connection is disconnected`)
  })
}

const userSchema = new mongoose.Schema(
  {
    username: { type: String, trim: true },
    password: { type: String },
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true },
    status: { type: String },
    role: {
      code: { type: String },
      description: { type: String },
    },
  },
  {
    methods: {
      findByRole(role: string) {},
    },
  },
)

export const User = mongoose.model('User', userSchema)
