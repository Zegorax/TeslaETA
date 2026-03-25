from dataclasses import field
from apiflask import Schema
from apiflask.fields import String
from apiflask.validators import Length
from marshmallow_dataclass import dataclass

@dataclass
class UserDTO():
    username: str = field(
        metadata={
            'required': True,
            'validate': Length(min=5, max=50)
        }
    )
    password: str = field(
        metadata={
            'required': True
        }
    )