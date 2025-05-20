import { ApolloServer } from "apollo-server";
import connectDb from "./config/db.js";
import { schema } from "./schema/index.js";
import { resolvers } from "./controllers/user.js";

const app = new ApolloServer({
    typeDefs: schema,
    resolvers
})
connectDb()
app.listen(4000).then(() => console.log('server is runing on 4000'))
    .catch((err) => console.log(err))