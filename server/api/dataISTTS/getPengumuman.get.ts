export default defineEventHandler(async (event) => {
    const data = await fetch(
        "https://ws.stts.edu/pengumuman/0/pengumumanSIM/1/&appname=digitalsignage",
        {
          method: "POST",
          
          headers: {
            token: process.env.WS_TOKEN!,
          },
        }
      );
      
      return data;
})