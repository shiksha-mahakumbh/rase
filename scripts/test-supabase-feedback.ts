const base = process.argv[2] ?? "http://localhost:3000";

async function main() {
  const res = await fetch(`${base}/api/v2/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rating: 5,
      category: "general",
      message: "Phase 3 feedback test",
      email: "test@example.com",
    }),
  });
  console.log(res.status, await res.text());
}

main();
