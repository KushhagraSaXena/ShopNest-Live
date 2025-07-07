import e from "express";
import { isValidObjectId } from "mongoose";

function checkId(req, res, next) {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid ID format" });
    throw new Error(`Invalid Object ID: ${id}`);
  }

  next();
}

export default checkId;
// This middleware checks if the provided ID in the request parameters is a valid MongoDB ObjectId.