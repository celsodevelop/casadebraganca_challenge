import { v2 as cloudinary } from "cloudinary";
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

export const removePhoto: RequestHandler = async (req, res, next) => {
  const { fileToRemove = '' } = res.locals
  try {
    if (!fileToRemove) {
      return res.status(StatusCodes.ACCEPTED).end()
    }
    const fileRemovedInfo = await cloudinary.uploader.destroy(fileToRemove)
    console.log(fileRemovedInfo);
    return res.status(StatusCodes.ACCEPTED).end()
  } catch (error) {
    return next(error)
  }
};