from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    item: str
@app.post("/process")
async def process(item: Item):
    return {"message": f"Item processed: {item.item}"}


# if __name__ == '__main__':
#     app.run(debug=True)