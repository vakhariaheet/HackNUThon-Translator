import { model, Schema } from 'mongoose';

const ClientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,

    },
    password: {
        type: String, 
    },

}, {
    timestamps: true,
});



const Client = model('Client', ClientSchema);
export default Client;

