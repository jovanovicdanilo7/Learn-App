import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dbDocClient } from "../database/dynamodb.service";

const trainingTypes = [
  { id: "type-001", trainingType: "Webinar" },
  { id: "type-002", trainingType: "Workshop" },
  { id: "type-003", trainingType: "Bootcamp" },
  { id: "type-004", trainingType: "Lecture" },
  { id: "type-005", trainingType: "Mentorship" },
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
