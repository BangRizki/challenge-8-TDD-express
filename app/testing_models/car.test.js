const app = require("../../app/");
const { Car, UserCar } = require("../../app/models");
const { Op } = require("sequelize");

beforeAll(async () => {
  await Car.create({
    name: "angkot",
    price: 10000,
    size: "small",
    image: "angkot.jpeg",
  });
});

afterAll(async () => {
  await Car.destroy({
    where: {
      [Op.or]: [{ name: "angkot" }, { name: "angkot super" },],
    },
  });
  await Car.update(
    {
      name: "angkot",
      price: 10000,
      image: "angkot.jpeg",
    },
    {
      where: {
        name: "angkot super",
      },
    }
  );
  await UserCar.destroy({
    where: {
      userId: 2,
    },
  });
});

describe("GET /v1/cars", () => {
  it("should return 200 for OK", async () => {
    return request(app)
      .get("/v1/cars")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.cars).toBeDefined();
      });
  });
});

describe("GET /v1/cars/:id", () => {
  it("should return 200 for OK", async () => {
    return request(app)
      .get("/v1/cars/1")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
      });
  });
});

describe("POST /v1/cars/:id/rent", () => {
  it("should return 201 for CREATED", async () => {
    return request(app)
      .post("/v1/cars/1/rent")
      .set("Content-Type", "application/json")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmFtZSI6IkJheXUiLCJlbWFpbCI6ImNvYmFAYmluYXIuY28uaWQiLCJpbWFnZSI6bnVsbCwicm9sZSI6eyJpZCI6MSwibmFtZSI6IkNVU1RPTUVSIn0sImlhdCI6MTY1NDU5NjczN30.En_xBvVjsvmkFfps9OBwNhWTr2BGJoPBKY4cYRJ7GRg"
      )
      .send({
        rentStartedAt: "2020-01-01",
        rentEndedAt: "2020-01-02",
      })
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toBeDefined();
      });
  });
  it("should return 401 Unauthorized when token invalid", async () => {
    return request(app)
      .post("/v1/cars/1/rent")
      .set("Content-Type", "application/json")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywibmFtZSI6IlNhdHJpbyIsImVtYWlsIjoic2F0cmlvQGdtYWlsLmNvbSIsImltYWdlIjpudWxsLCJyb2xlIjp7ImlkIjoyLCJuYW1lIjoiQURNSU4ifSwiaWF0IjoxNjU0NjEwNzM3fQ.oGqg08sKXK0WQv4_SXYOdf0QXn1izguqvXo3awzZVi8"
      )
      .send({
        rentStartedAt: "2020-01-01",
        rentEndedAt: "2020-01-02",
      })
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.error).toBeDefined();
      });
  });
});

describe("POST /v1/cars", () => {
  it("should return 201 for CREATED", async () => {
    return request(app)
      .post("/v1/cars")
      .set("Content-Type", "application/json")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywibmFtZSI6IlNhdHJpbyIsImVtYWlsIjoic2F0cmlvQGdtYWlsLmNvbSIsImltYWdlIjpudWxsLCJyb2xlIjp7ImlkIjoyLCJuYW1lIjoiQURNSU4ifSwiaWF0IjoxNjU0NjEwNzM3fQ.oGqg08sKXK0WQv4_SXYOdf0QXn1izguqvXo3awzZVi8"
      )
      .send({
        name: "angkot",
        price: 10000,
        size: "small",
        image: "angkot.jpeg",
      })
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toBeDefined();
      });
  });
  it("should return 422 Unprocessable Entity when there's an error in the body", async () => {
    return request(app)
      .post("/v1/cars")
      .set("Content-Type", "application/json")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywibmFtZSI6IlNhdHJpbyIsImVtYWlsIjoic2F0cmlvQGdtYWlsLmNvbSIsImltYWdlIjpudWxsLCJyb2xlIjp7ImlkIjoyLCJuYW1lIjoiQURNSU4ifSwiaWF0IjoxNjU0NjEwNzM3fQ.oGqg08sKXK0WQv4_SXYOdf0QXn1izguqvXo3awzZVi8"
      )
      .send({
        name: false,
        price: false,
        size: "small",
        image: "angkot.jpeg",
      })
      .then((res) => {
        expect(res.status).toBe(422);
        expect(res.body.error).toBeDefined();
      });
  });
  it("should return 401 Unauthorized when token invalid", async () => {
    return request(app)
      .post("/v1/cars")
      .set("Content-Type", "application/json")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmFtZSI6IkJheXUiLCJlbWFpbCI6ImNvYmFAYmluYXIuY28uaWQiLCJpbWFnZSI6bnVsbCwicm9sZSI6eyJpZCI6MSwibmFtZSI6IkNVU1RPTUVSIn0sImlhdCI6MTY1NDU5NjczN30.En_xBvVjsvmkFfps9OBwNhWTr2BGJoPBKY4cYRJ7GRg"
      )
      .send({
        name: "angkot",
        price: 10000,
        size: "small",
        image: "angkot.jpeg",
      })
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.error).toBeDefined();
      });
  });
});

describe("PUT /v1/cars/:id", () => {
  it("should return 200 for OK", async () => {
    return request(app)
      .put("/v1/cars/1")
      .set("Content-Type", "application/json")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywibmFtZSI6IlNhdHJpbyIsImVtYWlsIjoic2F0cmlvQGdtYWlsLmNvbSIsImltYWdlIjpudWxsLCJyb2xlIjp7ImlkIjoyLCJuYW1lIjoiQURNSU4ifSwiaWF0IjoxNjU0NjEwNzM3fQ.oGqg08sKXK0WQv4_SXYOdf0QXn1izguqvXo3awzZVi8"
      )
      .send({
        name: "angkot",
        price: 10000,
        size: "small",
        image: "angkot.jpeg",
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
      });
  });
  it("should return 422 Unprocessable Entity when there's an error in the body", async () => {
    return request(app)
      .put("/v1/cars/1")
      .set("Content-Type", "application/json")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywibmFtZSI6IlNhdHJpbyIsImVtYWlsIjoic2F0cmlvQGdtYWlsLmNvbSIsImltYWdlIjpudWxsLCJyb2xlIjp7ImlkIjoyLCJuYW1lIjoiQURNSU4ifSwiaWF0IjoxNjU0NjEwNzM3fQ.oGqg08sKXK0WQv4_SXYOdf0QXn1izguqvXo3awzZVi8"
      )
      .send({
        name: "angkot",
        price: 10000,
        size: "small",
        image: "angkot.jpeg",
      })
      .then((res) => {
        expect(res.status).toBe(422);
        expect(res.body.error).toBeDefined();
      });
  });
  it("should return 401 Unauthorized when token invalid", async () => {
    return request(app)
      .put("/v1/cars/1")
      .set("Content-Type", "application/json")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmFtZSI6IkJheXUiLCJlbWFpbCI6ImNvYmFAYmluYXIuY28uaWQiLCJpbWFnZSI6bnVsbCwicm9sZSI6eyJpZCI6MSwibmFtZSI6IkNVU1RPTUVSIn0sImlhdCI6MTY1NDU5NjczN30.En_xBvVjsvmkFfps9OBwNhWTr2BGJoPBKY4cYRJ7GRg"
      )
      .send({
        name: "angkot",
        price: 10000,
        size: "small",
        image: "angkot.jpeg",
      })
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.error).toBeDefined();
      });
  });
});

describe("DELETE /v1/cars/:id", () => {
  it("should return 204 for No Content", async () => {
    return request(app)
      .delete("/v1/cars/191")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywibmFtZSI6IlNhdHJpbyIsImVtYWlsIjoic2F0cmlvQGdtYWlsLmNvbSIsImltYWdlIjpudWxsLCJyb2xlIjp7ImlkIjoyLCJuYW1lIjoiQURNSU4ifSwiaWF0IjoxNjU0NjEwNzM3fQ.oGqg08sKXK0WQv4_SXYOdf0QXn1izguqvXo3awzZVi8"
      )
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });
  it("should return 401 Unauthorized when token invalid", async () => {
    return request(app)
      .delete("/v1/cars/191")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmFtZSI6IkJheXUiLCJlbWFpbCI6ImNvYmFAYmluYXIuY28uaWQiLCJpbWFnZSI6bnVsbCwicm9sZSI6eyJpZCI6MSwibmFtZSI6IkNVU1RPTUVSIn0sImlhdCI6MTY1NDU5NjczN30.En_xBvVjsvmkFfps9OBwNhWTr2BGJoPBKY4cYRJ7GRg"
      )
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.error).toBeDefined();
      });
  });
});
