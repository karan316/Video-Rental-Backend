const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
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
            const res = await request(server).get("/api/genres/1");
            expect(res.status).toBe(404);
        });

        it("should return 404 if no genre with given id exists", async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get(`/api/genres/${id}`);
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
        let token;
        let name;

        // refactoring to reduce the lines of code..duh
        const exec = () => {
            // awaiting is not necessary because we are immediately returning
            return request(server)
                .post("/api/genres")
                .set("x-auth-token", token)
                .send({ name });
        };

        beforeEach(() => {
            //set the values for the happy path
            // assign the token before every test
            token = new User().generateAuthToken();
            name = "genre1";
        });

        it("should return a 401 if client is not logged in", async () => {
            // set token to null because user should not be logged in
            token = "";
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it("should return 400 if genre is less than 3 characters", async () => {
            name = "12";
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it("should return 400 if genre is more than 50 characters", async () => {
            // create a string of 51 characters
            name = new Array(52).join("a");
            const res = await exec();
            expect(res.status).toBe(400);
        });
        // HAPPY PATH. use this while refactoring
        it("should save the genre if it is valid", async () => {
            await exec();
            const genre = await Genre.find({ name: "genre1" });
            expect(genre).not.toBeNull();
        });

        it("should return the genre if it is valid", async () => {
            const res = await exec();
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name", "genre1");
        });
    });

    describe("PUT /:id", () => {
        let token;
        let genre;
        let newName;
        let id;

        beforeEach(async () => {
            // before each test we need to create a genre and put it into the database
            token = new User().generateAuthToken();
            genre = new Genre({ name: "genre1" });
            await genre.save();
            id = genre._id;
            newName = "updatedName";
        });

        const exec = () => {
            return request(server)
                .put(`/api/genres/${id}`)
                .set("x-auth-token", token)
                .send({ name: newName });
        };

        it("should return 401 if client is not logged in", async () => {
            token = "";
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it("should return 400 if genre is less than 3 characters", async () => {
            newName = "12";

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should return 400 if genre is more than 50 characters", async () => {
            newName = new Array(52).join("a");

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should return 404 if invalid id is passed", async () => {
            id = 1;
            const res = await exec();
            expect(res.status).toBe(404);
        });

        if (
            ("should return 404 if the id is not present",
            async () => {
                id = mongoose.Types.ObjectId();
                const res = await exec();
                expect(res.status).toBe(404);
            })
        )
            // to check if the genre is updated
            it("should update the genre if id is valid", async () => {
                await exec();
                const updatedGenre = await Genre.findById(genre._id);
                expect(updatedGenre.name).toBe(newName);
            });

        it("should return the updated genre in the response if id is valid", async () => {
            const res = await exec();
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name", newName);
        });
    });

    describe("DELETE /:id", () => {
        let id;
        let token;
        let genre;

        beforeEach(async () => {
            token = new User({ isAdmin: true }).generateAuthToken();
            genre = new Genre({ name: "genre1" });
            await genre.save();
            id = genre._id;
        });
        const exec = async () => {
            return await request(server)
                .delete(`/api/genres/${id}`)
                .set("x-auth-token", token)
                .send();
        };
        it("should return 401 if client is not logged in", async () => {
            token = "";
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it("should return 403 if client is not an admin", async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

            const res = await exec();
            expect(res.status).toBe(403);
        });

        it("should return 404 if id is not valid", async () => {
            id = 1;
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it("should return 404 if a valid id is not found", async () => {
            id = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it("should delete the genre if valid id is passed", async () => {
            await exec();
            const deletedGenre = await Genre.findById(id);
            expect(deletedGenre).toBeNull();
        });
        it("should return the deleted genre if valid id is passed", async () => {
            const res = await exec();
            expect(res.body).toHaveProperty("_id", genre._id.toHexString());
            expect(res.body).toHaveProperty("name", genre.name);
        });
    });
});
