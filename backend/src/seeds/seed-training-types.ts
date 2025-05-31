import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dbDocClient } from "../database/dynamodb.service";

const trainingTypes = [
  { id: "a1b5ec3f-d9de-4a13-9b63-50c2bdb4f5a3", trainingType: "Webinar" },
  { id: "b3891a7d-83cb-4fcf-8ec4-e36d2d4b6484", trainingType: "Workshop" },
  { id: "c7aaf7b0-3cf5-4961-a76c-91f58c2603a0", trainingType: "Bootcamp" },
  { id: "1dbf9d95-9e77-4b9d-81e4-c7c03e97a8f4", trainingType: "Lecture" },
  { id: "6e478719-875f-407a-9c5b-f8d7df7ea3b5", trainingType: "Mentorship" },
  { id: "6fdf6ffc-ed77-4c5b-913b-4ac9c0f3a3d1", trainingType: "Seminar" },
  { id: "9b0c3c1b-bde6-45a7-a207-7b3ebc60f1aa", trainingType: "Hackathon" },
  { id: "c3e0bc3c-f021-46c5-8859-7aef7b9e7f68", trainingType: "Hands-on Lab" },
  { id: "e78c5d47-2a7c-4f16-8ed6-3b59bbbf8a17", trainingType: "Online Course" },
  { id: "0d073541-5fc3-4be6-81c9-37a7b21e8be5", trainingType: "Group Discussion" },
  { id: "3483dc57-dfb0-4709-aed7-9056fdc1c6e6", trainingType: "Peer Learning" },
  { id: "7e3adcc7-027b-4652-9db8-e6886cf356fd", trainingType: "Self-paced Study" },
];

const seedTrainingTypes = async () => {
  const scanResult = await dbDocClient.send(
    new ScanCommand({ TableName: "TrainingTypes" })
  );

  const existingIds = new Set(
    (scanResult.Items ?? []).map(item => item.id)
  );

  for (const type of trainingTypes) {
    if (existingIds.has(type.id)) {
      console.log(`Skipping existing training type: ${type.trainingType}`);
      continue;
    }

    await dbDocClient.send(
      new PutCommand({
        TableName: "TrainingTypes",
        Item: type,
      })
    );

    console.log(`Inserted training type: ${type.trainingType}`);
  }

  console.log("Seeding complete.");
};

seedTrainingTypes().catch(console.error);
