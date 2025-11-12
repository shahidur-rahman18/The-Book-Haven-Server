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
    const commentCollection = db.collection("comments");
    const downloadCollection = db.collection("downloads");

    // find and findOne for get method
    app.get("/books", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = { userEmail: email };
      }
      const result = await bookCollection.find(query).toArray();
      res.send(result);
    });

    // comments 
      
    app.get("/comments", async (req, res) => {
      const result = await commentCollection.find().toArray();
      console.log('this is ',result)
      res.send(result);
    });

    // post comment 
     app.post("/comments", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await commentCollection.insertOne(data);
      res.send({
        success: true,
        result,
      });
    });


    //  details books
    app.get("/books/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      const objectId = new ObjectId(id);
      const result = await bookCollection.findOne({ _id: objectId });
      console.log(result);
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
        .find({ title: { $regex: search_text, $options: "i" } })
        .toArray();
      console.log("searching ", result);
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

    // for my downloads
    // post
    app.post("/downloads/:id", async (req, res) => {
      const data = req.body;
      //downloads collection...
      const result = await downloadCollection.insertOne(data);
      res.send(result);
    });

    // download get
    app.get("/my-downloads", async (req, res) => {
      const email = req.query.email;
      const result = await downloadCollection
        .find({ userEmail: email })
        .toArray();
      res.send(result);
    });

    // update book
    app.put("/books/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body; //data from frontend
      // console.log(id);
      const objectId = new ObjectId(id);
      const filter = { _id: objectId };
      const update = {
        $set: data,
      };
      const result = await bookCollection.updateOne(filter, update);

      res.send({
        success: true,
        result,
      });
    });

    // delete book
    app.delete("/books/:id", async (req, res) => {
      const { id } = req.params;
      // console.log(id);
      // const objectId = new ObjectId(id);
      // const filter = { _id: objectId };

      const result = await bookCollection.deleteOne({ _id: new ObjectId(id) });
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
