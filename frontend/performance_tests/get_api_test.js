import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10,        // 10 virtual users (concurrent users)
  duration: "10s" // run test for 10 seconds
};

export default function () {
  const res = http.get("http://localhost:8080/api/events/statuses");

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1); // simulate user wait time
}