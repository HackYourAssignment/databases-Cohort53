// Week4/homework/ex2-transactions/transfer.js
import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

const DB = "databaseWeek4";
const COLL = "accounts";

export async function transfer({ from, to, amount, remark }) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }
  if (from === to) {
    throw new Error("From and To accounts must be different");
  }

  const client = new MongoClient(process.env.MONGODB_URL, {
    serverApi: ServerApiVersion.v1,
  });
  await client.connect();

  const session = client.startSession();
  try {
    const col = client.db(DB).collection(COLL);

    const [a, b] = from < to ? [from, to] : [to, from];

    const result = await session.withTransaction(
      async () => {
        const [accA, accB] = await Promise.all([
          col.findOne({ account_number: a }, { session }),
          col.findOne({ account_number: b }, { session }),
        ]);
        if (!accA || !accB) throw new Error("Account not found");

        const accFrom = accA.account_number === from ? accA : accB;
        const accTo = accA.account_number === to ? accA : accB;

        if (accFrom.balance < amount) {
          throw new Error("Insufficient funds");
        }

        const nextChangeFrom =
          (accFrom.account_changes?.[accFrom.account_changes.length - 1]
            ?.change_number ?? 0) + 1;
        const nextChangeTo =
          (accTo.account_changes?.[accTo.account_changes.length - 1]
            ?.change_number ?? 0) + 1;

        const now = new Date();

        const updFrom = await col.updateOne(
          { _id: accFrom._id },
          {
            $inc: { balance: -amount },
            $push: {
              account_changes: {
                change_number: nextChangeFrom,
                amount: -amount,
                changed_date: now,
                remark,
              },
            },
          },
          { session }
        );
        if (updFrom.modifiedCount !== 1) {
          throw new Error("Debit update failed");
        }

        const updTo = await col.updateOne(
          { _id: accTo._id },
          {
            $inc: { balance: amount },
            $push: {
              account_changes: {
                change_number: nextChangeTo,
                amount,
                changed_date: now,
                remark,
              },
            },
          },
          { session }
        );
        if (updTo.modifiedCount !== 1) {
          throw new Error("Credit update failed");
        }
      },
      {
        readConcern: { level: "snapshot" },
        writeConcern: { w: "majority" },
        readPreference: "primary",
      }
    );

    if (result) {
      console.log(
        `transfer: success (from ${from} to ${to}, amount ${amount})`
      );
    } else {
      throw new Error("Transaction aborted by driver");
    }
  } finally {
    await session.endSession();
    await client.close();
  }
}
