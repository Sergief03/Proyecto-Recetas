#!/bin/bash
# cURL command to test the login endpoint
curl -X POST http://localhost:5000/api/login \
-H "Content-Type: application/json" \
-d '{"email": "hola@hola", "password": "hola"}'
