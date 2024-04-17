export default () => {
    const getPengumuman = async () => {
      try {
        const data = await $fetch("/api/dataISTTS/getPengumuman");
        return data;
      } catch (error) {
        return error;
      }
    };
    const getLowongan = async () => {
      const data = await $fetch("/api/dataISTTS/getLowongan");
      return data;
    };
    const getLaporanBAK = async () => {
      const data = await $fetch("/api/dataISTTS/getLaporanBAK");
      return data;
    };
    return {
      getLaporanBAK,
      getLowongan,
      getPengumuman,
    };
  };
  