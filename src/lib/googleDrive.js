import { google } from "googleapis";
import fs from 'fs';

const apikeys = JSON.parse(fs.readFileSync('./api-key.json', 'utf8'));
const SCOPE = ['https://www.googleapis.com/auth/drive'];

export async function createFolder(authClient, folderName, parentFolderId = null) {
  const drive = google.drive({ version: "v3", auth: authClient });

  const fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: parentFolderId ? [parentFolderId] : [],
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    fields: 'id',
  });

  return response.data.id; // Mengembalikan ID folder yang baru dibuat
}

export async function authorize() {
  const jwtClient = new google.auth.JWT(
    apikeys.client_email,
    null,
    apikeys.private_key,
    SCOPE
  );

  await jwtClient.authorize();
  return jwtClient;
}

export async function uploadFile(authClient, filePath, fileName, mimeType, folderId) {
  const drive = google.drive({ version: "v3", auth: authClient });

  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    body: fs.createReadStream(filePath),
    mimeType: mimeType,
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });

  return response.data.id; // Mengembalikan ID file yang diupload
}