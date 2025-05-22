import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dbDocClient } from "../database/dynamodb.service";

const trainingTypes = [
  { id: "000001", trainingType: "Webinar" },
  { id: "000002", trainingType: "Workshop" },
  { id: "000003", trainingType: "Bootcamp" },
  { id: "000004", trainingType: "Lecture" },
  { id: "000005", trainingType: "Mentorship" },
];

async function seedTrainingTypes() {
  for (const type of trainingTypes) {
    await dbDocClient.send(
      new PutCommand({
        TableName: "TrainingTypes",
        Item: type,
      })
    );
    console.log(`Inserted training type: ${type.trainingType}`);
  }
  console.log("Seeding complete.");
}

seedTrainingTypes().catch(console.error);
