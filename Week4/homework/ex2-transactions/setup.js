import { connectToDatabase } from "./connectDatabase.js";

export async function setupAccounts() {
  const { db } = await connectToDatabase("databaseWeek4"); // destructure db from the connection object
  const accounts = db.collection("accounts");

  // Clean up existing data
  await accounts.deleteMany({});

  // Add sample data
  const sampleAccounts = [
    {
      account_number: 101,
      balance: 5000,
      account_changes: [
        {
          change_number: 1,
          amount: 5000,
          changed_date: new Date(),
          remark: "Initial deposit",
        },
      ],
    },
    {
      account_number: 102,
      balance: 3000,
      account_changes: [
        {
          change_number: 1,
          amount: 3000,
          changed_date: new Date(),
          remark: "Initial deposit",
        },
      ],
    },
  ];

  await accounts.insertMany(sampleAccounts);
  console.log("✅ Accounts setup complete!");
}

// To run directly (optional)
if (process.argv[1].endsWith("setup.js")) {
  setupAccounts().then(() => process.exit(0));
}

// To excute this file in the terminal: node setup.js
