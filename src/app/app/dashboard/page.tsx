"use client";
import { ChartAreaFinance } from "@/components/chart-area-interactive";
import { ChartPieDonut } from "@/components/chart-pie-donut";
import { DataTableDemo } from "@/components/data-table";
import Summary from "./components/summary";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dashboard = () => {
  const [mode, setMode] = useState<"month" | "all">("month");

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Finance Dashboard</h1>{" "}
        <Select
          value={mode}
          onValueChange={(val) => setMode(val as "month" | "all")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecionar período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Mês atual</SelectItem>
            <SelectItem value="total">Período total</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Summary summaryType={mode} />
      <section className="flex flex-col lg:flex-row gap-4">
        <ChartPieDonut mode={mode} />
        <ChartAreaFinance />
      </section>
      <section>
        <DataTableDemo />
      </section>
    </div>
  );
};

export default Dashboard;
