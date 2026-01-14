import { useQuery } from "@tanstack/react-query";
import { fetchRules } from "@/lib/api";

export const useRules = () =>
  useQuery({
    queryKey: ["rules"],
    queryFn: fetchRules,
  });
