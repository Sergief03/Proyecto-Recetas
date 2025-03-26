#!/bin/bash
# cURL command to test the registration endpoint
curl -X POST http://localhost:5000/api/register \
-H "Content-Type: application/json" \
-d '{"username": "newuser", "email": "newuser@example.com", "password": "newpassword"}'
