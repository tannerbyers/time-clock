const express = require("express");
const path = require("path");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const cors = require("cors");
const db = require("./services/db.js");

const isDev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`
    );
  });
} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, "../react-ui/build")));

  // for local development. should remove when pushed to production
  app.use(cors());
  app.use(express.json());

  // Answer API requests.
  // Normally we would want these in their own routes files/folder structure
  app.get("/api/current_status", async (req, res) => {
    const employeeId = req.query.id;

    const currentTimeSlotTimeType = await db.query(
      `SELECT CurrentTimeSlotStatus
      FROM Users
      where Users.Id = ${employeeId}`
    );

    console.log(currentTimeSlotTimeType);
    if (currentTimeSlotTimeType.length > 0) {
      res.send(
        `{"timetype":"${currentTimeSlotTimeType[0].CurrentTimeSlotStatus}"}`
      );
    } else {
      res.send('{"timetype":"Check In!"}');
    }
  });

  app.post("/api/status", async (req, res) => {
    const employeeId = req.query.id;
    const status = req.query.status;

    // first update timeSlots for user in DB
    await db.query(
      `insert into TimeSlots (userid,time,timeType)  
      values ('${employeeId}', '${new Date().toLocaleString(
        "en-US"
      )}','${status}' )`
    );

    // second update currentStatus in DB
    await db.query(
      `UPDATE users
      SET CurrentTimeSlotStatus = '${status}'
      WHERE id = ${employeeId};
      `
    );

    res.send(`{"message":"updated!"}`);
  });

  app.post("/register", async (req, res) => {
    const { employeeId, firstName, lastName } = req.body;
    // first make sure we dont have a user that matches the current employeeId
    const users = await db.query(
      `SELECT * FROM Users where id = ${employeeId}`
    );

    console.log(users);

    if (users.length > 0) {
      return res.send({
        errorMessage:
          "Employee Id has already been registered. Please contact your admin",
      });
    }

    await db.query(
      `insert into Users (Id, LastName, FirstName, OrgId, UserType) values (${employeeId}, '${lastName}', '${firstName}', 1,'base')`
    );

    return res.send({
      token: employeeId,
    });
  });

  app.post("/login", async (req, res) => {
    // TODO: this is not a secure way to implement this
    // Would recommend creating a JWT that expires and using the JWT to verify access
    // while viewing pages and making any api calls. Not implementing due to time
    const { employeeId } = req.body;

    const users = await db.query(
      `SELECT * FROM Users where id = ${employeeId}`
    );
    if (users.length > 0) {
      res.send({
        // This is terrible. Do not do in production. should be JWT token
        token: employeeId,
      });
    } else {
      res.send({
        errorMessage: "User employee Id is not registered. Please register.",
      });
    }
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get("*", function (request, response) {
    response.sendFile(
      path.resolve(__dirname, "../react-ui/build", "index.html")
    );
  });

  app.listen(PORT, function () {
    console.error(
      `Node ${
        isDev ? "dev server" : "cluster worker " + process.pid
      }: listening on port ${PORT}`
    );
  });
}
