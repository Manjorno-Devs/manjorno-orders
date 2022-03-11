import mongoose from 'mongoose';
import mongooseDbref from 'mongoose-dbref';

const Orders = mongoose.model('Orders', new mongoose.Schema({
    customerId: {
        type: String,
        required: true
    },
    delivererId: {
        type: String
    },
    restaurantId: {
        type: mongoose.ObjectId,
        ref: 'Restaurants'
    },
    items: [{
        type: mongoose.ObjectId,
        ref: 'MenuItem'
    }],
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Not accepted', 'Canceled', 'In Progress', 'Ready for delivery', 'Delivering', 'At the address', 'Received'],
        default: 'Not accepted',
    },
    dateTimeOrdered: {
        type: Date,
        default: new Date()
    }
}));

export default Orders;