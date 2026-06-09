#!/usr/bin/env node
const BASE = (process.argv[2] || "https://www.rase.co.in").replace(/\/$/, "");
const API_KEY = "AIzaSyDL6UJwLh8KaNHARuedHNTjWIcFixkfv5s";
const PROJECT = "shiksha-mahakumbh-abhiyan";

async function firestoreRest(path) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/${path}`;
  const res = await fetch(url, { headers: { "x-goog-api-key": API_KEY } });
  return { status: res.status, body: await res.json() };
}

async function main() {
  const reg = await firestoreRest("registrations?pageSize=3");
  const counter = await firestoreRest("registrationCounters/smk2026");
  console.log("firestore_registrations", JSON.stringify(reg));
  console.log("firestore_counter", JSON.stringify(counter));
}

main();
