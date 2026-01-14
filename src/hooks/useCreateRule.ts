import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRule, type CreateRulePayload } from "@/lib/api";

export const useCreateRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRulePayload) => createRule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rules"] });
    },
  });
};
