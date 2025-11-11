const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
// fire base sdk ----------
/*  AH7Jo0iwrIR46CEq
 theBookHaven */

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.kpwp5y5.mongodb.net/?appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const db = client.db("theBookHaven");
    const bookCollection = db.collection("books");

    // find and findOne for get method
    app.get("/books", async (req, res) => {
      const result = await bookCollection.find().toArray();
      res.send(result);
    });
    //  details books 
      app.get("/books/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      const objectId = new ObjectId(id);
      const result = await bookCollection.findOne({ _id: objectId });
      res.send({
        success: true,
        result,
      });
    });

    //  search book 
     app.get("/search", async (req, res) => {
      const search_text = req.query.search;
       console.log("Search query:", search_text);
      const result = await bookCollection
        .find({ title: { $regex: search_text, $options: "i"} })
        .toArray();
        console.log('searching ',result)
      res.send(result);
    }); 
     
    // add book 
      // insertOne
    app.post("/books", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await bookCollection.insertOne(data);
      res.send({
        success: true,
        result,
      });
    });







    

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
