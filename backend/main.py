from bson import ObjectId
import uvicorn
from fastapi import FastAPI, HTTPException,Depends
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List, Optional
from pydantic import BaseModel
from jose import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


load_dotenv()

app = FastAPI(title="Business Listing API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "nearlly_db")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]

SECRET_KEY = os.getenv("SECRET_KEY")
REFRESH_SECRET_KEY = os.getenv("REFRESH_SECRET_KEY")
ALGORITHM = "HS256"
security = HTTPBearer()

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)


@app.on_event("startup")
async def startup_db_client():
    print("Connected to MongoDB database!")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Helper for MongoDB serializing (converting ObjectId to string if any, though our mockData has string ids)
def serializeList(items) -> list:
    return [serializeDict(item) for item in items]

def serializeDict(item):
    item["_id"] = str(item["_id"])
    return item


class LeadCreate(BaseModel):
    businessId: str
    businessName: str
    customerName: str
    phone: str
    email: str = ""
    serviceRequired: str = ""
    message: str = ""

class ReviewCreate(BaseModel):
    businessId: str
    rating: float
    comment: str

class UserRegister(BaseModel):
    name: str
    email: str
    phone: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UpdateProfile(BaseModel):
    name: str
    phone: str

class BookmarkCreate(BaseModel):
    userId: str
    businessId: str

class RejectApplicationRequest(BaseModel):
    reason: str

class BusinessApplication(BaseModel):
    ownerName: str
    email: str
    phone: str

    businessName: str

    categoryId: str
    subcategoryId: str

    categoryName: str
    subcategoryName: str

    address: str
    city: str
    state: str

    website: str = ""
    description: str = ""

    logoUrl: str = ""

    socialMediaLinks: dict = {}

    galleryImages: list = []

    services: list = []

class CategoryCreate(BaseModel):
    id: str
    name: str
    slug: str
    color: str

class SubcategoryCreate(BaseModel):
    id: str
    name: str
    slug: str
    categoryId: str

class CategoryUpdate(BaseModel):
    name: str
    color: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str


# get user via tokens-----
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    )
):

    try:

        token = credentials.credentials

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload["user_id"]

        user = await db.users.find_one(
            {
                "_id": ObjectId(user_id)
            }
        )

        if not user:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        return user

    except:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

# Admin Middleware---------*-------------------
async def get_admin_user(
    current_user=Depends(
        get_current_user
    )
):

    if (
        current_user.get("role")
        != "admin"
    ):
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return current_user


@app.get("/api/categories")
async def get_categories():
    categories = await db.categories.find().to_list(1000)
    return serializeList(categories)

@app.get("/api/subcategories")
async def get_subcategories():
    subcategories = await db.subcategories.find().to_list(1000)
    return serializeList(subcategories)

@app.get("/api/businesses")
async def get_businesses():
    businesses = await db.businesses.find().to_list(1000)
    return serializeList(businesses)

@app.get("/api/businesses/featured")
async def get_featured_businesses():
    businesses = await db.businesses.find({"featured": True}).to_list(1000)
    return serializeList(businesses)

@app.get("/api/businesses/{id}")
async def get_business(id: str):
    try:
        business = await db.businesses.find_one(
            {"_id": ObjectId(id)}
        )
    except:
        raise HTTPException(
            status_code=400,
            detail="Invalid business id"
        )

    if not business:
        raise HTTPException(
            status_code=404,
            detail="Business not found"
        )

    return serializeDict(business)

@app.get("/api/search")
async def search_businesses(
    query: str = "",
    city: str = "",
    pincode: str = ""
):
    filter_query = {}

    if query:
        filter_query["$or"] = [
            {"businessName": {"$regex": query, "$options": "i"}},
            {"description": {"$regex": query, "$options": "i"}},
            {"categoryName": {"$regex": query, "$options": "i"}},
            {"subcategoryName": {"$regex": query, "$options": "i"}},
            {"city": {"$regex": query, "$options": "i"}},
            {"state": {"$regex": query, "$options": "i"}}
        ]

    if city:
        filter_query["city"] = {
            "$regex": city,
            "$options": "i"
        }
    businesses = await db.businesses.find(
        filter_query
    ).to_list(1000)

    return serializeList(
        businesses
    )


@app.post("/api/leads")
async def create_lead(
    lead: LeadCreate,
    current_user=Depends(
        get_current_user
    )
):

    lead_data = {
        **lead.dict(),
        "customerName":
            current_user["name"],
        "email":
            current_user["email"],
        "createdAt":
            datetime.utcnow().isoformat()
    }

    result = await db.leads.insert_one(
        lead_data
    )

    return {
        "success": True,
        "leadId":
            str(result.inserted_id)
    }

@app.get("/api/leads")
async def get_leads():
    leads = await db.leads.find().to_list(1000)
    return serializeList(leads)

@app.get("/api/leads/user/{email}")
async def get_user_leads(email: str):

    leads = await db.leads.find(
        {"email": email}
    ).to_list(1000)

    return serializeList(leads)

@app.delete("/api/leads/{id}")
async def delete_lead(id: str):

    await db.leads.delete_one(
        {"_id": ObjectId(id)}
    )

    return {
        "success": True
    }

def calculate_rating(reviews):

    review_count = len(reviews)

    if review_count == 0:
        return 0, 0

    rating_avg = round(
        sum(
            r["rating"]
            for r in reviews
        ) / review_count,
        1
    )

    return (
        rating_avg,
        review_count
    )

async def update_business_rating(business_id: str):

    reviews = await db.reviews.find({
        "businessId": business_id
    }).to_list(1000)

    rating_avg, review_count = (
        calculate_rating(reviews)
    )

    await db.businesses.update_one(
        {
            "id": business_id
        },
        {
            "$set": {
                "rating": rating_avg,
                "reviewCount": review_count
            }
        }
    )


@app.post("/api/reviews")
async def create_review(
    review: ReviewCreate,
    current_user=Depends(
        get_current_user
    )
):
    existing_review = await db.reviews.find_one({
        "businessId": review.businessId,
        "userId": str(current_user["_id"])
    })
    if existing_review:
        await db.reviews.update_one(
            {"_id": existing_review["_id"]},
            {
                "$set": {
                    "rating": review.rating,
                    "comment": review.comment,
                    "updatedAt": datetime.utcnow().isoformat()
                }
            }
        )

        await update_business_rating(review.businessId)

        return {
            "success": True,
            "message": "Review updated successfully"
        }
    result = await db.reviews.insert_one({

        **review.dict(),

        "customerName":
            current_user["name"],

        "userId":
            str(current_user["_id"]),

        "createdAt":
            datetime.utcnow().isoformat()
    })

    await update_business_rating(review.businessId)

    return {
        "success": True,
        "reviewId": str(result.inserted_id),
        "message": "Review submitted successfully"
    }

@app.get("/api/reviews/{business_id}")
async def get_reviews(business_id: str):

    reviews = await db.reviews.find({
        "businessId": business_id
    }).to_list(1000)

    return serializeList(reviews)

@app.post("/api/auth/register")
async def register(user: UserRegister):

    existing = await db.users.find_one(
        {"email": user.email}
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    hashed_password = pwd_context.hash(
        user.password
    )

    result = await db.users.insert_one({
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "password": hashed_password,
        "role": "user",
        "createdAt": datetime.utcnow().isoformat()
    })

    return {
        "success": True,
        "userId": str(result.inserted_id)
    }

@app.post("/api/auth/login")
async def login(user: UserLogin):

    db_user = await db.users.find_one(
        {"email": user.email}
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not pwd_context.verify(
        user.password,
        db_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    access_token = create_access_token(
        db_user
    )

    refresh_token = create_refresh_token(
        db_user
    )
    await db.users.update_one(
        {"_id": db_user["_id"]},
        {
            "$set": {
                "refreshToken":
                    refresh_token
            }
        }
    )

    return {
        "access_token":access_token,
        "refresh_token":refresh_token,
        "user": {
            "id": str(db_user["_id"]),
            "name": db_user["name"],
            "email": db_user["email"],
            "phone": db_user.get("phone", ""),
            "role": db_user.get("role", "user"),
            "createdAt": db_user.get("createdAt")
        }
    }

@app.put("/api/users/{user_id}")
async def update_profile(
    user_id: str,
    profile: UpdateProfile
):

    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "name": profile.name,
                "phone": profile.phone
            }
        }
    )

    updated_user = await db.users.find_one(
        {"_id": ObjectId(user_id)}
    )

    return {
        "id": str(updated_user["_id"]),
        "name": updated_user["name"],
        "email": updated_user["email"],
        "phone": updated_user.get("phone", "")
    }


@app.post("/api/bookmarks")
async def add_bookmark(
    bookmark: BookmarkCreate,
    current_user=Depends(
        get_current_user
    )
):

    existing = await db.bookmarks.find_one({
        "userId":
            str(current_user["_id"]),
        "businessId":
            bookmark.businessId
    })

    if existing:
        return {"success": True}

    await db.bookmarks.insert_one({
        "userId":
            str(current_user["_id"]),
        "businessId":
            bookmark.businessId
    })

    return {"success": True}


@app.get("/api/bookmarks/{user_id}")
async def get_bookmarks(user_id: str):

    bookmarks = await db.bookmarks.find({
        "userId": user_id
    }).to_list(1000)

    return serializeList(bookmarks)

@app.delete("/api/bookmarks/{user_id}/{business_id}")
async def remove_bookmark(
    user_id: str,
    business_id: str
):

    await db.bookmarks.delete_one({
        "userId": user_id,
        "businessId": business_id
    })

    return {"success": True}


@app.post("/api/business/apply")
async def apply_business(
    application: BusinessApplication,
    current_user=Depends(get_current_user)
):

    result = await db.applications.insert_one({
        **application.dict(),

        "userId":
            str(current_user["_id"]),

        "ownerName":
            current_user["name"],

        "ownerEmail":
            current_user["email"],

        "status":
            "PENDING",

        "createdAt":
            datetime.utcnow().isoformat()
    })

    return {
        "success": True,
        "applicationId":
            str(result.inserted_id)
    }


@app.get("/api/admin/applications")
async def get_applications(
    admin=Depends(
        get_admin_user
    )
):
    applications = await db.applications.find().to_list(1000)

    return serializeList(applications)


@app.get("/api/applications/user/{email}")
async def get_user_applications(email: str):

    applications = await db.applications.find(
        {"email": email}
    ).to_list(1000)

    return serializeList(applications)


@app.put("/api/admin/applications/{id}/approve")
async def approve_application(
    id: str,
    admin=Depends(
        get_admin_user
    )
):

    application = await db.applications.find_one(
        {"_id": ObjectId(id)}
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    await db.businesses.insert_one({

        "id": f"biz-{str(ObjectId())[:8]}",

        "businessName":
            application["businessName"],

        "ownerName":
            application["ownerName"],

        "email":
            application["email"],

        "phone":
            application["phone"],

        "categoryId":
            application["categoryId"],

        "subcategoryId":
            application["subcategoryId"],

        "categoryName":
            application["categoryName"],

        "subcategoryName":
            application["subcategoryName"],

        "address":
            application["address"],

        "city":
            application["city"],

        "state":
            application["state"],

        "website":
            application.get("website", ""),

        "description":
            application.get("description", ""),

        "logoUrl":
            application.get("logoUrl", ""),

        "socialMediaLinks":
            application.get(
                "socialMediaLinks",
                {}
            ),

        "galleryImages":
            application.get(
                "galleryImages",
                []
            ),

        "services":
            application.get(
                "services",
                []
            ),

        "verified": False,
        "featured": False,

        "status": "APPROVED",

        "rating": 0,
        "reviewCount": 0,

        "createdAt":
            datetime.utcnow().isoformat()
    })

    await db.applications.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "status": "APPROVED"
            }
        }
    )

    return {
        "success": True
    }


@app.put("/api/admin/applications/{id}/reject")
async def reject_application(
    id: str,
    payload: RejectApplicationRequest,
    admin=Depends(
        get_admin_user
    )
):

    await db.applications.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "status": "REJECTED",
                "rejectReason": payload.reason
            }
        }
    )
    return {
        "success": True
    }

@app.delete("/api/admin/applications/{id}")
async def delete_application(
    id: str,
    admin=Depends(get_admin_user)
):

    result = await db.applications.delete_one(
        {"_id": ObjectId(id)}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    return {
        "success": True
    }

@app.post("/api/categories")
async def create_category(category: CategoryCreate):

    result = await db.categories.insert_one(
        category.dict()
    )

    return {
        "success": True,
        "id": str(result.inserted_id)
    }

@app.delete("/api/categories/{id}")
async def delete_category(id: str):

    await db.categories.delete_one({
        "id": id
    })

    await db.subcategories.delete_many({
        "categoryId": id
    })

    return {
        "success": True
    }

@app.post("/api/subcategories")
async def create_subcategory(
    subcategory: SubcategoryCreate
):

    result = await db.subcategories.insert_one(
        subcategory.dict()
    )

    return {
        "success": True,
        "id": str(result.inserted_id)
    }

@app.delete("/api/subcategories/{id}")
async def delete_subcategory(id: str):

    await db.subcategories.delete_one({
        "id": id
    })

    return {
        "success": True
    }

@app.put("/api/categories/{id}")
async def update_category(id: str,category: CategoryUpdate):

    await db.categories.update_one(
        {"id": id},
        {
            "$set": {
                "name": category.name,
                "color": category.color
            }
        }
    )

    return {"success": True}


@app.delete("/api/admin/businesses/{id}")
async def delete_business(id: str,admin=Depends(get_admin_user)):
    await db.businesses.delete_one(
        {"_id": ObjectId(id)}
    )

    return {"success": True}

@app.put("/api/admin/businesses/{id}/verify")
async def toggle_verify(id: str,admin=Depends(get_admin_user)):

    business = await db.businesses.find_one(
        {"_id": ObjectId(id)}
    )

    await db.businesses.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "verified": not business.get(
                    "verified",
                    False
                )
            }
        }
    )

    return {"success": True}

@app.put("/api/admin/businesses/{id}/feature")
async def toggle_feature(id: str,admin=Depends(get_admin_user)):

    business = await db.businesses.find_one(
        {"_id": ObjectId(id)}
    )

    await db.businesses.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "featured": not business.get(
                    "featured",
                    False
                )
            }
        }
    )

    return {"success": True}

@app.get("/api/my-business-leads/{email}")
async def get_my_business_leads(
    email: str
):

    businesses = await db.businesses.find(
        {
            "email": email
        }
    ).to_list(1000)

    business_ids = [
        b["id"]
        for b in businesses
    ]

    leads = await db.leads.find(
        {
            "businessId": {
                "$in": business_ids
            }
        }
    ).to_list(1000)

    return serializeList(leads)



def create_access_token(user):

    payload = {
        "user_id": str(user["_id"]),
        "email": user["email"],
        "role": user.get("role", "user"),
        "exp": datetime.utcnow() + timedelta(minutes=15)
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def create_refresh_token(user):

    payload = {
        "user_id": str(user["_id"]),
        "exp": datetime.utcnow() + timedelta(days=7)
    }

    return jwt.encode(
        payload,
        REFRESH_SECRET_KEY,
        algorithm=ALGORITHM
    )

@app.post("/api/auth/refresh")
async def refresh_access_token(
    body: RefreshTokenRequest
):

    try:

        payload = jwt.decode(
            body.refresh_token,
            REFRESH_SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload["user_id"]

        user = await db.users.find_one(
            {
                "_id": ObjectId(user_id)
            }
        )

        if not user:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        if (
            user.get("refreshToken")
            != body.refresh_token
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid refresh token"
            )

        new_access_token = (
            create_access_token(user)
        )

        return {
            "access_token":
                new_access_token
        }

    except jwt.ExpiredSignatureError:

        raise HTTPException(
            status_code=401,
            detail="Refresh token expired"
        )

    except Exception:

        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token"
        )



@app.get("/api/me")
async def get_me(
    current_user=Depends(
        get_current_user
    )
):

    return {
        "id":
            str(current_user["_id"]),
        "email":
            current_user["email"],
        "role":
            current_user.get(
                "role",
                "user"
            )
    }



if __name__ == "__main__":
    
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
