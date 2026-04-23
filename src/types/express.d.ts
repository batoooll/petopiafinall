// this folder tells TypeScript that you have added custom properties to the standard Express Request object.
// Without this file, when you try to use req.user or req.file in your controllers, TypeScript will throw an error saying: "Property 'user' does not exist on type 'Request'."

import { User } from '../../generated/prisma'; // Import your generated User type

declare global {
  namespace Express {
    interface Request {
      user?: User; // Add the user property
      file?: Express.Multer.File; // Add the file property
    }
  }
}