import dotenv from "dotenv";
import express, { request, response } from "express"; 
import { MongoClient } from "mongodb"; 
import cors from "cors";
import bcrypt from "bcrypt";
import { getUserById, getUsers,getBrands, addUser } from "./helper.js";

dotenv.config();

const app = express();

const PORT = 4000;
const MONGO_URL = "mongodb+srv://srujitha0411:sruji123@cluster0.gzusp.mongodb.net";


async function genPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password,salt);
    console.log(hashedpassword);
    return hashedpassword;
}

 export async function createConnection() {
    const client =new MongoClient(MONGO_URL);
    await client.connect();
    return client;
   
}

app.use(cors());
app.use(express.json()); 

app.get("/",(request, response) =>{
    response.send("Hello Guvi!!!!!!!!!!!!!!");
});
app.post("/user",async(request,response) =>{
    const userdata = request.body;
    
    const client = await createConnection();
    const result = await client.db("flipkart").collection("users").insertOne(userdata);
    response.send(result);
    response.send({msg: "Created user"});
});

app.get("/users",async(request,response) =>{
    const users = await getUsers();
    response.send(users);
    console.log(users);
});

app.get("/users/:id", async(request,response) =>{
   const { id } = request.params;
   console.log("id",id);
    const result = await getUserById(id);
    response.send(result);
    console.log(result);
});

app.get("/brands",async(request,response) =>{
    const result = await getBrands();
    response.send(result);
});

app.post("/signup",async(request,response) =>{
    const {name , password, avatar} = request.body;
    const hashedPassword = await genPassword(password);
    const result = await addUser(name, avatar, hashedPassword);
    response.send(result);
});

app.post("/login",async (request, response) => {
    const { name, password } = request.body;
    const user = await searchUserByName(name);
    console.log(user);

    if (user) {
    const passwordInDb = user.password;
    const loginPassword = password;
    console.log(passwordInDb)
    console.log(loginPassword)
    const passwordMatch = await bcrypt.compare(loginPassword,passwordInDb);

    console.log(passwordMatch)
    
    if(passwordMatch) {
        response.send( {message:"login successful!"} )
    }
    else {
        response.send( {message:"invalid"} )
    }
    } 
    else {
        response.send( {message:"invalid"} )
    }
});


async function searchUserByName(name) {
    const client = await createConnection();
    const users = await client
    .db("flipkart")
    .collection("users")
    .findOne({ name:name })
    return users;
}

app.listen(PORT,() => console.log("The Server is started", PORT));

