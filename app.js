import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const env = dotenv.config();

const app = new express();

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).json({"test":"test123"});
});

const port = process.env.PORT || 3300;

app.listen(3300, () => {
    console.log(`Listening on port ${port}`);
});