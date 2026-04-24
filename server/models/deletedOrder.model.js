const mongoose = require('mongoose');

const DeletedOrderSchema = new mongoose.Schema(
  {
    originalOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deletedAt: { type: Date, required: true },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DeletedOrder', DeletedOrderSchema);
