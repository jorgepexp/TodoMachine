import mongodb from 'mongodb';

const mongoClient = mongodb.MongoClient;

export default async function connect() {
  let client;
  try {
    client = await mongoClient.connect(process.env.DB_URI, {
      poolSize: 50,
      wtimeout: 2500,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      writeConcern: {
        w: null,
      },
    });
  } catch (error) {
    console.log(error.stack);
    process.exit(1);
  }
  return client;
}
