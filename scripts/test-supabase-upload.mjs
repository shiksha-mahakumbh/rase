#!/usr/bin/env node
/** Usage: node scripts/test-supabase-upload.mjs */
console.log("Upload test requires SUPABASE_SERVICE_ROLE_KEY and live storage buckets.");
console.log("POST /api/v2/registration/upload with multipart form: file, bucket, field");
