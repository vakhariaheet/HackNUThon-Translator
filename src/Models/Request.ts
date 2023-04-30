import { model, Schema } from 'mongoose';

const RequestSchema = new Schema({
    clientID: {
        type: Schema.Types.ObjectId,
    },
    TemplateID: {
        type: Schema.Types.ObjectId,
    },
},{timestamps: true});


const Request = model('Request', RequestSchema);
export default Request;