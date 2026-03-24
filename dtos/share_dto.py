from dataclasses import field
from typing import Optional
from marshmallow_dataclass import dataclass

@dataclass
class ShareDTO():
    uuid: Optional[str]
    lat: Optional[float]
    
    lng: Optional[float]
    
    expiry: int = field(
        metadata={
            'required': True
        }
    )
    
    carid: int = field(
        metadata={
            'required': True
        }
    )