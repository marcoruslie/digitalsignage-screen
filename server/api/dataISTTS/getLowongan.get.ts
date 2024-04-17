export default defineEventHandler(async (event) => {
    const data = await fetch(
        "https://ws.stts.edu/lowongan/0/listlowongan//&appname=digitalsignage",
        {
          method: "POST",
          headers: {
            token: process.env.WS_TOKEN!,
          },
        }
      );
      return data.json();
})