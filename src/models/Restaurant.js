import mongoose from 'mongoose';

const Restaurant = mongoose.model('Restaurants', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contacts: {
        type: Object,
        default: new Object()
    },
    locationLink:{
        type: String,
        required: true
    }
}));

export default Restaurant;