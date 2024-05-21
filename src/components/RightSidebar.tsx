import { useState, useEffect } from "react";
import { LineChart } from "@tremor/react";

const dataFormatter = (number: number) =>
  `$${Intl.NumberFormat("us").format(number).toString()}`;

export default function RightSidebar() {
  const [value, setValue] = useState<any>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      //@ts-ignore
      window.electronAPI.send("getCpuUsage", "Message from renderer process");
    }, 5000);

    //@ts-ignore
    window.electronAPI.on("receiveCpuUsage", (event, arg) => {
      setValue((prevValue: any) => [...prevValue, JSON.parse(arg)]);
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-[350px] p-2 w-[350px] h-full flex flex-col border-l">
      <h2 className="text-sm font-medium">System Usage</h2>
      <div className="mt-4 flex flex-col space-y-3">
        <p className="text-xs font-medium text-[#363636]">Memory Usage</p>
        <LineChart
          className="h-32"
          showLegend={false}
          showXAxis={true}
          showYAxis={true}
          data={value}
          index="date"
          categories={["total_mem", "used_mem"]}
          colors={["indigo", "rose"]}
          valueFormatter={dataFormatter}
          yAxisWidth={40}
          onValueChange={(v) => console.log(v)}
        />
      </div>
      <div className="mt-4 flex flex-col space-y-3">
        <p className="text-xs font-medium text-[#363636]">CPU Usage</p>
        <LineChart
          className="h-32"
          showLegend={false}
          showXAxis={true}
          showYAxis={false}
          data={value}
          index="date"
          categories={["cpu_usage"]}
          colors={["indigo"]}
          valueFormatter={dataFormatter}
          yAxisWidth={60}
          onValueChange={(v) => console.log(v)}
        />
      </div>
    </div>
  );
}
