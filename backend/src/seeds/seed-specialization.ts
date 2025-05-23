import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dbDocClient } from "../database/dynamodb.service";

export const specializations = [
  { id: "000001", specialization: "React" },
  { id: "000002", specialization: "Angular" },
  { id: "000003", specialization: "Express" },
  { id: "000004", specialization: "NodeJS" },
  { id: "000005", specialization: "Java" },
  { id: "000006", specialization: "C++" },

];

async function seedspecializations() {
  for (const specialization of specializations) {
    await dbDocClient.send(
      new PutCommand({
        TableName: "Specializations",
        Item: specialization,
      })
    );
    console.log(`Inserted training type: ${specialization.specialization}`);
  }
  console.log("Seeding complete.");
}

seedspecializations().catch(console.error);
