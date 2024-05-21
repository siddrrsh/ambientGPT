const { webFrame } = require("electron");
const gpuInfo = webFrame?.getGPUMetrics();

export default gpuInfo;
