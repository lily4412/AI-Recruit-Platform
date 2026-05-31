import { useState, useEffect } from "react";
import { masterService } from "../services/masterService";

export function useMasterData() {
  const [data, setData] = useState({
    departments: [], skills: [], jobLevels: [],
    employmentTypes: [], locations: [], aiTools: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [depts, skills, levels, ets, locs, tools] = await Promise.all([
          masterService.getDepartments(),
          masterService.getSkills(),
          masterService.getJobLevels(),
          masterService.getEmploymentTypes(),
          masterService.getLocations(),
          masterService.getAITools(),
        ]);
        const extract = (res) => {
          const d = res.data?.data;
          return d?.results ?? (Array.isArray(d) ? d : []);
        };
        setData({
          departments:     extract(depts),
          skills:          extract(skills),
          jobLevels:       extract(levels),
          employmentTypes: extract(ets),
          locations:       extract(locs),
          aiTools:         extract(tools),
        });
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, []);

  return { ...data, loading };
}
