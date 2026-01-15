import { useMutation } from "@tanstack/react-query";
import { simulateEmail } from "@/lib/api";

export const useSimulate = () =>
  useMutation({
    mutationFn: simulateEmail,
  });
