import { IStorageClient, UploadOptions, UploadResult } from "./IStorageClient";
import { AppError, HttpCode } from "../../common/errors/AppError";

export class CloudStorageClient implements IStorageClient {
  // TODO: Implement cloud storage client (e.g., AWS S3, Google Cloud Storage, Azure Blob)
  
  async upload(
    _buffer: Buffer,
    _filename: string,
    _folder: string,
    _options?: UploadOptions
  ): Promise<UploadResult> {
    throw new AppError(
      "Cloud storage is not yet implemented. Please use local storage.",
      HttpCode.INTERNAL_SERVER_ERROR
    );
  }

  async delete(_storageKey: string): Promise<boolean> {
    throw new AppError(
      "Cloud storage is not yet implemented.",
      HttpCode.INTERNAL_SERVER_ERROR
    );
  }

  async getPublicUrl(_storageKey: string): Promise<string> {
    throw new AppError(
      "Cloud storage is not yet implemented.",
      HttpCode.INTERNAL_SERVER_ERROR
    );
  }
}
