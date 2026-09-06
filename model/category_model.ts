import mongoos, { Schema } from "mongoose";

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

export default mongoos.model("Category", categorySchema);
