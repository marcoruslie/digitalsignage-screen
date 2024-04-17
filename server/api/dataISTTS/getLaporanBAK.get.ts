export default defineEventHandler(async (event) => {
  const data = await fetch(
    "https://ws.stts.edu/mhskegiatan/0/laporanbak//&appname=digitalsignage",
    {
      method: "POST",
      headers: {
        token: process.env.WS_TOKEN!,
      },
    }
  );
  return data.json();
});
