const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
let server;

describe("/api/genres", () => {
    // jest will call this function before each test.
    beforeEach(() => {
        server = require("../../index");
    });
    // close the server after each test case
    afterEach(async () => {
        await server.close();
        // clean up the database after each test so that the previous test docs don't show up
        // await Genre.remove({});
        await Genre.deleteOne();
    });
    describe("GET /", () => {
        it("should return all genres", async () => {
            await Genre.collection.insertMany([
                { name: "genre1" },
                { name: "genre2" },
            ]);
            const res = await request(server).get("/api/genres");
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2); //too specific
            expect(res.body.some((g) => g.name === "genre1")).toBeTruthy(); // any of the genres has a name genre1
        });
    });

    describe("GET /:id", () => {
        it("should return 404 if invalid id is passed", async () => {
            const res = await request(server).get(`/api/genres/1`);
            expect(res.status).toBe(404);
        });

        it("should return genre if valid id is passed", async () => {
            const genre = new Genre({ name: "genre1" });
            await genre.save();
            const res = await request(server).get(`/api/genres/${genre._id}`);
            expect(res.status).toBe(200);
            // you can't match object here because id won't be in the string format
            expect(res.body).toHaveProperty("name", genre.name);
        });
    });

    describe("POST /", () => {
        //Define the happy path and in each test we change one parameter that clearly aligns with the name of the test.

        it("should return a 401 if client is not logged in", async () => {
            const res = await request(server)
                .post("/api/genres")
                .send({ name: "genre1" });

            expect(res.status).toBe(401);
        });
        it("should return 400 if genre is less than 3 characters", async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post("/api/genres")
                .set("x-auth-token", token)
                .send({ name: "12" });

            expect(res.status).toBe(400);
        });
        it("should return 400 if genre is more than 50 characters", async () => {
            const token = new User().generateAuthToken();
            // create a string of 51 characters
            const name = new Array(52).join("a");
            const res = await request(server)
                .post("/api/genres")
                .set("x-auth-token", token)
                .send({ name: name });

            expect(res.status).toBe(400);
        });
        it("should save the genre if it is valid", async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post("/api/genres")
                .set("x-auth-token", token)
                .send({ name: "genre1" });

            const genre = await Genre.find({ name: "genre1" });
            expect(genre).not.toBeNull();
        });
        it("should return the genre if it is valid", async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post("/api/genres")
                .set("x-auth-token", token)
                .send({ name: "genre1" });
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name", "genre1");
        });
    });
});
