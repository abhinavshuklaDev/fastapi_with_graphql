import strawberry
from typing import List
from models import UserModel
from database import SessionLocal
from sqlalchemy.orm import Session


@strawberry.type
class User:
    id:int
    name:str
    email:str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@strawberry.type
class Query:
    
    @strawberry.field
    def get_users(self) -> List[User]:
        db: Session = SessionLocal()
        users = db.query(UserModel).all()
        db.close()
        return users

    @strawberry.field
    def get_user(self, id: int) -> User | None:
        db: Session = SessionLocal()
        user = db.query(UserModel).filter(UserModel.id == id).first()
        db.close()
        return user
    
@strawberry.type
class Mutation:

    @strawberry.mutation
    def create_user(self, name: str, email: str) -> User:
        db: Session = SessionLocal()
        new_user = UserModel(name=name, email=email)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        db.close()
        return new_user

    @strawberry.mutation
    def update_user(self, id: int, name: str, email: str) -> User | None:
        db: Session = SessionLocal()
        user = db.query(UserModel).filter(UserModel.id == id).first()
        if not user:
            return None
        user.name = name
        user.email = email
        db.commit()
        db.refresh(user)
        db.close()
        return user

    @strawberry.mutation
    def delete_user(self, id: int) -> bool:
        db: Session = SessionLocal()
        user = db.query(UserModel).filter(UserModel.id == id).first()
        if not user:
            return False
        db.delete(user)
        db.commit()
        db.close()
        return True
    
schema = strawberry.Schema(query=Query,mutation=Mutation)    

    