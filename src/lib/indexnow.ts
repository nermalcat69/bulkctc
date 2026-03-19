const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const SITE_URL = process.env.SITE_URL ?? "https://bulkctc.com";
const HOST = new URL(SITE_URL).host;
const BATCH_SIZE = 50;

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export async function submitToIndexNow(urls: string[]): Promise<void> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) throw new Error("INDEXNOW_KEY environment variable is not set");

  const batches = chunkArray(urls, BATCH_SIZE);

  for (const batch of batches) {
    try {
      const res = await fetch(INDEXNOW_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: HOST,
          key,
          keyLocation: `${SITE_URL}/${key}.txt`,
          urlList: batch,
        }),
      });

      if (!res.ok) {
        console.error(
          `[IndexNow] Non-200 response: ${res.status} for batch of ${batch.length} URLs`
        );
      }
    } catch (err) {
      console.error("[IndexNow] Request failed:", err);
    }
  }
}
