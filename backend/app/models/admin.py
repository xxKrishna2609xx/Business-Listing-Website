from pydantic import BaseModel

class RejectApplicationRequest(BaseModel):
    reason: str