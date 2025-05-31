import { dbDocClient } from "../database/dynamodb.service";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

export const specializations = [
  { id: "8b7a4ed0-1e90-467b-8bb3-fbfe384d2f64", specialization: "React" },
  { id: "2d5f41ab-44cc-45a9-87c6-7a7a39107c90", specialization: "Angular" },
  { id: "1098dc2e-b07a-4ce0-8216-5915fd12d9f0", specialization: "Express" },
  { id: "4f6efb78-237b-4b93-8a1e-92b6459cbf02", specialization: "NodeJS" },
  { id: "3aa2923f-efde-4c70-8401-3fdfb85b3e38", specialization: "Java" },
  { id: "94bc6642-2ae6-45cf-bce6-bd55e6e97b3b", specialization: "C++" },
  { id: "ef0f314f-d20d-4f2a-a008-3aa6a370be76", specialization: "C" },
  { id: "435f2a77-257f-419a-b5d5-7eb27993c2ae", specialization: "Vue" },
  { id: "7888e607-92c4-4195-8df5-15b063b68591", specialization: "Python" },
  { id: "f03d4f1e-b5b7-4295-a22d-14ae3c1f7989", specialization: "HTML & CSS" },
  { id: "34b6a6f7-3d6f-432b-835f-7f3e25cf2ec2", specialization: "Nest" },
];

const seedSpecializations = async () => {
  const scanResult = await dbDocClient.send(
    new ScanCommand({ TableName: "Specializations" })
  );

  const existingIds = new Set(
    (scanResult.Items ?? []).map(item => item.id)
  );

  for (const specialization of specializations) {
    if (existingIds.has(specialization.id)) {
      console.log(`Skipping existing specialization: ${specialization.specialization}`);
      continue;
    }

    await dbDocClient.send(
      new PutCommand({
        TableName: "Specializations",
        Item: specialization,
      })
    );

    console.log(`Inserted specialization: ${specialization.specialization}`);
  }
  console.log("Seeding complete.");
}

seedSpecializations().catch(console.error);
