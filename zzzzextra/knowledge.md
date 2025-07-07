remeber all the port and res code of 200 204 404 400 500 501 etc




upload route suggestion and package uses

import path from 'path';
import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadRouter = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});
const upload = multer({ storage });
uploadRouter.post('/', upload.single('file'), (req, res) => {
  res.json({ filePath: `/uploads/${req.file.filename}` });
});
export default uploadRouter;
// This code sets up an Express router for handling file uploads using Multer.
// It configures Multer to store uploaded files in a specific directory with a unique filename.
// The uploaded file's path is returned in the response as a JSON object.
// The file is expected to be sent in the request with the field name 'file'.
// The uploaded files will be stored in the 'uploads' directory relative to the current file's location.
// The filename will be a combination of a UUID and the original filename to ensure uniqueness.
// The response will include the file path where the uploaded file can be accessed.
// The router can be mounted in an Express application to handle file upload requests.
// The code uses ES6 modules, so it should be run in an environment that supports them.
// The 'uuid' package is used to generate unique identifiers for the filenames.
// The 'path' module is used to handle file paths in a platform-independent way.
// The 'fileURLToPath' and 'dirname' functions from the 'path' module are used to get the directory name of the current file.
// The 'multer' package is used for handling multipart/form-data, which is used for file uploads.
// The 'express' package is used to create the router and handle HTTP requests.




<!-- try too also add the logic where one user who is admin other then the one who buy this wesite make sure admin can not change the status of other admin untill they are assigned role of super admin -->





??????????????????????????????????????????


# ⭐ Persisting User Favorites Across Sessions

## ✅ Current Setup

- Favorites are currently stored in **localStorage** using utility functions:
  - `addFavoriteToLocalStorage()`
  - `removeFavoriteFromLocalStorage()`
  - `getFavoritesFromLocalStorage()`
- This works **only in the current browser** and for **one device**.
- When the user **logs out and logs back in on another device**, their favorites are **not restored**.

## 🧩 Problem

- **Favorites are lost** when:
  - User clears browser storage.
  - User logs in from a different device.
  - User uses a different browser.
- We need to **store favorites in the backend database**, tied to the logged-in user.

## 🛠️ Suggested Solution: Store Favorites in the Database

### 1. 📦 Add a `favorites` field in your User model

In your `User.js` (or equivalent Mongoose schema):

```js
favorites: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
],
