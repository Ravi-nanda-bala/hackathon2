import { createConnection } from "./index.js";

export async function getUsers() {
    const client = await createConnection();
    const users = await client.db("flipkart").collection("users").find({}).toArray();
    return users;
}

export async function getUserById(id) {
    const client = await createConnection();
    const result = await client.db("flipkart").collection("users").find({ id: id }).toArray();
    return result;
}

export async function getBrands() {
    const client = await createConnection();
    const result = await client.db("flipkart").collection("brands").find({}).toArray();
    return result;
}
export async function addUser(name, avatar, hashedPassword) {
    const client = await createConnection();
    const result = await client.db("flipkart").collection("users").
        insertOne({ name: name, avatar: avatar, password: hashedPassword, createdAt: new Date().toISOString() });
}



// export {getUsers,getUserById,getBrands};
// We can export mutiple files like in 21 line