import { useQuery, useMutation } from "@tanstack/react-query";
import { api, type AnalyzeResumeRequest } from "@shared/routes";

// GET /api/job-roles
export function useJobRoles() {
  return useQuery({
    queryKey: [api.jobRoles.list.path],
    queryFn: async () => {
      const res = await fetch(api.jobRoles.list.path);
      if (!res.ok) throw new Error("Failed to fetch job roles");
      return api.jobRoles.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/job-roles/:id
export function useJobRole(id: number | null) {
  return useQuery({
    queryKey: [api.jobRoles.get.path, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const url = api.jobRoles.get.path.replace(":id", id.toString());
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch job role");
      return api.jobRoles.get.responses[200].parse(await res.json());
    },
  });
}

// POST /api/analyze
export function useAnalyzeResume() {
  return useMutation({
    mutationFn: async (data: AnalyzeResumeRequest) => {
      // Validate input before sending
      const validated = api.analyze.create.input.parse(data);
      
      const res = await fetch(api.analyze.create.path, {
        method: api.analyze.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.analyze.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Analysis failed. Please try again.");
      }

      return api.analyze.create.responses[200].parse(await res.json());
    },
  });
}
