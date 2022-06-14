const app = require("../../app");
const { User } = require("../../app/models");

afterAll(async () => {
    await User.destroy({
        where: {
            email: "bibi@gmail.com",
        },
    });
});

describe("/POST /v1/auth/login", () => {
    it("should return 200 for OK", async () => {
        return request(app)
            .post("/v1/auth/login")
            .send({
                email: "bibi@gmail.com",
                password: "123456",
            })
            .then((res) => {
                expect(res.status).toBe(201);
                expect(res.body.accessToken).toBeDefined();
            });
    });
    it("should return 404 Not Found when user is not found", async () => {
        return request(app)
            .post("/v1/auth/login")
            .send({
                email: "bibi@gmail.com",
                password: "123456",
            })
            .then((res) => {
                expect(res.status).toBe(404);
                expect(res.body.error).toBeDefined();
            });
    });
    it("should return 401 Wrong Password when password is wrong", async () => {
        return request(app)
            .post("/v1/auth/login")
            .send({
                email: "bibi@gmail.com",
                password: "123456789",
            })
            .then((res) => {
                expect(res.status).toBe(401);
                expect(res.body).toBeDefined();
            });
    });
});

describe("/POST /v1/auth/register", () => {
    it("should return 422 when email is already registered", async () => {
        return request(app)
            .post("/v1/auth/register")
            .send({
                name: "Bibi",
                email: "bibi@gmail.com",
                password: "123456",
            })
            .then((res) => {
                expect(res.status).toBe(422);
                expect(res.body.error).toBeDefined();
            });
    });
    it("should return 201 when user is successfully registered", async () => {
        return request(app)
            .post("/v1/auth/register")
            .set("Content-Type", "application/json")
            .send({
                name: "Bibi",
                email: "bibi@gmail.com",
                password: "123456",
            })
            .then((res) => {
                expect(res.status).toBe(201);
                expect(res.body.accessToken).toBeDefined();
            });
    });
});

describe("GET /v1/auth/whoami", () => {
    it("should return 200 OK", async () => {
        return request(app)
            .get("/v1/auth/whoami")
            .set(
                "Authorization",
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmFtZSI6IkJheXUiLCJlbWFpbCI6ImNvYmFAYmluYXIuY28uaWQiLCJpbWFnZSI6bnVsbCwicm9sZSI6eyJpZCI6MSwibmFtZSI6IkNVU1RPTUVSIn0sImlhdCI6MTY1NDU5NjczN30.En_xBvVjsvmkFfps9OBwNhWTr2BGJoPBKY4cYRJ7GRg"
            )
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
            });
    });
    it("should return 401 Unauthorized when token is invalid", async () => {
        return request(app)
            .get("/v1/auth/whoami")
            .set(
                "Authorization",
                "Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmFtZSI6IkJheXUiLCJlbWFpbCI6ImNvYmFAYmluYXIuY28uaWQiLCJpbWFnZSI6bnVsbCwicm9sZSI6eyJpZCI6MSwibmFtZSI6IkNVU1RPTUVSIn0sImlhdCI6MTY1NDU5NjczN30.En_xBvVjsvmkFfps9OBwNhWTr2BGJoPBKY4cYRJ7GRg"
            )
            .then((res) => {
                expect(res.status).toBe(401);
                expect(res.body).toBeDefined();
            });
    });
});
