import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleRule } from "@/lib/api";

export const useToggleRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rules"] });
    },
  });
};
