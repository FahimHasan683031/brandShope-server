const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m2apie0.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("BrandShop");
    const productCollection = database.collection("productCollection");
    const cartCollection = database.collection("cartCollection");

    app.get('/products',async(req,res)=>{
      const result = await productCollection.find().toArray()
      res.send(result)
    })

    app.get('/cart',async(req,res)=>{
      const result = await cartCollection.find().toArray()
      res.send(result)
    })

    app.get('/product/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result)
     })

    app.get('/products/:category',async(req,res)=>{
      const category = req.params.category;
      const query = {brandName:category} 
      const result = await productCollection.find(query).toArray()
      res.send(result)
    })

    

    app.post('/products',async(req,res)=>{
      const product = req.body;
      const result = await productCollection.insertOne(product)
      console.log(result)
      res.send(result)
    })

    app.post('/cart',async(req,res)=>{
      const product = req.body;
      const result = await cartCollection.insertOne(product)
      res.send(result)
    })

    app.put('/products/:id', async(req,res)=>{
      const id = req.params.id;
      const product = req.body;
      const query = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedUSer = {
        $set: {
          name: product.name,
          imageUrl: product.imageUrl,
          brandName: product.brandName,
          productType: product.productType,
          price: product.price,
          rating: product.rating,
          description: product.description
        },
      };

      const result = await productCollection.updateOne(query,updatedUSer,options)
      res.send(result)
    })

    app.delete("/cart/:name", async (req, res) => {
      const name = req.params.name;
      console.log(name)
      const query = {name : name}
      const result = await cartCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('Server is running')

})

app.listen(port,()=>{
    console.log(`the server is running on the port of ${port} `)
})