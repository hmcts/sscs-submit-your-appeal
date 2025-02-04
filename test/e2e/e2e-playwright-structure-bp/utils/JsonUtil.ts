import * as fs from 'fs';

export async function getJsonFromFile(filePath: string) {
  const jsonData = await fs.promises.readFile(filePath, 'utf8');
  const data = JSON.parse(jsonData);
  return data;
}
