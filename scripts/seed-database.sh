#!/bin/bash

# Seed Database Script
# Quick script to seed the database with test data

echo "🌱 Seeding database with test data..."
echo ""

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "❌ Error: Server is not running on http://localhost:3000"
    echo "   Please start the dev server first: npm run dev"
    exit 1
fi

# Seed the database
echo "📊 Sending seed request..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/scholarships/seed)

# Check if successful
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "✅ Database seeded successfully!"
    echo ""
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
else
    echo "❌ Error seeding database:"
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
    exit 1
fi

echo ""
echo "🎉 Done! You can now test the application with seeded data."
echo ""
echo "Next steps:"
echo "  1. Check the dashboard: http://localhost:3000/dashboard"
echo "  2. Complete your profile"
echo "  3. View matched opportunities"
echo "  4. Test filters and search"

