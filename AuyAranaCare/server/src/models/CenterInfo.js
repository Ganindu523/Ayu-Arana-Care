import mongoose from 'mongoose';

const centerInfoSchema = new mongoose.Schema({
  branchName: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true }, // <-- NEW FIELD
  image: { type: String, required: true },
}, { 
    timestamps: true,
    collection: 'centerinfos'
});

export default mongoose.models.CenterInfo || mongoose.model("CenterInfo", centerInfoSchema);