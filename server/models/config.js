const mongoose = require("mongoose");
const { Schema } = mongoose;

const ConfigSchema = new Schema({
  numActual: { type: Number, required: true, unique: true },
});

module.exports = mongoose.model("config", ConfigSchema);
