# QR Pass System Backend

This is the **backend** of the QR Pass System, which manages student registration, course information, admin authentication, and AES-encrypted QR code generation.

---

## 🚀 Getting Started

### 1. Clone the repository and navigate to the backend folder:

```bash
cd QR_PASS_BE
```

### 2. Install all dependencies:

```bash
npm install
```

### 3. Create a `.env` file in the root of `QR_PASS_BE`:

Paste the following and replace the values with your own:

```env
PORT=4000
DB_NAME=graduation_pass
MONGO_URI="your_mongodb_srv_link"
ADMIN_SECRET="yoursecretadminpass"
```

---

## 📦 Running the Backend Server

To run the server in development mode:

```bash
npm run dev
```

> Make sure you have `nodemon` installed under `devDependencies`.

---

## 📬 API Testing with Postman

### 1. Add Course Data (Bulk Insert)

* **Method:** POST
* **URL:** `http://localhost:4000/api/courses/bulk`
* **Body (raw JSON):**

```json
{
  "courses": [
    { "name": "Bachelor of Arts in Communication", "encryptionKey": "key1_key1_key1__" },
    { "name": "Bachelor of Science in Business Administration", "encryptionKey": "key2_key2_key2__" },
    { "name": "Bachelor of Science in Civil Engineering", "encryptionKey": "key3_key3_key3__" },
    { "name": "Bachelor of Science in Computer Engineering", "encryptionKey": "key4_key4_key4__" },
    { "name": "Bachelor of Science in Criminology (New Program)", "encryptionKey": "key5_key5_key5__" },
    { "name": "Bachelor of Early Childhood Education (BECEd)", "encryptionKey": "key6_key6_key6__" },
    { "name": "Bachelor of Elementary Education (BEEd)", "encryptionKey": "key7_key7_key7__" },
    { "name": "Bachelor of Science in Hospitality Management", "encryptionKey": "key8_key8_key8__" },
    { "name": "Bachelor in Human Services (New Program)", "encryptionKey": "key9_key9_key9__" },
    { "name": "Bachelor of Science in Industrial Engineering", "encryptionKey": "key10_key10_key1" },
    { "name": "Bachelor of Science in Information Technology", "encryptionKey": "key11_key11_key1" },
    { "name": "Bachelor of Library and Information Science (New Program)", "encryptionKey": "key12_key12_key1" },
    { "name": "Bachelor of Science in Nursing", "encryptionKey": "key13_key13_key1" },
    { "name": "Bachelor of Science in Pharmacy (New Program)", "encryptionKey": "key14_key14_key1" },
    { "name": "Bachelor of Physical Education (BPEd)", "encryptionKey": "key15_key15_key1" },
    { "name": "Bachelor of Science in Psychology", "encryptionKey": "key16_key16_key1" },
    { "name": "Bachelor of Secondary Education", "encryptionKey": "key17_key17_key1" }
  ]
}
```

### 2. Register Admin

* **Method:** POST
* **URL:** `http://localhost:4000/api/admin/register`
* **Body (raw JSON):**

```json
{
  "adminId": "ADMIN001",
  "username": "superadmin",
  "password": "password123"
}
```

> You will use this admin account to log into the frontend admin dashboard.

---

## 🌐 Frontend Access

1. Navigate to the `QR_PASS_FE` folder.
2. Open `index.html` with Live Server or a web browser.

---

## 📁 .gitignore

Make sure your `.gitignore` includes:

```gitignore
.env
node_modules/
```

---

## 📜 Additional Notes

* All QR codes are generated using AES encryption with course-specific keys.
* The backend is built with Express.js, MongoDB via Mongoose, and CryptoJS for encryption.

---

## 📄 License

MIT License – use freely with attribution.


