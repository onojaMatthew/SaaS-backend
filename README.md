# 📚 SaaS Content Recommendation Platform

This is a Node.js-based SaaS backend platform that supports content creation and personalized recommendations using **content-based filtering**. It provides APIs for business and user account management, content operations, and tailored content recommendations.

---

## 🚀 Features

- **Business Account Management**
  - Registration
  - Login with JWT Authentication

- **User Account Management**
  - Registration
  - Login with JWT Authentication

- **Content Management**
  - Create, update, and delete content (by businesses)
  - Retrieve public or recommended content (by users)

- **Content Recommendation Engine**
  - Content-based filtering
  - Personalized content suggestions based on user interaction

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB
- **Authentication:** JWT
- **Caching:** Redis 
- **Recommendation Engine:** TensorFlow.js 

---

## 📁 Folder Structure


A content recommendation app SaaS backend

├── src/
│ ├── config/ # Configuration for database, Redis, environment keys references
│ ├── controllers/ # Route logic
│ ├── middleware/ # Authentication, validation
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API route definitions
│ ├── services/ # Business and recommendation logic
│ ├── types/ # TypeScript interfaces and type definitions
│ ├── utils/ # Utility functions
│ ├── app.ts # Express app initialization
│ └── server.ts # App entry point
├── tests/ # Unit and integration tests
├── .env # Environment variables
├── package.json
└── README.md



---

## 🔐 Authentication

Authentication is handled via **JWT tokens** for both business and user accounts.

- Protected routes require the token in the `Authorization` header as a Bearer token.

---

## 📦 API Endpoints

### Auth Endpoints

#### `POST /api/v1/auth/business/register`
Register a new business account and return JWT and some busine.

#### `POST /api/v1/auth/business/login`
Login business and return JWT.

#### `POST /api/v1/auth/user/signup`
Register a new user account and returns JWT.

#### `POST /api/auth/user/login`
Login user and return JWT.

---

### Content Endpoints

#### `POST /api/v1/contents`
Create new content (Business only, Auth required). this api assumes that you have the content image link so there is provision for uploading files

#### `GET /api/v1/contents`
Fetch all contents

#### `PUT /api/v1/contents/:id/update`
Edit content (Business only, Auth required).

### `POST /api/v1/contents/:id/rate`
Rate content

### `DELETE /api/v1/contents/:id/delete`
Delete content (Business only. auth required)

#### `GET /api/v1/recommendations`
Get recommended contents for a logged-in user.

#### `GET /api/v1/recommendations/interaction`
Logs user interaction (e.g, view, click rating).

---

📚 Content-Based Filtering Model Documentation

Overview

This module implements a content-based recommendation engine using TensorFlow.js. It learns compressed vector representations (embeddings) of content items and uses these to recommend similar items based on user interaction history.

## 🎯 Recommendation Engine

We use **content-based filtering** to suggest content similar to what the user has previously interacted with or rated.

- Content is vectorized based on features such as categories, ratings, embeddings, title.
- User preferences are aggregated and matched using cosine similarity or TF-IDF weighting.

🧠 Model Architecture
The model is built as an autoencoder neural network:

Input Layer (100 features)
    ↓
Dense (64 units, ReLU)          ← Encoder
    ↓
Dense (20 units, Sigmoid)       ← Embedding Layer
    ↓
Dense (64 units, ReLU)          ← Decoder
    ↓
Dense (100 units, Linear)       ← Output Layer

## Layer Descriptions

| Layer Type          | Description                                       |
| ------------------- | ------------------------------------------------- |
| Input               | Vector of 100 numerical features per content item |
| Dense (64, ReLU)    | Encodes the input into a compact representation   |
| Dense (20, Sigmoid) | Bottleneck layer (content embedding)              |
| Dense (64, ReLU)    | Begins decoding the embedding                     |
| Dense (100, Linear) | Reconstructs original input features              |

Loss & Optimization
Loss Function: meanSquaredError (MSE)

Optimizer: Adam (learningRate: 0.001)

🏋️‍♂️ Training Process

## 1. Data Preparation
Content items are transformed into 100-dimensional feature vectors:

Normalized features:

Title length

Description length

Category length

Ratings count

One-hot encoding:

Type: text, image, video, link

Zero-padding to ensure uniform length

## 2. Model Training

Input and output: same features (autoencoder)

Parameters:

epochs: 50

batchSize: 32

validationSplit: 0.2

Logs training loss using Logger.info


🔍 Embedding Generation
After training:

20-dimensional embeddings are extracted using the embedding layer

Embeddings are:

Stored in memory (this.contentEmbeddings)

Cached in Redis: embedding:content:{contentId} (expires after 24h)

🤖 Recommendation Process

recommendForUser(userId)
Retrieve last 50 interactions for the user

Get embeddings for these content items

Calculate average embedding → user vector

Compute cosine similarity with other content embeddings

Return top-N most similar items (excluding seen ones)

Cosine Similarity

🔄 Model & Embedding Management
updateContentVectors(contentId)
Recomputes and updates the embedding of a given content item

Updates both in-memory and Redis storage

dispose()
Disposes of model to free memory

initializeModel()
Rebuilds and retrains the model if previously disposed

---

🚀 Getting Started
`1. Clone the repo https://github.com/onojaMatthew/SaaS-backend.git`

`cd SaaS-backend`

2. Install dependencies

`npm install`

3. Setup .env

PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/content-recommendation
REDIS_URL=redis://localhost:6379 
REDIS_PASSWORD=AU0NAAIjcDE0MzU2ODA0N2RkMDg0ZWUxYmU0MjIxZmEzMjg5MDkzNHAxMA
REDIS_TTL_CONTENT=3600
REDIS_TTL_RECOMMENDATIONS=1800
REDIS_TTL_ANALYTICS=900
JWT_SECRET=sldaieqpadsuiwe8io220lskall
JWT_EXPIRES_IN=30d


4. Start the server

Before you start the server, ensure that there is a redis server running and a mongodb data running

`npm run dev`

## 🧪 Running Tests


`npm run test`

## Viewing API documentation

visit http://localhost:5000/api_docs


To build the docker container follow the commands below:

From the root directory run:

`docker build -t username/image-name .`

To start the docker container run:

`docker run --env-file .env username/image-name` make sure you add .env at the root directory