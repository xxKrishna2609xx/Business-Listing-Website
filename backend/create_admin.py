import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "nearlly_db")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)

async def create_admin():
    print(f"Connecting to database: {DATABASE_NAME}")
    
    email = os.getenv("ADMIN_EMAIL", "admin@gmail.com")
    password = os.getenv("ADMIN_PASSWORD", "ADMIN@123")
    
    hashed_password = pwd_context.hash(password)
    
    # Check if user already exists
    user = await db.users.find_one({"email": email})
    
    if user:
        print(f"User {email} exists, updating role and password...")
        await db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "password": hashed_password,
                    "role": "admin"
                }
            }
        )
        print("User updated successfully!")
    else:
        print(f"User {email} does not exist, creating new admin user...")
        result = await db.users.insert_one({
            "name": "Admin User",
            "email": email,
            "phone": "1234567890",
            "password": hashed_password,
            "role": "admin",
            "createdAt": datetime.utcnow().isoformat()
        })
        print(f"Created admin user with ID: {result.inserted_id}")
        
    client.close()

if __name__ == "__main__":
    asyncio.run(create_admin())
