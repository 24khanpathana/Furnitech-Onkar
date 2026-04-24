const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, trim: true },
    customerName: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true },
    address: { type: String, default: '', trim: true },
    productName: { type: String, required: true, trim: true },
    materialType: { type: String, default: '', trim: true },
    productDetails: { type: String, default: '', trim: true },
    date: { type: Date, required: true },
    branch: { type: String, required: true, trim: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workerName: { type: String, required: true, trim: true },
    workerEmail: { type: String, required: true, trim: true },
    status: {
      type: String,
      required: true,
      default: 'Pending',
      enum: [
        'Pending',
        'Cutting and Sizing',
        'Shaping and Milling',
        'Joinery and Assembly',
        'Sanding and Surface Preparation',
        'Finishing',
        'Quality Inspection',
        'Completed',
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
