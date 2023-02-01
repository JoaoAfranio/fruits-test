import fruits from "data/fruits";
import app from "index";
import supertest from "supertest";
import httpStatus from "http-status";

const api = supertest(app);

describe("GET /fruits", () => {
  it("should repond with status 200 and list of fruits", async () => {
    const fruitBanana = {
      id: 1,
      name: "Banana",
      price: 10,
    };

    const fruitApple = {
      id: 2,
      name: "Apple",
      price: 5,
    };

    fruits.push(fruitBanana, fruitApple);

    const response = await api.get("/fruits");
    expect(response.status).toEqual(httpStatus.OK);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          price: expect.any(Number),
        }),
      ])
    );

    fruits.pop();
    fruits.pop();
  });
});

describe("POST /fruits", () => {
  it("should respond with status 422 if body is invalid", async () => {
    const response = await api.post("/fruits");
    expect(response.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should respond with status 409 if fruit already exists", async () => {
    const fruit = {
      id: 1,
      name: "Banana",
      price: 10,
    };

    const bodyFruit = {
      name: "Banana",
      price: 10,
    };

    fruits.push(fruit);

    const response = await api.post("/fruits").send(bodyFruit);
    expect(response.status).toEqual(httpStatus.CONFLICT);

    fruits.pop();
  });

  it("should respond with status 201 and insert a new fruit in database", async () => {
    const bodyFruit = {
      name: "Banana",
      price: 10,
    };

    const response = await api.post("/fruits").send(bodyFruit);
    expect(response.status).toEqual(httpStatus.CREATED);
  });
});

describe("GET /fruits:id", () => {
  it("should respond with status 404 if there's no fruit with the id", async () => {
    const response = await api.get("/fruits/0");
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
  it("should respond with status 200 if an id is found", async () => {
    const fruit = {
      id: 1,
      name: "Banana",
      price: 10,
    };
    fruits.push(fruit);
    const response = await api.get("/fruits/1");
    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual({
      id: 1,
      name: "Banana",
      price: 10,
    });
    fruits.pop();
  });
});
